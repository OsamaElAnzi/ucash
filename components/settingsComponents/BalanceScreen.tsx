import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { resetBalance } from '../../store/slices/transactionsSlice';

export default function BalanceScreen() {
  const { t } = useI18n();
  const dispatch = useDispatch();
  const balance = useSelector((state: RootState) => state.transactions.totalSaldo);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('balanceTitle')}</Text>

      <Text style={styles.balance}>EUR {balance.toFixed(2)}</Text>

      <TouchableOpacity style={styles.button} onPress={() => dispatch(resetBalance())}>
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
