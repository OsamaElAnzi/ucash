import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';

export default function ATMScreen() {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('atmTitle')}</Text>

      <Text>{t('atmPlaceholder')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
});
