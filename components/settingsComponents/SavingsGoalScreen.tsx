import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function SavingsGoalScreen() {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spaardoel instellen</Text>

      <TextInput
        placeholder="Naam van spaardoel"
        style={styles.input}
        value={goalName}
        onChangeText={setGoalName}
      />

      <TextInput
        placeholder="Bedrag (€)"
        style={styles.input}
        keyboardType="numeric"
        value={goalAmount}
        onChangeText={setGoalAmount}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.reset]}>
        <Text style={styles.resetText}>Reset spaardoel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0088ff',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
  reset: { backgroundColor: '#eee' },
  resetText: { textAlign: 'center', fontSize: 16, color: '#444' },
});
