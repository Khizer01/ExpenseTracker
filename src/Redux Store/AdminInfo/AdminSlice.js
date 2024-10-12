import { createSlice } from "@reduxjs/toolkit";

const AdminSlice = createSlice({
  name: "data",
  initialState: {
    income: 0,
    budget: 0,
    expenses: 0,
    transactions: [],
    account: [],
    category: [],
  },
  reducers: {
    getData: (state, action) => {
      state.income = action.payload.income;
      state.budget = action.payload.budget;
      state.expenses = action.payload.expenses;
      state.transactions = action.payload.transactions;
      state.account = action.payload.account;
      state.category = action.payload.category;
    },
    addTransaction: (state, action) => {
      const { type, amount, account } = action.payload;
      console.log(action.payload);
      state.transactions.push(action.payload);
      const accIndex = state.account.findIndex((acc) => acc.name === account);

      if (type === "Expense") {
        state.expenses += amount;
        state.account[accIndex].amount -= amount;
        console.log(state.account[accIndex].amount);
      } else if (type === "Income") {
        state.income += amount;
        state.account[accIndex].amount += amount;
        console.log(state.account[accIndex].amount);
      }
    },
    resetIncome: (state, action) => {
      const { type, amount, account } = action.payload;

      const accIndex = state.account.findIndex((acc) => acc.name === account);

      if (type === "Income") {
        const oldAmount = state.account[accIndex]?.amount;
        state.income -= oldAmount;
        state.income += amount;
        state.account[accIndex].amount = amount;
      }
    },
    deleteTrans: (state, action) => {
      const { index, type, amount } = action.payload;

      state.transactions.splice(index, 1);

      if (type === "Expense") {
        state.expenses -= amount;
      } else if (type === "Income") {
        state.income -= amount;
      }
    },
    addAdminTransaction: (state, action) => {
      const { type, amount, adminId, category, account, date } = action.payload;

      const index = state.transactions.findIndex((user) => user.id === adminId);
      if (index === -1) {
        console.error("Admin not found in transactions");
        return;
      }

      const user = state.transactions[index];
      if (!user.expenditures) user.expenditures = [];
      if (!user.account) user.account = [];

      user.expenditures.push({ category, amount, date });

      const userAccIndex = user.account.findIndex(
        (acc) => acc.name === account
      );
      if (userAccIndex === -1) {
        console.error("Account not found in user's accounts");
        return;
      }

      const globalAccIndex = state.account.findIndex(
        (acc) => acc.name === account
      );
      if (globalAccIndex === -1) {
        console.error("Account not found in global accounts");
        return;
      }

      if (type === "expense") {
        state.expenses += amount;
        user.account[userAccIndex].amount -= amount;
        state.account[globalAccIndex].amount -= amount;
      } else if (type === "income") {
        state.income += amount;
        user.account[userAccIndex].amount += amount;
        state.account[globalAccIndex].amount += amount;
      }
    },

    resetAdminIncome: (state, action) => {
      const { amount, adminId, account } = action.payload;

      const index = state.transactions.findIndex((user) => user.id === adminId);
      if (index === -1) {
        console.error("Admin not found in transactions");
        return;
      }

      const userAccIndex = state.transactions[index].account.findIndex(
        (acc) => acc.name === account
      );
      if (userAccIndex === -1) {
        console.error("Account not found in user's accounts");
        return;
      }

      const globalAccIndex = state.account.findIndex(
        (acc) => acc.name === account
      );
      if (globalAccIndex === -1) {
        console.error("Account not found in global accounts");
        return;
      }

      const oldAmount =
        state.transactions[index].account[userAccIndex]?.amount || 0;

      state.transactions[index].account[userAccIndex].amount = amount;
      state.account[globalAccIndex].amount = amount;
      state.income += amount - oldAmount;
    },

    delAdminTrans: (state, action) => {
      const { index, type, amount, adminId, account } = action.payload;

      const userIndex = state.transactions.findIndex(
        (user) => user.id === adminId
      );
      if (userIndex === -1) {
        console.error("Admin not found in transactions");
        return;
      }

      const userAccIndex = state.transactions[userIndex].account.findIndex(
        (acc) => acc.name === account
      );
      if (userAccIndex === -1) {
        console.error("Account not found in user's accounts");
        return;
      }

      const globalAccIndex = state.account.findIndex(
        (acc) => acc.name === account
      );
      if (globalAccIndex === -1) {
        console.error("Account not found in global accounts");
        return;
      }

      state.transactions[userIndex].expenditures.splice(index, 1);

      if (type === "expense") {
        state.expenses -= amount;
        state.transactions[userIndex].account[userAccIndex].amount += amount;
        state.account[globalAccIndex].amount += amount;
      } else if (type === "income") {
        state.income -= amount;
        state.transactions[userIndex].account[userAccIndex].amount -= amount;
        state.account[globalAccIndex].amount -= amount;
      }
    },

    addAccount: (state, action) => {
      const account = state.account.find(
        (acc) => acc.name === action.payload.name
      );
      if (account === undefined) {
        state.account.push({
          name: action.payload.account,
          amount: action.payload.amount,
        });
      } else {
        console.error("Account already exists");
      }
    },
    deleteAccount: (state, action) => {
      const index = state.account.findIndex(
        (acc) => acc.name === action.payload
      );
      state.account.splice(index, 1);
    },
    updateBudget: (state, action) => {
      const { budget, category } = action.payload;
      const index = state.category.findIndex((cat) => cat === category);
      state.category[index].amount = budget;
    },
    updateAdminBudget: (state, action) => {
      const { budget, adminId, category } = action.payload;

      const index = state.transactions.findIndex((user) => user.id === adminId);
      if (index === -1) {
        console.error("Admin not found");
        return;
      }

      const Catindex = state.category.findIndex(
        (cat) => cat.category === category
      );
      if (Catindex !== -1) {
        state.category[Catindex].amount = budget;
        state.transactions[index].category[Catindex].amount = budget;
      } else {
        console.error("Category not found");
      }
    },
    addCategory: (state, action) => {
      const oldCat = state.category.find((cat) => cat === action.payload);
      if (oldCat) {
        console.error("Category already exists");
        return;
      }
      state.category.push(action.payload);
    },
    deleteCategory: (state, action) => {
      const index = state.category.findIndex((cat) => cat === action.payload);
      state.category.splice(index, 1);
    },
    addAdminCategory: (state, action) => {
      const { category, id } = action.payload;
      const findUser = state.transactions.findIndex((user) => user.id === id);
      const oldCat = state.transactions[findUser].category.find(
        (cat) => cat === category
      );
      if (oldCat && findUser) {
        console.error("Category already exists");
        return;
      }
      state.transactions[findUser].category.push({
        category: category,
        amount: 0,
      });
    },
    addAdminAccount: (state, action) => {
      const { account, amount, id } = action.payload;
      const findUser = state.transactions.findIndex((user) => user.id === id);
      const oldAcc = state.transactions[findUser].account.find(
        (acc) => acc === account
      );
      if (oldAcc && findUser) {
        console.error("Account already exists");
        return;
      }
      state.transactions[findUser].account.push({ name: account, amount });
    },
    deleteAdminCategory: (state, action) => {
      const { index, id } = action.payload;
      const findUser = state.transactions.findIndex((user) => user.id === id);
      state.transactions[findUser].category.splice(index, 1);
      state.category.splice(index, 1);
    },
    deleteAdminAccount: (state, action) => {
      const { index, id } = action.payload;
      const findUser = state.transactions.findIndex((user) => user.id === id);
      state.transactions[findUser]?.account?.splice(index, 1);
    },
  },
});

export const {
  getData,
  addTransaction,
  resetIncome,
  resetAdminIncome,
  addAdminTransaction,
  deleteTrans,
  delAdminTrans,
  addAccount,
  updateBudget,
  deleteAccount,
  deleteCategory,
  addCategory,
  addAdminCategory,
  addAdminAccount,
  deleteAdminAccount,
  deleteAdminCategory,
  updateAdminBudget,
} = AdminSlice.actions;

export default AdminSlice.reducer;
