import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';

export default function FAQScreen() {
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('faqTitle')}</Text>

      <Text style={styles.question}>{t('faqQ1')}</Text>
      <Text style={styles.answer}>{t('faqA1')}</Text>

      <Text style={styles.question}>{t('faqQ2')}</Text>
      <Text style={styles.answer}>{t('faqA2')}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20 },
  question: { fontSize: 18, fontWeight: '600', marginTop: 10 },
  answer: { fontSize: 16, marginBottom: 10 },
});
