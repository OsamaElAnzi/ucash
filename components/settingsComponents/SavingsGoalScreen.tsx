import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import {
  resetSavingsGoal,
  setSavingsGoal,
} from '../../store/slices/savingsGoalSlice';

export default function SavingsGoalScreen() {
  const dispatch = useDispatch();
  const { goalName: currentGoalName, goalAmount: currentGoalAmount } = useSelector(
    (state: RootState) => state.savingsGoal
  );

  const [goalName, setGoalName] = useState(currentGoalName);
  const [goalAmount, setGoalAmount] = useState(String(currentGoalAmount));

  useEffect(() => {
    setGoalName(currentGoalName);
    setGoalAmount(String(currentGoalAmount));
  }, [currentGoalAmount, currentGoalName]);

  const handleSave = () => {
    const normalizedAmount = Number(goalAmount.replace(',', '.'));

    if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
      Alert.alert('Voer een geldig bedrag in');
      return;
    }

    dispatch(
      setSavingsGoal({
        goalName: goalName.trim(),
        goalAmount: normalizedAmount,
      })
    );
    Alert.alert('Spaardoel opgeslagen');
  };

  const handleReset = () => {
    dispatch(resetSavingsGoal());
    Alert.alert('Spaardoel gereset');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Spaardoel instellen</Text>

      <TextInput
        placeholder="Naam van spaardoel"
        style={styles.input}
        value={goalName}
        onChangeText={setGoalName}
      />

      <TextInput
        placeholder="Bedrag (EUR)"
        style={styles.input}
        keyboardType="numeric"
        value={goalAmount}
        onChangeText={setGoalAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Opslaan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.reset]} onPress={handleReset}>
        <Text style={styles.resetText}>Reset spaardoel</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0088ff',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 18 },
  reset: { backgroundColor: '#eee' },
  resetText: { textAlign: 'center', fontSize: 16, color: '#444' },
});
