import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { addAccount, deleteAccount, deleteCategory, addCategory, addAdminCategory, addAdminAccount, deleteAdminAccount, deleteAdminCategory, updateBudget, updateAdminBudget } from '../../Redux Store/AdminInfo/AdminSlice';
import './AccountBudget.css';
import { useTranslation } from 'react-i18next';
import { addNewAccount, addNewCategory, deleteExistingAccount, deleteExistingCategory, resetUserBudget } from '../../ApiCalls/UsersData/fetchData';

export default function AccountBudgetManage() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.data);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isLoading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalCat, setShowModalCat] = useState(false);
  const [formData, setFormData] = useState({
    account: '',
    amount: '',
    category: '',
  });
  const { t } = useTranslation();
  const [popupMessage, setPopupMessage] = useState('');

  const handleModalClose = (e) => {
    if (e.target.classList.contains('modalBackground')) {
      setShowModal(false);
    }
  };

  const handleCatModalClose = (e) => {
    if (e.target.classList.contains('modalBackground')) {
      setShowModalCat(false);
    }
  };

  const validateForm = () => {
    if (!formData.account || !formData.amount) {
      setPopupMessage(t('fillAllFields'));
      setTimeout(() => setPopupMessage(''), 2000);
      return false;
    }
    if (parseFloat(formData.amount) < 0) {
      setPopupMessage(t('negativeAmount'));
      setTimeout(() => setPopupMessage(''), 2000);
      return false;
    }
    return true;
  };

  const validateFormCat = () => {
    if (!formData.category) {
      setPopupMessage(t('fillAllFields'));
      setTimeout(() => setPopupMessage(''), 2000);
      return false;
    }
    return true;
  };

  const handleCreateAccount = () => {
    if (validateForm()) {
      addNewAccount(currentUser?.id, {
        name: formData.account, 
        amount: parseFloat(formData.amount)});
      if(currentUser.role) {
        dispatch(addAdminAccount({
          id: currentUser.id,
          account: formData.account,
          amount: parseFloat(formData.amount)
        }));
      }else {
        dispatch(addAccount(formData));
      }
      setFormData({ account: '', amount: '' });
      setShowModal(false);
    setPopupMessage('Account created successfully');
    setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  const handleCreateCategory = () => {
    if (validateFormCat()) {
      addNewCategory(currentUser?.id, formData.category, 0);
      if(currentUser.role) {
        dispatch(addAdminCategory({id: currentUser.id , category: formData.category, amount: parseFloat(formData.budget)}));
      }
      else {
        dispatch(addCategory({category: formData.category, amount: parseFloat(formData.budget)}));
      }
      setFormData({ category: '' });
      setShowModalCat(false);
    setPopupMessage('Category created successfully');
    setTimeout(() => setPopupMessage(''), 2000);
    }
  };

  const deleteUserAccount = (index) => {
    deleteExistingAccount(currentUser?.id,index);
    if(currentUser.role) {
      dispatch(deleteAdminAccount({index, id: currentUser.id})); 
    } else {
      dispatch(deleteAccount(index));
    }
    setPopupMessage('Account deleted successfully');
    setTimeout(() => setPopupMessage(''), 2000);
  };

  const deleteUserCategory = (index) => {
    deleteExistingCategory(currentUser?.id, index);
    if(currentUser.role) {
      dispatch(deleteAdminCategory({index,id: currentUser.id})); 
    } else {
      dispatch(deleteCategory(index));
    }
    setPopupMessage('Category deleted successfully');
    setTimeout(() => setPopupMessage(''), 2000);
   };

  const resetBudget = () => {
    if(formData.budget && formData.category) {
    if (formData.budget && formData.budget > 0) {
      resetUserBudget(currentUser?.id, parseFloat(formData.budget), formData.category);
      if(currentUser.role) {
        dispatch(updateAdminBudget({
          adminId: currentUser.id,
          category: formData.category,
          budget: parseFloat(formData.budget)
        }));
    }else {
      dispatch(updateBudget({ budget: parseFloat(formData.budget), category: formData.category }));
    }
    setPopupMessage('Budget updated successfully');
      setTimeout(() => setPopupMessage(''), 2000);
  }
    else {
      setPopupMessage('Please enter a valid budget amount');
      setTimeout(() => setPopupMessage(''), 2000);
    }
      setFormData({ budget: '', category: '' });
  } else {
    setPopupMessage('Please fill all fields');
    setTimeout(() => setPopupMessage(''), 2000);  
  }
    };

    useEffect(() => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, []);
  

    useEffect(() => {
      if (currentUser?.role && userData?.transactions) {
        const currentUserData = userData.transactions.find((user) => user.id === currentUser.id);
        if (currentUserData) {
          setAccounts(currentUserData.account || []);
          setCategories(currentUserData.category || []); 
        }
      } else {
        setAccounts(userData.account || []);
        setCategories(userData.category || []); 
      }
    }, [userData, currentUser]);
    

  const userDATA = userData?.transactions.find(
    (user) => user.id === currentUser?.id
  );

  return (
    <div className='manageAccount'>
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
      <div className='userContainer'>
        <div className='userTitle'>{t('manageAccount')}</div>
        <button onClick={() => setShowModal(true)}>
          {t('createAccount')}
        </button>
        {showModal && (
          <div className='modalBackground' onClick={handleModalClose}>
            <div className='modalContent'>
              <h2>{t('addAccount')}</h2>
              <label>
                {t('account')}:
                <input
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  required
                />
              </label>
              <label>
                {t('amount')}:
                <input
                  type='number'
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </label>
              <div className='btn-container'>
                <button type='button' onClick={handleCreateAccount}>
                  {t('submit')}
                </button>
              </div>
            </div>
          </div>
        )}
        {popupMessage && <div className='popupMessage'>{popupMessage}</div>}
      </div>

      <div className='transactions'>
        <h2>{t('accounts')}</h2>
        <div className='list'>
          <div className='transactionList'>
            {accounts.map((account, index) => (
              <div className='transactionCard' key={index}>
                <div className='transactionDetails'>
                  <p>
                    {account.name} <br />{`Amount: $${account.amount}`}
                  </p>
                </div>
                  <div className='delete-btn'>
                    <DeleteIcon
                      onClick={() => deleteUserAccount(index)}
                      className='deleteIcon'
                    />
                  </div>
              </div>
            ))}
          </div>
        </div>

        <div className="divide">
        <div className='userContainer'>
        <div className='userTitle'>{t('manageCategories')}</div>
        <button onClick={() => setShowModalCat(true)}>
          {t('createCategory')}
        </button>
        {showModalCat && (
          <div className='modalBackground' onClick={handleCatModalClose}>
            <div className='modalContent'>
              <h2>{t('addCategory')}</h2>
              <label>
                {t('category')}:
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </label>
              <div className='btn-container'>
                <button type='button' onClick={handleCreateCategory}>
                  {t('submit')}
                </button>
              </div>
            </div>
          </div>
        )}
        {popupMessage && <div className='popupMessage'>{popupMessage}</div>}
      </div>
      </div>
      <div className='transactions'>
        <h2>{t('category')}</h2>
        <div className='list'>
          <div className='transactionList'>
            {categories.map((category, index) => (
              <div className='transactionCard' key={index}>
                <div className='transactionDetails'>
                  <p>
                    {category.category} 
                  </p>
                </div>
                  <div className='delete-btn'>
                    <DeleteIcon
                      onClick={() => deleteUserCategory(index)}
                      className='deleteIcon'
                    />
                  </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
      <div className="setBudget">
        <div className="title">Set Budget</div>
        <div className="form modalContent">
          <label>
            {t("amount")} 
          <input type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
          </label>
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
          <button className='budget-btn' onClick={resetBudget}>
            {t("setBudget")}
          </button>
        </div>
      </div>
      </> )}
    </div>
  );
}
