import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRScannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR-code scannen</Text>

      <Text>QR scanner view komt hier</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
});
