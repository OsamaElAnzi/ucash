import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LanguageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Taal kiezen</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Nederlands</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  button: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
  },
  buttonText: { fontSize: 18 },
});
