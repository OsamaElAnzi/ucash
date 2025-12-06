import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RecentTransactions from '../components/RecentTransactions';

const screenHeight = Dimensions.get('window').height;

export default function Home() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // Nieuwe transactie inputs
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | null>(null);
  const [transactionName, setTransactionName] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  // Biljetten / munten
  const [showCashOptions, setShowCashOptions] = useState(false);
  const [cashType, setCashType] = useState<'biljetten' | 'munten' | null>(null);
  const [cashSelection, setCashSelection] = useState<{ denomination: string; count: number }[]>([]);
  const [countInput, setCountInput] = useState('');

  const bills = ['€5', '€10', '€20', '€50', '€100', '€200'];
  const coins = ['1c', '5c', '10c', '20c', '50c', '€1', '€2'];

  // Fake data
  const totalSaldo = 1250;
  const spaardoel = 2000;
  const percentage = (totalSaldo / spaardoel) * 100;

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 260,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setTransactionType(null);
      setTransactionName('');
      setTransactionAmount('');
      setShowCashOptions(false);
      setCashType(null);
      setCashSelection([]);
      setCountInput('');
    });
  };

  const submitTransaction = () => {
    console.log('Type:', transactionType);
    console.log('Naam:', transactionName);
    console.log('Bedrag:', transactionAmount);
    console.log('Cash:', cashSelection);
    closeModal();
  };

  const addCash = (denomination: string) => {
    if (!countInput) return;
    const existing = cashSelection.find(c => c.denomination === denomination);
    if (existing) {
      existing.count += parseInt(countInput);
      setCashSelection([...cashSelection]);
    } else {
      setCashSelection([...cashSelection, { denomination, count: parseInt(countInput) }]);
    }
    setCountInput('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      {/* Totale saldo */}
      <Text style={styles.saldo}>€ {totalSaldo}</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {percentage.toFixed(0)}% van €{spaardoel}
        </Text>
      </View>
      <RecentTransactions />
      {/* Floating Plus Button */}
        <TouchableOpacity
            style={[
                styles.floatingButton,
                { bottom: 50 + insets.bottom }
            ]}
            onPress={openModal}
            >
            <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>


      {/* Modal Bottom Sheet */}
      <Modal visible={modalVisible} transparent animationType="none">
        <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} />

        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {!showCashOptions ? (
              <>
                <Text style={styles.modalTitle}>Nieuwe Transactie</Text>

                {/* Kies type transactie */}
                <View style={styles.typeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      transactionType === 'income' && styles.typeButtonActive,
                    ]}
                    onPress={() => setTransactionType('income')}
                  >
                    <Ionicons name="arrow-down-circle-outline" size={28} color="#4CAF50" />
                    <Text style={styles.typeText}>Inkomen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      transactionType === 'expense' && styles.typeButtonActive,
                    ]}
                    onPress={() => setTransactionType('expense')}
                  >
                    <Ionicons name="arrow-up-circle-outline" size={28} color="#F44336" />
                    <Text style={styles.typeText}>Uitgave</Text>
                  </TouchableOpacity>
                </View>

                {/* Naam en bedrag */}
                <TextInput
                  style={styles.input}
                  placeholder="Naam van transactie"
                  value={transactionName}
                  onChangeText={setTransactionName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Bedrag"
                  value={transactionAmount}
                  onChangeText={setTransactionAmount}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={[styles.submitButton, !transactionType && { opacity: 0.5 }]}
                  disabled={!transactionType}
                  onPress={() => setShowCashOptions(true)}
                >
                  <Text style={styles.submitButtonText}>Volgende: Biljetten/Munten</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Kies Biljetten of Munten</Text>
                {!cashType ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                      style={styles.typeButton}
                      onPress={() => setCashType('biljetten')}
                    >
                      <Text>Biljetten</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.typeButton}
                      onPress={() => setCashType('munten')}
                    >
                      <Text>Munten</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={cashType === 'biljetten' ? bills : coins}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <View style={styles.cashRow}>
                          <Text>{item}</Text>
                          <TextInput
                            style={styles.inputSmall}
                            placeholder="Aantal"
                            keyboardType="numeric"
                            value={countInput}
                            onChangeText={setCountInput}
                          />
                          <TouchableOpacity style={styles.addButton} onPress={() => addCash(item)}>
                            <Text style={{ color: '#fff' }}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    />

                    <Text style={{ fontWeight: '700', marginTop: 10 }}>Overzicht:</Text>
                    {cashSelection.map((c) => (
                      <Text key={c.denomination}>
                        {c.denomination} × {c.count}
                      </Text>
                    ))}

                    <TouchableOpacity
                      style={[styles.submitButton, { marginTop: 10 }]}
                      onPress={submitTransaction}
                    >
                      <Text style={styles.submitButtonText}>Opslaan Transactie</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  saldo: { fontSize: 38, fontWeight: '700' },
  progressContainer: { marginTop: 25 },
  progressBarBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', backgroundColor: '#4CAF50' },
  progressText: { marginTop: 8, fontSize: 14, opacity: 0.8 },

  floatingButton: {
    position: 'absolute',
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#000',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },

  typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    width: '48%',
    justifyContent: 'center',
    gap: 10,
  },
  typeButtonActive: { borderColor: '#000' },
  typeText: { fontSize: 16, fontWeight: '500' },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    width: 60,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cashRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  addButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 8,
  },
});
