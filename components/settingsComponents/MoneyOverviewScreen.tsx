import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MoneyOverviewScreen() {
  const [type, setType] = useState<'coins' | 'bills'>('coins');

  const coins = [
    { value: 0.10, count: 3 },
    { value: 0.50, count: 2 },
    { value: 1, count: 5 },
  ];

  const bills = [
    { value: 5, count: 3 },
    { value: 10, count: 2 },
    { value: 20, count: 1 },
  ];

  const data = type === 'coins' ? coins : bills;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geld overzicht</Text>

      <View style={styles.switcher}>
        <TouchableOpacity onPress={() => setType('coins')}>
          <Text style={[styles.switchButton, type === 'coins' && styles.active]}>Munten</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setType('bills')}>
          <Text style={[styles.switchButton, type === 'bills' && styles.active]}>Biljetten</Text>
        </TouchableOpacity>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text>{item.value} €</Text>
          <Text>Aantal: {item.count}</Text>
          <Text>Totaal: {(item.value * item.count).toFixed(2)} €</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  switcher: { flexDirection: 'row', marginBottom: 20, gap: 20 },
  switchButton: { fontSize: 18 },
  active: { fontWeight: '700', color: '#0088ff' },
  row: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
  },
});
