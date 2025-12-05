import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ATMScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pinautomaten in de buurt</Text>

      <Text>Locatie + navigatie functionaliteit komt hier</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
});
