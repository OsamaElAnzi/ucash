import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function RecentTransactions() {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const lastThree = [...transactions].slice(0, 3);

  if (lastThree.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ opacity: 0.6 }}>Nog geen transacties</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lastThree}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <Text style={styles.name}>{item.name}</Text>
            <Text
              style={[
                styles.amount,
                item.type === 'income' ? styles.income : styles.expense,
              ]}
            >
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
