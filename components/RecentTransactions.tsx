import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
};

const dummyTransactions: Transaction[] = [
  { id: '1', name: 'Lunch', amount: 12, type: 'expense' },
  { id: '2', name: 'Salary', amount: 1200, type: 'income' },
  { id: '3', name: 'Groceries', amount: 45, type: 'expense' },
  { id: '4', name: 'Freelance', amount: 300, type: 'income' },
];

export default function RecentTransactions() {
  const lastThree = dummyTransactions.slice(-3).reverse(); // nieuwste eerst

  return (
    <View style={styles.container}>
      <FlatList
        data={lastThree}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
              {item.type === 'income' ? '+' : '-'}€{item.amount}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 160, // hoger gezet zodat het boven de floating button blijft
    width: '100%',
    paddingHorizontal: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '500' },
  amount: { fontSize: 16, fontWeight: '600' },
  income: { color: '#4CAF50' },
  expense: { color: '#F44336' },
});
