import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { useI18n } from '../../i18n/LanguageContext';

export default function QRScannerScreen() {
  const { t } = useI18n();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [scannedValue, setScannedValue] = useState<string | null>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (scannedValue) {
        return;
      }
      const value = codes[0]?.value;
      if (value) {
        setScannedValue(value);
      }
    },
  });

  const canOpenScannedLink = useMemo(() => {
    if (!scannedValue) {
      return false;
    }
    return /^https?:\/\//i.test(scannedValue);
  }, [scannedValue]);

  const handleOpenLink = async () => {
    if (!scannedValue) {
      return;
    }
    try {
      await Linking.openURL(scannedValue);
    } catch {
      Alert.alert(t('qrOpenLinkError'));
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('qrTitle')}</Text>
        <Text style={styles.infoText}>{t('qrNoPermission')}</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>{t('qrGrantPermission')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('qrTitle')}</Text>
        <Text style={styles.infoText}>{t('qrNoDevice')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('qrTitle')}</Text>
      <Text style={styles.infoText}>{t('qrScannerHint')}</Text>

      <View style={styles.cameraFrame}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!scannedValue}
          codeScanner={codeScanner}
        />
        <View style={styles.overlayBox} />
      </View>

      {scannedValue ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{t('qrScannedLabel')}</Text>
          <Text style={styles.resultText}>{scannedValue}</Text>

          {canOpenScannedLink ? (
            <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
              <Text style={styles.buttonText}>{t('qrOpenLink')}</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setScannedValue(null)}>
            <Text style={styles.secondaryButtonText}>{t('qrScanAgain')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 12 },
  infoText: { opacity: 0.75, marginBottom: 12 },
  cameraFrame: {
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  overlayBox: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 14,
    gap: 10,
  },
  resultTitle: { fontSize: 15, fontWeight: '700' },
  resultText: { fontSize: 14, opacity: 0.85 },
  button: {
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#111',
    marginTop: 0,
  },
  secondaryButtonText: {
    color: '#111',
    textAlign: 'center',
    fontWeight: '600',
  },
});
