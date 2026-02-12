import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SavingsGoalState = {
  goalName: string;
  goalAmount: number;
};

const initialState: SavingsGoalState = {
  goalName: '',
  goalAmount: 2000,
};

const savingsGoalSlice = createSlice({
  name: 'savingsGoal',
  initialState,
  reducers: {
    setSavingsGoal: (
      state,
      action: PayloadAction<{ goalName: string; goalAmount: number }>
    ) => {
      state.goalName = action.payload.goalName;
      state.goalAmount = action.payload.goalAmount;
    },
    resetSavingsGoal: state => {
      state.goalName = '';
      state.goalAmount = 2000;
    },
  },
});

export const { setSavingsGoal, resetSavingsGoal } = savingsGoalSlice.actions;
export default savingsGoalSlice.reducer;
