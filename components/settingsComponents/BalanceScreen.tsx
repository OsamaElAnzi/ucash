import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BalanceScreen() {
  const [balance, setBalance] = useState(1250.75);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn vermogen</Text>

      <Text style={styles.balance}>€ {balance.toFixed(2)}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setBalance(0)}
      >
        <Text style={styles.buttonText}>Reset vermogen</Text>
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
