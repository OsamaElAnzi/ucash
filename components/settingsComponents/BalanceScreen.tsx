import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';

export default function BalanceScreen() {
  const [balance, setBalance] = useState(1250.75);
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('balanceTitle')}</Text>

      <Text style={styles.balance}>EUR {balance.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setBalance(0)}>
        <Text style={styles.buttonText}>{t('balanceReset')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  balance: { fontSize: 40, fontWeight: '700', marginBottom: 30 },
  button: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 12,
  },
  buttonText: { textAlign: 'center', fontSize: 18 },
});
