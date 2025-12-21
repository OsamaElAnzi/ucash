import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RecentTransactions from '../components/RecentTransactions';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../store/slices/transactionsSlice';
import { RootState } from '../store/store';
import { selectCashOverview } from '../store/selectors/transactionsSelectors';



const screenHeight = Dimensions.get('window').height;

export default function Home() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const cashOverview = useSelector((state: RootState) => selectCashOverview(state));

  const [transactionType, setTransactionType] = useState<'income' | 'expense' | null>(null);
  const [physicalType, setPhysicalType] = useState<'contant' | 'contantlose' | null>(null);
  const [transactionName, setTransactionName] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null); 
  const [transactionAmount, setTransactionAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState<number>(0);

  const [showCashOptions, setShowCashOptions] = useState(false);
  const [cashType, setCashType] = useState<'biljetten' | 'munten' | null>(null);
  const [cashSelection, setCashSelection] = useState<{ denomination: string; count: number; value: number }[]>([]);
  const [countInputs, setCountInputs] = useState<{ [key: string]: string }>({});

  const isAmountValid = !!transactionType && !!transactionAmount && amountError !== null;

  const bills = ['€5', '€10', '€20', '€50', '€100', '€200'];
  const coins = ['1c', '5c', '10c', '20c', '50c', '€1', '€2'];

  const totalSaldo = useSelector(
    (state: RootState) => state.transactions.totalSaldo
  );

  const spaardoel = 2000;
  const percentage = (totalSaldo / spaardoel) * 100;

  useEffect(() => {
    setRemainingAmount(Number(transactionAmount));
  }, [transactionAmount]);

  const removeCash = (denomination: string) => {
    const item = cashSelection.find(c => c.denomination === denomination);
    if (!item) return;

    setRemainingAmount(prev => prev + (item.count * item.value) / 100);

    setCashSelection(prev =>
      prev.filter(c => c.denomination !== denomination)
    );
  };


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
      setCountInputs({});
    });
  };

  const dispatch = useDispatch();

  const submitTransaction = () => {
  if (!transactionType || !transactionAmount) return;

  let finalCashSelection = [...cashSelection];

  if (physicalType === 'contantlose') {
    finalCashSelection = [
      { denomination: 'contantlose', count: 1, value: Number(transactionAmount) * 100 }
    ];
    console.log(finalCashSelection);
  }

  try {
    dispatch(
      addTransaction(
        transactionType!,
        transactionName,
        Number(transactionAmount),
        finalCashSelection,
        physicalType === 'contant' ? 'cash' : 'contantlose'
      )
    );
    closeModal();
  } catch (err: any) {
    Alert.alert(err.message);
  }
};




  const getDenominationValue = (denomination: string): number => {
    const valueMap: { [key: string]: number } = {
      '€5': 500, '€10': 1000, '€20': 2000, '€50': 5000, '€100': 10000, '€200': 20000,
      '1c': 1, '5c': 5, '10c': 10, '20c': 20, '50c': 50, '€1': 100, '€2': 200,
    };
    return valueMap[denomination] || 0;
  };

  const addCash = (denomination: string, manualCount?: number) => {
    if (remainingAmount <= 0 && manualCount === undefined) {
      Alert.alert("Geen bedrag meer over om te verdelen");
      return;
    }

    const value = getDenominationValue(denomination);
    let count = 0;

    if (manualCount !== undefined) {
      count = manualCount;
      if (count * value > remainingAmount * 100) {
        Alert.alert("Te veel voor het resterende bedrag");
        return;
      }
    } else {
      const amountInCents = Math.round(remainingAmount * 100);
      count = Math.floor(amountInCents / value);
      if (count <= 0) {
        Alert.alert(`Dit biljet/munt is te groot voor het resterende bedrag`);
        return;
      }
    }

    const existing = cashSelection.find(c => c.denomination === denomination);
    if (existing) {
      existing.count += count;
    } else {
      cashSelection.push({ denomination, count, value });
    }

    setCashSelection([...cashSelection]);

    setRemainingAmount((prev) => prev - (count * value) / 100);
  };


const handleAmountChange = (text: string) => {
  validateAmount(text);
  setTransactionAmount(text);
};

const validateAmount = (text: string) => {
  // Alleen cijfers en max 1 punt
  if (!/^\d*\.?\d*$/.test(text)) {
    setAmountError('Gebruik alleen cijfers en één punt (.)');
    return;
  }

  // Max 2 decimalen
  const parts = text.split('.');
  if (parts[1] && parts[1].length > 2) {
    setAmountError('Maximaal 2 cijfers na de punt');
    return;
  }

  setAmountError(null);
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
                      physicalType === 'contant' && styles.typeButtonActive,
                    ]}
                    onPress={() => setPhysicalType('contant')}
                  >
                    <Ionicons name="cash-outline" size={28} />
                    <Text style={styles.typeText}>Contant</Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      physicalType === 'contantlose' && styles.typeButtonActive,
                    ]}
                    onPress={() => setPhysicalType('contantlose')}
                  >
                    <Ionicons name="card-outline" size={28} />
                    <Text style={styles.typeText}>Contant lose</Text>
                  </TouchableOpacity>
                </View>
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
                  placeholderTextColor="#888"
                  value={transactionName}
                  onChangeText={setTransactionName}
                />
               <TextInput
                  style={[
                    styles.input,
                    amountError && { borderColor: 'red' },
                  ]}
                  placeholder="Bedrag"
                  placeholderTextColor="#888"
                  value={transactionAmount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                />

                {amountError && (
                  <Text style={styles.errorText}>{amountError}</Text>
                )}

                {physicalType === 'contant' && (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!transactionType || !transactionAmount) && { opacity: 0.5 }
                  ]}
                  disabled={(!transactionType || !transactionAmount)} // hier wordt het verplicht
                  onPress={() => setShowCashOptions(true)}
                >
                  <Text style={styles.submitButtonText}>
                    Volgende: Biljetten/Munten
                  </Text>
                </TouchableOpacity>
                )}
                {physicalType === 'contantlose' && (
                <TouchableOpacity
                      style={[
                    styles.submitButton,
                    (isAmountValid) && { opacity: 0.5 }
                    ]}
                    disabled={isAmountValid}
                      onPress={submitTransaction}
                    >
                      <Text style={styles.submitButtonText}>Opslaan Transactie</Text>
                    </TouchableOpacity>
                )}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>

                          {/* Klik voor automatische berekening */}
                          <TouchableOpacity
                            onPress={() => addCash(item)}
                            style={{
                              padding: 12,
                              borderWidth: 1,
                              borderColor: '#ddd',
                              borderRadius: 8,
                              marginRight: 10,
                              flex: 1,
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>{item}</Text>
                          </TouchableOpacity>

                          {/* Handmatige input */}
                          <TextInput
                            style={{
                              borderWidth: 1,
                              borderColor: '#ddd',
                              borderRadius: 8,
                              padding: 8,
                              width: 60,
                              textAlign: 'center',
                            }}
                            placeholder="Aantal"
                            placeholderTextColor={'#888'}
                            keyboardType="numeric"
                            value={countInputs[item] || ''}
                            onChangeText={(text) =>
                              setCountInputs(prev => ({ ...prev, [item]: text }))
                            }
                            onEndEditing={() => {
                              if (countInputs[item]) {
                                addCash(item, parseInt(countInputs[item]));
                                setCountInputs(prev => ({ ...prev, [item]: '' }));
                              }
                            }}
                          />
                        </View>
                      )}
                    />




                    <Text style={{ fontWeight: '700', marginTop: 10 }}>Overzicht:</Text>
                    {cashSelection.map(c => (
                      <View key={c.denomination} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                        <Text>{c.denomination} × {c.count}</Text>
                        <TouchableOpacity onPress={() => removeCash(c.denomination)} style={{ backgroundColor: 'red', borderRadius: 12, padding: 6 }}>
                          <Text style={{ color: '#fff' }}>−</Text>
                        </TouchableOpacity>
                      </View>
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
  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 14,
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
