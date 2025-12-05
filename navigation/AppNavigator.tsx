import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Transactions from '../screens/Transactions';
import TransactionDetails from '../screens/TransactionDetails';
import Settings from '../screens/Settings';
import SavingsGoalScreen from '../components/settingsComponents/SavingsGoalScreen';
import BalanceScreen from '../components/settingsComponents/BalanceScreen';
import MoneyOverviewScreen from '../components/settingsComponents/MoneyOverviewScreen';
import LanguageScreen from '../components/settingsComponents/LanguageScreen';
import ATMScreen from '../components/settingsComponents/ATMScreen';
import QRScannerScreen from '../components/settingsComponents/QRScannerScreen';
import FAQScreen from '../components/settingsComponents/FAQScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }} initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="SavingsGoal" component={SavingsGoalScreen} />
      <Stack.Screen name="Balance" component={BalanceScreen} />
      <Stack.Screen name="MoneyOverview" component={MoneyOverviewScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="ATM" component={ATMScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
    </Stack.Navigator>
  );
}
