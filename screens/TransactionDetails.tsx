import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useI18n } from '../i18n/LanguageContext';
import { updateTransaction } from '../store/slices/transactionsSlice';
import { Transaction } from '../store/types/Transaction';

type TransactionDetailsRouteParams = {
  item: Transaction;
};

export default function TransactionDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useI18n();
  const { item } = route.params as TransactionDetailsRouteParams;

  const [name, setName] = useState(item?.name ?? '');
  const [amount, setAmount] = useState(item ? String(item.amount) : '');
  const [type, setType] = useState<'income' | 'expense'>(item?.type ?? 'expense');
  const [physicalType, setPhysicalType] = useState<'contant' | 'contantlose'>(
    item?.physicalType ?? 'contantlose'
  );

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>{t('transactionsNoTransactionFound')}</Text>
      </View>
    );
  }

  const handleSave = () => {
    const parsedAmount = Number(amount);
    if (!name.trim() || Number.isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert(t('savingsInvalidAmount'));
      return;
    }

    try {
      dispatch(
        updateTransaction({
          id: item.id,
          name: name.trim(),
          amount: parsedAmount,
          type,
          cash: item.cash,
          physicalType,
        })
      );
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende fout';
      Alert.alert(message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('transactionsDetailsTitle')}</Text>

      <View style={styles.box}>
        <Text style={styles.label}>{t('transactionsLabelName')}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder={t('transactionsLabelName')}
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>{t('transactionsLabelPrice')}</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder={t('transactionsLabelPrice')}
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>{t('transactionsLabelDate')}</Text>
        <Text style={styles.value}>{item.createdAt}</Text>

        <Text style={styles.label}>{t('transactionsLabelType')}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.choiceButton, type === 'income' && styles.choiceButtonActive]}
            onPress={() => setType('income')}
          >
            <Text style={styles.choiceText}>{t('homeIncome')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceButton, type === 'expense' && styles.choiceButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={styles.choiceText}>{t('homeExpense')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>{t('transactionsLabelPaymentMethod')}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.choiceButton, physicalType === 'contant' && styles.choiceButtonActive]}
            onPress={() => setPhysicalType('contant')}
          >
            <Text style={styles.choiceText}>{t('transactionsPaymentCash')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceButton, physicalType === 'contantlose' && styles.choiceButtonActive]}
            onPress={() => setPhysicalType('contantlose')}
          >
            <Text style={styles.choiceText}>{t('transactionsPaymentCashless')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('transactionsSave')}</Text>
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
  label: { fontSize: 16, opacity: 0.6, marginTop: 15, marginBottom: 8 },
  value: { fontSize: 18, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  choiceButtonActive: {
    borderColor: '#111',
    backgroundColor: '#f4f4f4',
  },
  choiceText: {
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 22,
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
