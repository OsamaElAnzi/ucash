import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import NavigationBar from './components/NavigationBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StatusBar, useColorScheme } from 'react-native';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <NavigationBar />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

