import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  SavingsGoal: undefined;
  Balance: undefined;
  MoneyOverview: undefined;
  Language: undefined;
  ATM: undefined;
  QRScanner: undefined;
  FAQ: undefined;
};

export default function Settings() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instellingen</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 1. Spaardoel instellen */}
        <SettingButton
          icon="trophy-outline"
          label="Spaardoel instellen"
          onPress={() => navigation.navigate('SavingsGoal')}
        />

        {/* 2. Vermogen */}
        <SettingButton
          icon="wallet-outline"
          label="Mijn vermogen"
          onPress={() => navigation.navigate('Balance')}
        />

        {/* 3. Biljetten & munten */}
        <SettingButton
          icon="cash-outline"
          label="Biljetten & munten overzicht"
          onPress={() => navigation.navigate('MoneyOverview')}
        />

        {/* 4. Taalinstellingen */}
        <SettingButton
          icon="language-outline"
          label="Taal wijzigen"
          onPress={() => navigation.navigate('Language')}
        />

        {/* 5. Locatie + pinautomaten */}
        <SettingButton
          icon="location-outline"
          label="Pinautomaten in de buurt"
          onPress={() => navigation.navigate('ATM')}
        />

        {/* 6. QR-code scanner */}
        <SettingButton
          icon="qr-code-outline"
          label="QR-code scannen"
          onPress={() => navigation.navigate('QRScanner')}
        />

        {/* 7. FAQ */}
        <SettingButton
          icon="help-circle-outline"
          label="FAQ"
          onPress={() => navigation.navigate('FAQ')}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ucash</Text>
        <Text style={styles.footerText}>Privacy Statement</Text>
        <Text style={styles.footerText}>Versie 1.0.0</Text>
      </View>
    </View>
  );
}

function SettingButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.leftRow}>
        <Icon name={icon} type="ionicon" size={26} color="#333" />
        <Text style={styles.buttonText}>{label}</Text>
      </View>
      <Icon name="chevron-forward" type="ionicon" size={22} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 40, backgroundColor: '#F9F9F9' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 30 },
  button: { backgroundColor: '#fff', padding: 18, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, elevation: 3 },
  leftRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  buttonText: { fontSize: 18, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
  footerText: { fontSize: 14, opacity: 0.6 },
});
