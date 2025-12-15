import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import NavigationBar from './components/NavigationBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StatusBar, useColorScheme } from 'react-native';
import { Provider } from 'react-redux'
import { store } from './store/store'

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            <AppNavigator />
            <NavigationBar />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

