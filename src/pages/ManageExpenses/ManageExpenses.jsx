import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./expenses.css";
import "./expenses-dark.css";
import {
  addTransaction,
  deleteTrans,
  resetIncome,
} from "../../Redux Store/AdminInfo/AdminSlice";
import { useTranslation } from "react-i18next";
import {
  addExpense,
  addnewIncome,
  deleteTransaction,
} from "../../ApiCalls/UsersData/fetchData";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ManageExpenses() {
  const userData = useSelector((state) => state.data);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    account: "",
    type: "Expense",
  });
  const [popupMessage, setPopupMessage] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleModalClose = (e) => {
    if (e.target.classList.contains("modalBackground")) {
      setShowModal(false);
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

  const handleCreateTransaction = () => {
    if (!validateForm()) return;
    const accIndex = userData.account.findIndex((acc) => acc.name === formData.account);
    const remainingBalance = userData.account[accIndex].amount - formData.amount;
    if (formData.type === "Expense" && remainingBalance < 0) {
      setPopupMessage(t("insufficientBalance"));
      setTimeout(() => setPopupMessage(""), 2000);
      return;
    }
    const newTransaction = {
      type: formData.type || t("Income") ,
      category: formData.category || t("Income"),
      amount: parseFloat(formData.amount),
      account: formData.account,
    };

    addExpense(currentUser?.id, {
      category: formData.category || t("general"),
      type: formData.type || t("Income"),
      amount: parseFloat(formData.amount),
      account: formData.account,
    }).then(() => {
      dispatch(addTransaction(newTransaction));
      setFormData({ type: "expense", category: "", amount: "", account: "" });
      setShowModal(false);
      setPopupMessage('Transaction made successfully');
      setTimeout(() => setPopupMessage(''), 2000);
    });
    
  };

  const handleResetIncome = () => {
    addnewIncome(currentUser?.id, {
      amount: parseFloat(formData.amount),
      account: formData.account,
    }).then(() => {
      dispatch(
        resetIncome({
          type: "Income",
          amount: parseFloat(formData.amount),
          account: formData.account,
        })
      );
      setShowModal(false);
      setFormData({ type: "expense", category: "", amount: "", account: "" });
    });
    setPopupMessage('Income reset successfully');
    setTimeout(() => setPopupMessage(''), 2000);
  };

  const handleDeleteTransaction = (index) => {
    deleteTransaction(currentUser?.id, index).then(() => {
      dispatch(deleteTrans({ index, ...userData.transactions[index] }));
    });
    setPopupMessage('Transaction deleted successfully');
    setTimeout(() => setPopupMessage(''), 2000);
  };

  if (!userData) {
    return <h1 className="error">{t("errors.somethingWrong")}</h1>;
  }

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
                      <option value="Expense">{t("expense")}</option>
                      <option value="Income">{t("income")}</option>
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
                      {userData?.account?.map((acc, index) => (
                        <option key={index} value={acc.name}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {formData.type === "Expense" && (
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
                        {userData?.category?.map((category, index) => (
                          <option key={index} value={category.category}>
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
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
                    <button type="button" onClick={handleCreateTransaction}>
                      {t("submit")}
                    </button>
                    {formData.type === "Income" && (
                      <button type="button" onClick={handleResetIncome}>
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
                <ul>{`${t("currency")}${userData.expenses || 0}`}</ul>
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
                <ul>{`${t("currency")}${userData.income || 0}`}</ul>
              </div>
            </div>
          </div>

          <div className="transactions">
            <h2>{t("transactionHistory")}</h2>
            <div className="list">
              <div className="transactionList">
                {userData?.transactions?.map((transaction, index) => (
                  <div className="transactionCard" key={index}>
                    <div className="transactionDetails">
                      <p>
                        <strong>{t("category")}:</strong>{" "}
                        {transaction?.category}
                      </p>
                      <p>
                        <strong>{t("amount")}:</strong> {t("currency")}
                        {transaction?.amount}
                      </p>
                      <p>
                        <strong>{t("type")}:</strong>{" "}
                        {transaction?.type || t("expense")}
                      </p>
                    </div>
                    <div className="delete-btn">
                      <DeleteIcon
                        onClick={() => handleDeleteTransaction(index)}
                        className="deleteIcon"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
