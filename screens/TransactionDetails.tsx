import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Transaction } from './Transactions'; // Importeer het type
import { useDispatch, useSelector } from 'react-redux';
import { useI18n } from '../i18n/LanguageContext';

type TransactionDetailsRouteParams = {
  item: Transaction;
};

export default function TransactionDetails() {
  const route = useRoute();
  const { t } = useI18n();
  const { item } = route.params as TransactionDetailsRouteParams;
   const dispatch = useDispatch();

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>{t('transactionsNoTransactionFound')}</Text>
      </View>
    );
  }
  function handleSave() {
    // Logica om de wijzigingen op te slaan
    console.log('Opslaan');
    dispatch(
      updateTransaction({
        id: item.id,
        name,
        amount: Number(amount),
        type,
        cash: item.cash, // later uitbreidbaar met editor
        physicalType,
      })
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('transactionsDetailsTitle')}</Text>

      <View style={styles.box}>
        <Text style={styles.label}>{t('transactionsLabelName')}</Text>
        <TextInput style={styles.value}>{item.name}</TextInput>

        <Text style={styles.label}>{t('transactionsLabelPrice')}</Text>
        <TextInput style={styles.value}>€{item.amount?.toFixed(2) ?? item.amount}</TextInput>

        <Text style={styles.label}>{t('transactionsLabelDate')}</Text>
        <Text style={styles.value}>{item.createdAt ?? item.createdAt}</Text>

        <Text style={styles.label}>{t('transactionsLabelType')}</Text>
        <TextInput style={styles.value}>{item.type}</TextInput>

        <Text style={styles.label}>{t('transactionsLabelPaymentMethod')}</Text>
        <TextInput style={styles.value}>
          {item.physicalType === 'contant' ? t('transactionsPaymentCash') : t('transactionsPaymentCashless')}
        </TextInput>
        <TouchableOpacity>
          <Button title={t('transactionsSave')} onPress={() => {}} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#f7f7f7' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },

  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  label: { fontSize: 16, opacity: 0.6, marginTop: 15 },
  value: { fontSize: 20, fontWeight: '600' },
});
function updateTransaction(arg0: {
  id: string; name: any; amount: number; type: any; cash: any; // later uitbreidbaar met editor
  physicalType: any;
}): any {
  throw new Error('Function not implemented.');
}

