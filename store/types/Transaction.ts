// src/types/Transaction.ts
export type CashItem = {
  denomination: string;
  count: number;
  value: number;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  name: string;
  amount: number;
  cash: CashItem[];
  createdAt: string;
  physicalType: 'cash' | 'contantlose';
};
