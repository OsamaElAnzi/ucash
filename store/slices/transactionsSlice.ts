import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Transaction, CashItem } from '../types/Transaction';

type TransactionsState = {
  transactions: Transaction[];
  totalSaldo: number;
};

const initialState: TransactionsState = {
  transactions: [],
  totalSaldo: 0, // start saldo
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: {
      reducer(state, action: PayloadAction<Transaction>) {
        const tx = action.payload;

        // Check of het een expense is
        if (tx.type === 'expense') {
          if (tx.physicalType === 'contantlose') {
            const contantloseBalance = state.transactions.reduce((total, t) => {
              if (t.physicalType !== 'contantlose') return total;
              return total + (t.type === 'income' ? t.amount : -t.amount);
            }, 0);

            if (contantloseBalance < tx.amount) {
              throw new Error('Je hebt niet genoeg contantlose saldo');
            }
          } else {
            // Controleer of er genoeg cash is van elke denomination
            const cashOverview = state.transactions.reduce((map, t) => {
              if (t.physicalType !== 'contant') return map;
              t.cash.forEach(c => {
                map[c.denomination] =
                  (map[c.denomination] || 0) +
                  (t.type === 'income' ? c.count : -c.count);
              });
              return map;
            }, {} as Record<string, number>);

            for (const item of tx.cash) {
              if ((cashOverview[item.denomination] || 0) < item.count) {
                throw new Error(`Je hebt niet genoeg ${item.denomination}`);
              }
            }
          }
        }

        // Voeg transactie toe
        state.transactions.unshift(tx);

        // Update totalSaldo
        if (tx.type === 'income') {
          state.totalSaldo += tx.amount;
        } else {
          state.totalSaldo -= tx.amount;
        }
      },
      prepare(
        type: 'income' | 'expense',
        name: string,
        amount: number,
        cash: CashItem[],
        physicalType: 'contant' | 'contantlose',
      ) {
        return {
          payload: {
            id: nanoid(),
            type,
            name,
            amount,
            cash,
            physicalType,
            createdAt: new Date().toISOString(),
          } as Transaction,
        };
      },
    },
    updateTransaction: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        amount: number;
        type: 'income' | 'expense';
        cash: CashItem[];
        physicalType: 'contant' | 'contantlose';
      }>,
    ) => {
      const { id, name, amount, type, cash, physicalType } = action.payload;

      const existing = state.transactions.find(t => t.id === id);
      if (!existing) return;

      // 1. Saldo terugdraaien van oude transactie
      if (existing.type === 'income') {
        state.totalSaldo -= existing.amount;
      } else {
        state.totalSaldo += existing.amount;
      }

      // 2. Cash validatie opnieuw bij expense
      if (type === 'expense') {
        if (physicalType === 'contantlose') {
          const contantloseBalance = state.transactions.reduce((total, t) => {
            if (t.id === id || t.physicalType !== 'contantlose') return total;
            return total + (t.type === 'income' ? t.amount : -t.amount);
          }, 0);

          if (contantloseBalance < amount) {
            throw new Error('Je hebt niet genoeg contantlose saldo');
          }
        } else {
          const cashOverview = state.transactions.reduce((map, t) => {
            if (t.id === id || t.physicalType !== 'contant') return map; // sla huidige over (we vervangen hem)
            t.cash.forEach(c => {
              map[c.denomination] =
                (map[c.denomination] || 0) +
                (t.type === 'income' ? c.count : -c.count);
            });
            return map;
          }, {} as Record<string, number>);

          for (const item of cash) {
            if ((cashOverview[item.denomination] || 0) < item.count) {
              throw new Error(`Je hebt niet genoeg ${item.denomination}`);
            }
          }
        }
      }

      // 3. Transactie updaten
      existing.name = name;
      existing.amount = amount;
      existing.type = type;
      existing.cash = cash;
      existing.physicalType = physicalType;

      // 4. Saldo opnieuw toepassen
      if (type === 'income') {
        state.totalSaldo += amount;
      } else {
        state.totalSaldo -= amount;
      }
    },
    resetBalance: state => {
      state.transactions = [];
      state.totalSaldo = 0;
    },
  },
});

export const { addTransaction, updateTransaction, resetBalance } = transactionsSlice.actions;
export default transactionsSlice.reducer;
