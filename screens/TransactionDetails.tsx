import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

type TransactionDetailsRouteParams = {
  item: { name: string; price: number; date: string };
};

export default function TransactionDetails() {
  const route = useRoute();
  const { item } = route.params as TransactionDetailsRouteParams;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactie Details</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Naam</Text>
        <Text style={styles.value}>{item.name}</Text>

        <Text style={styles.label}>Prijs</Text>
        <Text style={styles.value}>€{item.price}</Text>

        <Text style={styles.label}>Datum</Text>
        <Text style={styles.value}>{item.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },

  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  label: { fontSize: 16, opacity: 0.6, marginTop: 15 },
  value: { fontSize: 20, fontWeight: '600' },
});
