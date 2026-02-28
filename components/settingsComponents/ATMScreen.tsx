import React, { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../i18n/LanguageContext';

type AtmPoint = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  distanceKm: number;
};

type GeldmaatLocation = {
  id: string;
  city?: string;
  streetAddress?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  functionality?: string[];
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const PHOTON_URL = 'https://photon.komoot.io/api';
const GELDMAAT_LOCATIONS_URL = 'https://api.prod.locator-backend.geldmaat.nl/locations';
const RADIUS_METERS = 5000;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthKm * c;
}

async function fetchWithTimeout(input: string, init?: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function findCenterFromGeldmaatData(query: string, locations: GeldmaatLocation[]) {
  const q = normalizeText(query);
  if (!q) {
    return null;
  }

  const normalizedZip = q.replace(/\s+/g, '');
  const hasZipShape = /^[0-9]{4}[a-z]{0,2}$/.test(normalizedZip);

  const candidates = locations.filter(item => {
    const city = normalizeText(item.city ?? '');
    const zip = normalizeText((item.zip ?? '').replace(/\s+/g, ''));
    const street = normalizeText(item.streetAddress ?? '');
    if (hasZipShape) {
      return zip.startsWith(normalizedZip);
    }
    return city === q || city.includes(q) || street.includes(q);
  });

  const withCoords = candidates.filter(
    item => typeof item.latitude === 'number' && typeof item.longitude === 'number'
  );
  if (!withCoords.length) {
    return null;
  }

  // Use average coordinate of matched area (city/zipcode) as search center.
  const sum = withCoords.reduce(
    (acc, item) => ({
      lat: acc.lat + (item.latitude as number),
      lon: acc.lon + (item.longitude as number),
    }),
    { lat: 0, lon: 0 }
  );

  return {
    lat: sum.lat / withCoords.length,
    lon: sum.lon / withCoords.length,
  };
}

export default function ATMScreen() {
  const { t } = useI18n();
  const [query, setQuery] = useState('Utrecht');
  const [clientFilter, setClientFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AtmPoint[]>([]);
  const insets = useSafeAreaInsets();

  const openNavigation = async (latitude: number, longitude: number) => {
    const googleNav = `google.navigation:q=${latitude},${longitude}`;
    const webDirections = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    const appleMaps = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;

    try {
      if (Platform.OS === 'android' && (await Linking.canOpenURL(googleNav))) {
        await Linking.openURL(googleNav);
        return;
      }
      if (Platform.OS === 'ios' && (await Linking.canOpenURL(appleMaps))) {
        await Linking.openURL(appleMaps);
        return;
      }
      await Linking.openURL(webDirections);
    } catch {
      Alert.alert(t('atmOpenNavigationError'));
    }
  };

  const openAllAtmsInMaps = async () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Geldmaat pinautomaat nederland')}`;
    try {
      await Linking.openURL(mapsUrl);
    } catch {
      Alert.alert(t('atmOpenNavigationError'));
    }
  };

  const getLocationFromQuery = async (search: string) => {
    const url =
      `${NOMINATIM_URL}?format=jsonv2&countrycodes=nl&limit=1&addressdetails=1&q=` +
      encodeURIComponent(search.trim());
    const response = await fetchWithTimeout(url, { headers: { Accept: 'application/json' } });

    if (response.ok) {
      const data = (await response.json()) as Array<{ lat: string; lon: string }>;
      if (data.length) {
        return { lat: Number(data[0].lat), lon: Number(data[0].lon) };
      }
    }

    const photonResponse = await fetchWithTimeout(
      `${PHOTON_URL}?q=${encodeURIComponent(search.trim())}&limit=5&lang=nl`,
      { headers: { Accept: 'application/json' } }
    );
    if (!photonResponse.ok) {
      return null;
    }
    const photonData = (await photonResponse.json()) as {
      features?: Array<{
        geometry?: { coordinates?: [number, number] };
        properties?: { countrycode?: string };
      }>;
    };

    const nlFeature = (photonData.features ?? []).find(
      feature => feature.properties?.countrycode?.toLowerCase() === 'nl'
    );
    const coords = nlFeature?.geometry?.coordinates;
    if (!coords) {
      return null;
    }
    return { lat: coords[1], lon: coords[0] };
  };

  const fetchGeldmaatLocations = async () => {
    const response = await fetchWithTimeout(
      GELDMAAT_LOCATIONS_URL,
      { headers: { Accept: 'application/json' } },
      30000
    );

    if (!response.ok) {
      throw new Error('geldmaat_locations_failed');
    }

    const payload = (await response.json()) as { data?: GeldmaatLocation[] };
    return payload.data ?? [];
  };

  const mapLocationsWithinRadius = (locations: GeldmaatLocation[], lat: number, lon: number) => {
    return locations
      .map((item): AtmPoint | null => {
        if (typeof item.latitude !== 'number' || typeof item.longitude !== 'number') {
          return null;
        }

        const distanceKm = calculateDistanceKm(lat, lon, item.latitude, item.longitude);
        if (distanceKm > RADIUS_METERS / 1000) {
          return null;
        }

        const city = item.city ?? '';
        const streetAddress = item.streetAddress ?? '';
        const zip = item.zip ?? '';
        const functionality = item.functionality?.join(', ') ?? 'Geldautomaat';
        const address = [streetAddress, zip, city].filter(Boolean).join(', ').trim() || '-';

        return {
          id: item.id,
          name: `Geldmaat - ${functionality}`,
          latitude: item.latitude,
          longitude: item.longitude,
          address,
          distanceKm,
        };
      })
      .filter((entry): entry is AtmPoint => entry !== null)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  };

  const searchAtms = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    try {
      const locations = await fetchGeldmaatLocations();
      const geocodedLocation = await getLocationFromQuery(query);
      const fallbackLocation = findCenterFromGeldmaatData(query, locations);
      const location = geocodedLocation ?? fallbackLocation;
      if (!location) {
        setResults([]);
        Alert.alert(t('atmSearchError'), t('atmLocationNotFound'));
        return;
      }

      const atms = mapLocationsWithinRadius(locations, location.lat, location.lon);
      setResults(atms);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown_error';
      Alert.alert(t('atmSearchError'), message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    const normalized = clientFilter.trim().toLowerCase();
    if (!normalized) {
      return results;
    }
    return results.filter(item => `${item.name} ${item.address}`.toLowerCase().includes(normalized));
  }, [clientFilter, results]);

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 90 + insets.bottom }]}>
      <Text style={styles.title}>{t('atmTitle')}</Text>
      <Text style={styles.subtitle}>{t('atmPlaceholder')}</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('atmSearchPlaceholder')}
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchAtms} disabled={loading}>
        <Text style={styles.searchButtonText}>{loading ? t('atmSearching') : t('atmSearchButton')}</Text>
      </TouchableOpacity>

      <TextInput
        value={clientFilter}
        onChangeText={setClientFilter}
        placeholder={t('atmFilterPlaceholder')}
        placeholderTextColor="#888"
        style={styles.input}
      />

      <Text style={styles.resultsTitle}>{t('atmResultsTitle')}</Text>
      <FlatList
        data={filteredResults}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('atmNoResults')}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.atmCard} onPress={() => openNavigation(item.latitude, item.longitude)}>
            <Text style={styles.atmTitle}>{item.name}</Text>
            <Text style={styles.atmMeta}>{item.address}</Text>
            <Text style={styles.atmMeta}>
              {item.distanceKm.toFixed(2)} {t('atmDistanceKm')}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={openAllAtmsInMaps}>
        <Text style={styles.buttonText}>{t('atmOpenAllInMaps')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { marginBottom: 12, opacity: 0.75 },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 8,
  },
  list: {
    flex: 1,
    marginBottom: 14,
  },
  emptyText: {
    opacity: 0.7,
    paddingVertical: 10,
  },
  atmCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  atmTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  atmMeta: {
    fontSize: 13,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
