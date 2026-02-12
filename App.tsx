import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import NavigationBar from './components/NavigationBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store/store';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <View style={{ flex: 1 }}>
              <AppNavigator />
              <NavigationBar />
            </View>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

