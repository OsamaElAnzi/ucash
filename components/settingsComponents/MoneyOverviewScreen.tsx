import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { selectCashOverview } from '../../store/selectors/transactionsSelectors';
import { useI18n } from '../../i18n/LanguageContext';

type CashItem = {
  denomination: string;
  value: number;
  count: number;
};

export default function MoneyOverviewScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<'coins' | 'bills' | 'contantlose'>('bills');

  const cashOverview = useSelector(selectCashOverview);
  const { coins = [], bills = [], contantloseTotal = 0 } = cashOverview || {};

  const allBills: CashItem[] = [
    { denomination: '\u20AC5', value: 5, count: 0 },
    { denomination: '\u20AC10', value: 10, count: 0 },
    { denomination: '\u20AC20', value: 20, count: 0 },
    { denomination: '\u20AC50', value: 50, count: 0 },
    { denomination: '\u20AC100', value: 100, count: 0 },
    { denomination: '\u20AC200', value: 200, count: 0 },
  ];

  const allCoins: CashItem[] = [
    { denomination: '1c', value: 0.01, count: 0 },
    { denomination: '5c', value: 0.05, count: 0 },
    { denomination: '10c', value: 0.1, count: 0 },
    { denomination: '20c', value: 0.2, count: 0 },
    { denomination: '50c', value: 0.5, count: 0 },
    { denomination: '\u20AC1', value: 1, count: 0 },
    { denomination: '\u20AC2', value: 2, count: 0 },
  ];

  const mergeData = (master: CashItem[], data: CashItem[]): CashItem[] =>
    master.map(item => {
      const found = data.find(d => d.denomination === item.denomination);
      return { ...item, count: found ? found.count : 0 };
    });

  const data: CashItem[] =
    type === 'coins'
      ? mergeData(allCoins, coins)
      : type === 'bills'
        ? mergeData(allBills, bills)
        : [];

  const totalAmountCard = type === 'contantlose' ? contantloseTotal : 0;
  const totalAmount = data.reduce((sum, item) => sum + item.value * item.count, 0);

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: 90 + insets.bottom }]}>
      <Text style={styles.title}>{t('moneyOverviewTitle')}</Text>

      <View style={styles.switcher}>
        <TouchableOpacity
          style={[styles.switchButton, type === 'coins' && styles.activeSwitch]}
          onPress={() => setType('coins')}
        >
          <Text style={[styles.switchText, type === 'coins' && styles.activeText]}>
            {t('moneyOverviewCoins')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, type === 'bills' && styles.activeSwitch]}
          onPress={() => setType('bills')}
        >
          <Text style={[styles.switchText, type === 'bills' && styles.activeText]}>
            {t('moneyOverviewBills')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, type === 'contantlose' && styles.activeSwitch]}
          onPress={() => setType('contantlose')}
        >
          <Text style={[styles.switchText, type === 'contantlose' && styles.activeText]}>
            {t('moneyOverviewCashless')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>{t('moneyOverviewDenomination')}</Text>
          <Text style={[styles.cell, styles.headerCell]}>{t('moneyOverviewCount')}</Text>
          <Text style={[styles.cell, styles.headerCell]}>{t('moneyOverviewTotal')}</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {type === 'contantlose' ? (
            <View style={styles.row}>
              <Text style={styles.cell}>{t('moneyOverviewCashless')}</Text>
              <Text style={styles.cell}>{t('moneyOverviewDash')}</Text>
              <Text style={styles.cell}>EUR {contantloseTotal.toFixed(2)}</Text>
            </View>
          ) : (
            data.map(item => (
              <View key={item.denomination} style={styles.row}>
                <Text style={styles.cell}>{item.denomination}</Text>
                <Text style={styles.cell}>{item.count}</Text>
                <Text style={styles.cell}>EUR {(item.value * item.count).toFixed(2)}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>{t('moneyOverviewTotalLabel')}</Text>
          <Text style={styles.totalText}></Text>
          {type === 'contantlose' ? (
            <Text style={styles.totalText}>EUR {totalAmountCard.toFixed(2)}</Text>
          ) : (
            <Text style={styles.totalText}>EUR {totalAmount.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 20 },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 22, color: '#111' },

  switcher: { flexDirection: 'row', marginBottom: 16, justifyContent: 'center', gap: 8 },
  switchButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    alignItems: 'center',
  },
  activeSwitch: { backgroundColor: '#111', borderColor: '#111' },
  switchText: { fontSize: 15, fontWeight: '600', color: '#555' },
  activeText: { color: '#fff' },

  table: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ececec',
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: { backgroundColor: '#f6f6f6', borderBottomWidth: 1, borderBottomColor: '#e7e7e7' },
  cell: { flex: 1, textAlign: 'center', fontSize: 15, color: '#2a2a2a', paddingHorizontal: 6 },
  headerCell: { fontWeight: '700', color: '#666', fontSize: 13 },

  totalRow: { backgroundColor: '#111', borderBottomWidth: 0 },
  totalText: { flex: 1, textAlign: 'center', fontWeight: '700', color: '#fff', fontSize: 15 },
});
