import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

type RootStackParamList = {
  TransactionDetails: { item: Transaction };
};

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
  type: 'income' | 'expense';
  physicalType: 'contant' | 'contantlose';
}

export default function Transactions() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Redux transactions ophalen
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const [searchName, setSearchName] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // Filtering
  const filtered = transactions.filter(t => {
    const nameMatch = t.name.toLowerCase().includes(searchName.toLowerCase());
    const priceMatch =
      searchPrice === '' || t.amount === Number(searchPrice);
    const dateMatch =
      searchDate === '' || t.createdAt.includes(searchDate);

    return nameMatch && priceMatch && dateMatch;
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity style={styles.item}
    onPress={() => navigation.navigate('TransactionDetails', { item })}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.createdAt}</Text>
      </View>
      <Text style={styles.itemPrice}>€{item.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacties</Text>

      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Filter op naam"
          style={styles.input}
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          placeholder="Filter op prijs"
          style={styles.input}
          value={searchPrice}
          onChangeText={setSearchPrice}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Filter op datum (YYYY-MM-DD)"
          style={styles.input}
          value={searchDate}
          onChangeText={setSearchDate}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#f7f7f7' },
  title: { fontSize: 28, fontWeight: '600', marginBottom: 20 },

  filterContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  itemName: { fontSize: 18, fontWeight: '600' },
  itemDate: { fontSize: 14, opacity: 0.6 },

  itemPrice: { fontSize: 18, fontWeight: '600' },
});
