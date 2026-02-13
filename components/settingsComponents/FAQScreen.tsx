import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';
import { TranslationKey } from '../../i18n/translations';

export default function FAQScreen() {
  const { t } = useI18n();
  const faqItems: Array<{ q: TranslationKey; a: TranslationKey }> = [
    { q: 'faqQ1', a: 'faqA1' },
    { q: 'faqQ2', a: 'faqA2' },
    { q: 'faqQ3', a: 'faqA3' },
    { q: 'faqQ4', a: 'faqA4' },
    { q: 'faqQ5', a: 'faqA5' },
    { q: 'faqQ6', a: 'faqA6' },
    { q: 'faqQ7', a: 'faqA7' },
    { q: 'faqQ8', a: 'faqA8' },
    { q: 'faqQ9', a: 'faqA9' },
    { q: 'faqQ10', a: 'faqA10' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('faqTitle')}</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {faqItems.map(item => (
          <View key={item.q} style={styles.card}>
            <Text style={styles.question}>{t(item.q)}</Text>
            <Text style={styles.answer}>{t(item.a)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20 },
  scrollContent: { paddingBottom: 30 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ececec',
    padding: 14,
    marginBottom: 12,
  },
  question: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  answer: { fontSize: 16, lineHeight: 22 },
});
