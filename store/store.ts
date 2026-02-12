import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import transactionsReducer from './slices/transactionsSlice';
import savingsGoalReducer from './slices/savingsGoalSlice';

const transactionsPersistConfig = {
  key: 'transactions',
  storage: AsyncStorage,
};

const savingsGoalPersistConfig = {
  key: 'savingsGoal',
  storage: AsyncStorage,
};

const persistedTransactionsReducer = persistReducer(
  transactionsPersistConfig,
  transactionsReducer
);
const persistedSavingsGoalReducer = persistReducer(
  savingsGoalPersistConfig,
  savingsGoalReducer
);

export const store = configureStore({
  reducer: {
    transactions: persistedTransactionsReducer,
    savingsGoal: persistedSavingsGoalReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
