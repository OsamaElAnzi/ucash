import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCashOverview } from '../../store/selectors/transactionsSelectors';

type CashItem = {
  denomination: string;
  value: number;
  count: number;
};

export default function MoneyOverviewScreen() {
  const [type, setType] = useState<'coins' | 'bills'>('bills');

  // Haal de cash-overview op uit Redux
  const { coins, bills } = useSelector(selectCashOverview);

  // Masterlijsten zodat alle biljetten/munten altijd zichtbaar zijn
  const allBills: CashItem[] = [
    { denomination: '€5', value: 5, count: 0 },
    { denomination: '€10', value: 10, count: 0 },
    { denomination: '€20', value: 20, count: 0 },
    { denomination: '€50', value: 50, count: 0 },
    { denomination: '€100', value: 100, count: 0 },
    { denomination: '€200', value: 200, count: 0 },
  ];

  const allCoins: CashItem[] = [
    { denomination: '1c', value: 0.01, count: 0 },
    { denomination: '5c', value: 0.05, count: 0 },
    { denomination: '10c', value: 0.1, count: 0 },
    { denomination: '20c', value: 0.2, count: 0 },
    { denomination: '50c', value: 0.5, count: 0 },
    { denomination: '€1', value: 1, count: 0 },
    { denomination: '€2', value: 2, count: 0 },
  ];

  // Merge Redux-data met masterlijst
  const mergeData = (master: CashItem[], data: CashItem[]) =>
    master.map(item => {
      const found = data.find(d => d.denomination === item.denomination);
      return { ...item, count: found ? found.count : 0 };
    });

  const data = type === 'coins' ? mergeData(allCoins, coins) : mergeData(allBills, bills);

  const totalAmount = data.reduce((sum, item) => sum + item.value * item.count, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geld Overzicht</Text>

      {/* Switcher */}
      <View style={styles.switcher}>
        <TouchableOpacity
          style={[styles.switchButton, type === 'coins' && styles.activeSwitch]}
          onPress={() => setType('coins')}
        >
          <Text style={[styles.switchText, type === 'coins' && styles.activeText]}>Munten</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, type === 'bills' && styles.activeSwitch]}
          onPress={() => setType('bills')}
        >
          <Text style={[styles.switchText, type === 'bills' && styles.activeText]}>Biljetten</Text>
        </TouchableOpacity>
      </View>

      {/* Tabel */}
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell]}>Denomination</Text>
          <Text style={[styles.cell, styles.headerCell]}>Aantal</Text>
          <Text style={[styles.cell, styles.headerCell]}>Totaal (€)</Text>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {data.map(item => (
            <View key={item.denomination} style={styles.row}>
              <Text style={styles.cell}>{item.denomination}</Text>
              <Text style={styles.cell}>{item.count}</Text>
              <Text style={styles.cell}>{(item.value * item.count).toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Totaal</Text>
          <Text style={styles.totalText}></Text>
          <Text style={styles.totalText}>{totalAmount.toFixed(2)} €</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#222' },

  switcher: { flexDirection: 'row', marginBottom: 20, justifyContent: 'center' },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeSwitch: { backgroundColor: '#1e88e5' },
  switchText: { fontSize: 16, fontWeight: '500', color: '#555' },
  activeText: { color: '#fff', fontWeight: '700' },

  table: { flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: { backgroundColor: '#f0f2f5', borderBottomWidth: 2 },
  cell: { flex: 1, textAlign: 'center', fontSize: 16, color: '#333' },
  headerCell: { fontWeight: '700', color: '#666' },

  totalRow: { backgroundColor: '#1e88e5' },
  totalText: { flex: 1, textAlign: 'center', fontWeight: '700', color: '#fff', fontSize: 16 },
});
