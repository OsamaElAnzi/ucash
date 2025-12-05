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

type RootStackParamList = {
  TransactionDetails: { item: Transaction };
};

interface Transaction {
  id: string;
  name: string;
  price: number;
  date: string;
}

export default function Transactions() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [searchName, setSearchName] = useState('');
  const [searchPrice, setSearchPrice] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // Fake data
  const [transactions] = useState<Transaction[]>([
    { id: '1', name: 'Boodschappen', price: 40, date: '2025-01-12' },
    { id: '2', name: 'Salaris', price: 2000, date: '2025-01-10' },
    { id: '3', name: 'Netflix', price: 12, date: '2025-01-05' },
    { id: '4', name: 'Benzine', price: 65, date: '2025-01-03' },
  ]);

  // Filtering
  const filtered = transactions.filter(t => {
    return (
      t.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchPrice === '' || t.price.toString().includes(searchPrice)) &&
      t.date.includes(searchDate)
    );
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('TransactionDetails', { item })}
    >
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.date}</Text>
      </View>
      <Text style={styles.itemPrice}>€{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacties</Text>

      {/* Filters */}
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
  container: { flex: 1, padding: 20, paddingTop: 30 },
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
