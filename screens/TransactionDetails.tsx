import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Transaction } from './Transactions'; // Importeer het type

type TransactionDetailsRouteParams = {
  item: Transaction;
};

export default function TransactionDetails() {
  const route = useRoute();
  const { item } = route.params as TransactionDetailsRouteParams;

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Geen transactie gevonden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transactie Details</Text>

      <View style={styles.box}>
        <Text style={styles.label}>Naam</Text>
        <Text style={styles.value}>{item.name}</Text>

        <Text style={styles.label}>Prijs</Text>
        <Text style={styles.value}>€{item.amount?.toFixed(2) ?? item.amount}</Text>

        <Text style={styles.label}>Datum</Text>
        <Text style={styles.value}>{item.createdAt ?? item.createdAt}</Text>

        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{item.type}</Text>

        <Text style={styles.label}>Betaalwijze</Text>
        <Text style={styles.value}>
          {item.physicalType === 'contant' ? 'Contant' : 'Contantlose'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#f7f7f7' },
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
