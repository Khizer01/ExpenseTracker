import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  addAdminTransaction,
  delAdminTrans,
  resetAdminIncome,
} from "../../../Redux Store/AdminInfo/AdminSlice";
import {
  addExpense,
  addnewIncome,
  deleteTransaction,
} from "../../../ApiCalls/UsersData/fetchData";

export default function AdminManageExpenses() {
  const { t } = useTranslation();
  const currentUser = useSelector((state) => state.user.currentUser);
  const userData = useSelector((state) => state.data);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    account: "",
    date: new Date().toLocaleDateString(),
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [filterData, setFilterData] = useState({
    account: "",
    type: "all",
    category: "",
    date: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    setData(userData?.transactions);
  }, [userData]);

  const hideFilters = (e) => {
    if (e.target.classList.contains("modalBackground")) {
      setShowFilterModal(false);
    }
  };

  const validateForm = () => {
    if (
      !formData.amount ||
      (formData.type === "expense" && !formData.category)
    ) {
      setPopupMessage(t("fillAllFields"));
      setTimeout(() => setPopupMessage(""), 2000);
      return false;
    }
    if (parseFloat(formData.amount) < 0) {
      setPopupMessage(t("negativeAmount"));
      setTimeout(() => setPopupMessage(""), 2000);
      return false;
    }
    return true;
  };

  const handleModalClose = (e) => {
    if (e.target.classList.contains("modalBackground")) {
      setShowModal(false);
    }
  };

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const accIndex = userData.account.findIndex(
      (acc) => acc.name === formData.account
    );
    const remainingBalance =
      userData.account[accIndex].amount - formData.amount;
    if (formData.type === "expense" && remainingBalance < 0) {
      setPopupMessage(t("insufficientBalance"));
      setTimeout(() => setPopupMessage(""), 2000);
      return;
    }

    const newTransaction = {
      adminId: currentUser.id,
      name: currentUser.username,
      type: formData.type,
      account: formData.account,
      category: formData.category || t("Income"),
      amount: parseFloat(formData.amount),
      date: formData.date || new Date().toLocaleDateString(),
    };
    addExpense(currentUser?.id, {
      category: formData.category || t("general"),
      amount: parseFloat(formData.amount),
      account: formData.account,
      date: formData.date || new Date().toLocaleDateString(),
    }).then(() => {
      dispatch(addAdminTransaction(newTransaction));
      setFormData({ type: "expense", category: "", amount: "", account: "" });
      setShowModal(false);
      setPopupMessage("Transaction created successfully");
      setTimeout(() => setPopupMessage(""), 2000);
    });
  };

  const handleResetIncome = (e) => {
    e.preventDefault();
    addnewIncome(currentUser?.id, {
      amount: parseFloat(formData.amount),
      account: formData.account,
    }).then(() => {
      dispatch(
        resetAdminIncome({
          type: "Income",
          amount: parseFloat(formData.amount),
          adminId: currentUser.id,
          account: formData.account,
        })
      );
      setShowModal(false);
      setFormData({ type: "expense", category: "", amount: "", account: "" });
      setPopupMessage("Income reset successfully");
      setTimeout(() => setPopupMessage(""), 2000);
    });
  };

  const handleDeleteTransaction = (index, amount, type) => {
    deleteTransaction(currentUser?.id, index).then(() => {
      dispatch(
        delAdminTrans({
          index,
          adminId: currentUser?.id,
          type: type || "expense",
          amount,
        })
      );
    });
    setPopupMessage("Transaction deleted successfully");
    setTimeout(() => setPopupMessage(""), 2000);
  };

  const handleFilterTransactions = () => {
    const filteredData = userData?.transactions.filter((user) => {
      
      const userTransactions = user.expenditures.filter((transaction) => {
        let isType = true;
        let isDate = true;
        let isAccount = true;
        let isCategory = true;
        
        // Filter by transaction type
        if (filterData.type !== "all") {
          isType = (transaction.type || "expense") === filterData.type;
        }
  
        // Filter by date
        if (filterData.date) {
          isDate = transaction.date === filterData.date;
        }
  
        // Filter by account
        if (filterData.account) {
          isAccount = transaction.account.name === filterData.account;
        }
  
        // Filter by category
        if (filterData.category) {
          isCategory = transaction.category.category === filterData.category;
        }
  
        return isType && isDate && isAccount && isCategory;
      });
  
      return userTransactions.length > 0;
    });
  
    setData(filteredData);  
    setShowFilterModal(false);  
  };
  
  const resetFilters = () => {
    setFilterData({
      account: "",
      type: "all",
      category: "",
      date: "",
    });
    setData(userData?.transactions); 
    setShowFilterModal(false);
  };
  
  

  if (!userData) {
    return <h1 className="error">{t("somethingWentWrong")}</h1>;
  }

  const userDATA = userData?.transactions.find(
    (user) => user.id === currentUser?.id
  );

  const balance = userData?.income - userData?.expenses;

  return (
    <div className="manageExpense">
      {isLoading ? (
        <div className="loading">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <div className="userContainer">
            <div className="userTitle">{t("manageExpenses")}</div>
            <button onClick={() => setShowModal(true)}>
              {t("createTransaction")}
            </button>

            {showModal && (
              <div className="modalBackground" onClick={handleModalClose}>
                <div className="modalContent">
                  <h2>{t("addTransaction")}</h2>
                  <label>
                    {t("type")}:
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                    >
                      <option value="expense">{t("expense")}</option>
                      <option value="income">{t("income")}</option>
                    </select>
                  </label>
                  <label>
                    {t("account")}:
                    <select
                      value={formData.account}
                      onChange={(e) => {
                        setFormData({ ...formData, account: e.target.value });
                      }}
                    >
                      <option defaultChecked value="" disabled>
                        Select Bank
                      </option>
                      {userDATA?.account?.map((acc, index) => (
                        <option key={index} value={acc.name}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {formData.type === "expense" && (
                    <label>
                      {t("category")}:
                      <select
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        required
                      >
                        <option defaultChecked value="" disabled>
                          Select Category
                        </option>
                        {userDATA?.category?.map((category, index) => (
                          <option key={index} value={category.category}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label>
                    {t("date")}:
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </label>
                  <label>
                    {t("amount")}:
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                    />
                  </label>
                  <div className="btn-container">
                    <button
                      type="button"
                      onClick={(e) => handleCreateTransaction(e)}
                    >
                      {t("submit")}
                    </button>
                    {formData.type === "income" && (
                      <button
                        type="button"
                        onClick={(e) => handleResetIncome(e)}
                      >
                        {t("reset")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {popupMessage && <div className="popupMessage">{popupMessage}</div>}
          </div>

          <div className="expenseContainer">
            <div className="col-1">
              <div className="title">
                <h2>{t("expenses")}</h2>
              </div>
              <div className="list">
                <ul>
                  {t("currency")}
                  {userData.expenses}
                </ul>
              </div>
            </div>
            <div className="col-2">
              <div className="title">
                <h2>{t("balance")}</h2>
              </div>
              <div className="list">
                <ul>
                  {balance > 0 ? `${t("currency")}${balance}` : t("noBalance")}
                </ul>
              </div>
            </div>
            <div className="col-3">
              <div className="title">
                <h2>{t("income")}</h2>
              </div>
              <div className="list">
                <ul>
                  {t("currency")}
                  {userData?.income}
                </ul>
              </div>
            </div>
          </div>

          {showFilterModal && (
            <div className="modalBackground" onClick={hideFilters}>
              <div className="modalContent">
                <h2>{t("filterTransactions")}</h2>
                <label>
                  {t("type")}:
                  <select
                    value={filterData.type}
                    onChange={(e) =>
                      setFilterData({ ...filterData, type: e.target.value })
                    }
                  >
                    <option value="all">{t("all")}</option>
                    <option value="expense">{t("expense")}</option>
                    <option value="income">{t("income")}</option>
                  </select>
                </label>
                <label>
                  {t("date")}:
                  <input
                    type="date"
                    value={filterData.date}
                    onChange={(e) =>
                      setFilterData({ ...filterData, date: e.target.value })
                    }
                  />
                </label>
                <label>
                  {t("account")}:
                  <select
                    value={filterData.account}
                    onChange={(e) =>
                      setFilterData({ ...filterData, account: e.target.value })
                    }
                  >
                    <option value="">{t("allAccounts")}</option>
                    {userDATA?.account?.map((acc, index) => (
                      <option key={index} value={acc.name}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t("category")}:
                  <select
                    value={filterData.category}
                    onChange={(e) =>
                      setFilterData({ ...filterData, category: e.target.value })
                    }
                  >
                    <option value="">{t("allCategories")}</option>
                    {userDATA?.category?.map((category, index) => (
                      <option key={index} value={category.category}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="btn-container">
                <button onClick={handleFilterTransactions}>
                  {t("applyFilters")}
                </button>
                <button onClick={resetFilters}>{t("resetFilters")}</button>
                </div>
              </div>
            </div>
          )}

          {popupMessage && <div className="popupMessage">{popupMessage}</div>}

          <div className="transactions">
            <div className="heading">
              <h2>{t("transactionHistory")}</h2>
              <FilterAltIcon
                className="filterIcon"
                titleAccess="Filter Transactions"
                onClick={() => setShowFilterModal(true)}
              />
            </div>
            <div className="list">
              {data?.map((user, userIndex) => (
                <div key={userIndex} className="userTransaction">
                  <h3>
                    {t("user")}: {user.name?.toUpperCase()}
                  </h3>
                  <div className="transactionList">
                    {user?.expenditures?.map((expense, index) => (
                      <div key={index} className="transactionCard">
                        <div className="transactionDetails">
                          <p>
                            <strong>{t("category")}:</strong> {expense.category}
                          </p>
                          <p>
                            <strong>{t("amount")}:</strong> {t("currency")}
                            {expense.amount}
                          </p>
                          <p>
                            <strong>{t("type")}:</strong>{" "}
                            {expense.type || t("expense")}
                          </p>
                        </div>
                        {user?.role === true && (
                          <div className="delete-btn">
                            <DeleteIcon
                              onClick={() =>
                                handleDeleteTransaction(
                                  index,
                                  expense.amount,
                                  expense.type
                                )
                              }
                              className="deleteIcon"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
