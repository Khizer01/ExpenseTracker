import axios from "axios";

export const fetchUsersData = async (id) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const admin = data.find((user) => user.id === id && user.role === true);

    if (!admin) {
      return { success: false, message: "Non Authorized Request." };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchSingleUserData = async (id) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const user = data.find((user) => user.id === id);

    if (!user) {
      return { success: false, message: "User Data Not Found." };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const fetchData = async (userId, role) => {
  if (role) {
    return fetchUsersData(userId);
  } else {
    return fetchSingleUserData(userId);
  }
};

export const addExpense = async (userId, newExpense) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const user = data[userIndex];

    if (newExpense.account) {
      const accIndex = user.account.findIndex(
        (account) => account.name === newExpense.account
      );

      if (accIndex === -1) {
        return {
          success: false,
          message: `Account not found: ${newExpense.account}`,
        };
      }
      if(newExpense.type === 'Expense') {
        user.account[accIndex].amount -= parseFloat(newExpense.amount);
      }
      else {
        user.account[accIndex].amount += parseFloat(newExpense.amount);
      }

    } else {
      return { success: false, message: "Account not provided." };
    }
    if(newExpense.type === 'Expense') {
    const existingExpenseIndex = user.expenditures.findIndex(
      (expense) => expense.category === newExpense.category
    );

    if (existingExpenseIndex !== -1) {
      user.expenditures[existingExpenseIndex].amount += parseFloat(
        newExpense.amount
      );
    } else {
      user.expenditures.push(newExpense);
    }
  }
    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      user
    );

    if (response.status !== 200) {
      throw new Error("Failed to update expenses");
    }

    return { success: true, message: "Expense added successfully." };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, message: error.message };
  }
};

export const addnewIncome = async (userId, newIncome) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const accIndex = data[userIndex].account.findIndex(
      (account) => account.name === newIncome.account
    );

    data[userIndex].account[accIndex].amount = parseFloat(newIncome.amount);

    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      data[userIndex]
    );

    if (response.status !== 200) {
      throw new Error("Failed to update income");
    }

    return { success: true, message: "Income updated successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteTransaction = async (userId, transactionIndex) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const user = data[userIndex];

    user.expenditures.splice(transactionIndex, 1);

    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      user
    );

    if (response.status !== 200) {
      throw new Error("Failed to delete transaction");
    }

    return { success: true, message: "Transaction deleted successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addNewAccount = async (userId, newAccount) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const accIndex = data[userIndex].account.findIndex(
      (account) => account.name === newAccount.name
    );

    if (accIndex === -1) {
      data[userIndex].account.push(newAccount);

      const response = await axios.put(
        `http://localhost:5000/user-data/${userId}`,
        data[userIndex]
      );

      if (response.status !== 200) {
        throw new Error("Failed to update income");
      }

      return { success: true, message: "Account Created Successfully." };
    } else {
      return { success: false, message: "Account Already Exists." };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteExistingAccount = async (userId, accIndex) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const user = data[userIndex];

    user.account.splice(accIndex, 1);

    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      user
    );

    if (response.status !== 200) {
      throw new Error("Failed to delete transaction");
    }

    return { success: true, message: "Transaction deleted successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const addNewCategory = async (userId, newCat, amt) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const catIndex = data[userIndex].category.findIndex(
      (category) => category === newCat
    );

    if (catIndex === -1) {
      data[userIndex].category.push({category: newCat, amount: amt});

      const response = await axios.put(
        `http://localhost:5000/user-data/${userId}`,
        data[userIndex]
      );

      if (response.status !== 200) {
        throw new Error("Failed to update income");
      }

      return { success: true, message: "Account Created Successfully." };
    } else {
      return { success: false, message: "Account Already Exists." };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteExistingCategory = async (userId, catIndex) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const user = data[userIndex];

    user.category.splice(catIndex, 1);

    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      user
    );

    if (response.status !== 200) {
      throw new Error("Failed to delete transaction");
    }

    return { success: true, message: "Transaction deleted successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const resetUserBudget = async (userId, newBudget,category) => {
  try {
    const { data } = await axios.get("http://localhost:5000/user-data");
    if (!data) throw new Error("Failed to fetch data");

    const userIndex = data.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return { success: false, message: "User not found." };
    }

    const catIndex = data[userIndex].category.findIndex(
      (cat) => cat.category === category
    );

    data[userIndex].category[catIndex].amount = newBudget;

    const response = await axios.put(
      `http://localhost:5000/user-data/${userId}`,
      data[userIndex]
    );

    if (response.status !== 200) {
      throw new Error("Failed to update income");
    }

    return { success: true, message: "Account Created Successfully." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
