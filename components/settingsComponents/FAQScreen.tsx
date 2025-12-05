import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FAQScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAQ</Text>

      <Text style={styles.question}>Hoe werkt Ucash?</Text>
      <Text style={styles.answer}>Ucash helpt je met sparen en transacties beheren.</Text>

      <Text style={styles.question}>Is Ucash gratis?</Text>
      <Text style={styles.answer}>Ja, volledig gratis.</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20 },
  question: { fontSize: 18, fontWeight: '600', marginTop: 10 },
  answer: { fontSize: 16, marginBottom: 10 },
});
