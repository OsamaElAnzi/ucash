/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-navigation/native', () => {
  return {
    __esModule: true,
    NavigationContainer: ({ children }: { children: any }) => children,
  };
});

jest.mock('redux-persist/integration/react', () => {
  return {
    __esModule: true,
    PersistGate: ({ children }: { children: any }) => children,
  };
});

jest.mock('react-native-safe-area-context', () => {
  return {
    __esModule: true,
    SafeAreaProvider: ({ children }: { children: any }) => children,
    SafeAreaView: ({ children }: { children: any }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('../navigation/AppNavigator', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return require('react').createElement(View, { testID: 'app-navigator' });
  },
}));

jest.mock('../components/NavigationBar', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return require('react').createElement(View, { testID: 'navigation-bar' });
  },
}));

import App from '../App';

test('renders correctly', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    tree!.unmount();
  });
});
