import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useI18n } from '../../i18n/LanguageContext';

export default function LanguageScreen() {
  const { language, setLanguage, t } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('languageTitle')}</Text>

      <TouchableOpacity
        style={[styles.button, language === 'nl' && styles.activeButton]}
        onPress={() => setLanguage('nl')}
      >
        <Text style={styles.buttonText}>{t('languageDutch')}</Text>
        {language === 'nl' ? <Text style={styles.badge}>{t('languageSelected')}</Text> : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, language === 'en' && styles.activeButton]}
        onPress={() => setLanguage('en')}
      >
        <Text style={styles.buttonText}>{t('languageEnglish')}</Text>
        {language === 'en' ? <Text style={styles.badge}>{t('languageSelected')}</Text> : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: { fontSize: 18 },
  activeButton: {
    borderWidth: 2,
    borderColor: '#1e88e5',
  },
  badge: { color: '#1e88e5', fontWeight: '700' },
});
