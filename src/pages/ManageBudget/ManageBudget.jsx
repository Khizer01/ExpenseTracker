import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteExistingCategory, resetUserBudget } from '../../ApiCalls/UsersData/fetchData';
import { updateAdminBudget, updateBudget, deleteCategory, addAdminCategory, deleteAdminCategory } from '../../Redux Store/AdminInfo/AdminSlice';

export default function ManageBudget() {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const currentUser = useSelector((state) => state.user.currentUser);
    const userData = useSelector((state) => state.data);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
          }, 1000);
    },[]);
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        budget: "",
    });

    const [popupMessage, setPopupMessage] = useState("");

    const handleModalClose = (e) => {
      if (e.target.classList.contains("modalBackground")) {
        setShowModal(false);
        }
    }

    const handleDelete = (index) => {
      deleteExistingCategory(currentUser?.id, index);
      if(currentUser.role) {
        dispatch(deleteAdminCategory({index,id: currentUser.id})); 
      } else {
        dispatch(deleteCategory(index));
      }
      setPopupMessage('Category deleted successfully');
      setTimeout(() => setPopupMessage(''), 2000);
    }
    
    useEffect(() => {
        setCategories(userData.category || []);
  }, [userData]);
  
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
    setShowModal(false);
    };

  const userDATA = userData?.transactions.find(
    (user) => user.id === currentUser?.id
  );


  return (
    <div className='manageExpense'>
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
            <div className="userTitle">{t("manageBudget")}</div>
            <button onClick={() => setShowModal(true)}>
              {t("createBudget")}
            </button>

            {showModal && (
              <div className="modalBackground" onClick={handleModalClose}>
                <div className="modalContent">
                  <h2>{t("addBudget")}</h2>
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
                  <label>
                    {t("amount")}:
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      required
                    />
                  </label>
                  <div className="btn-container">
                    <button
                      type="button"
                      onClick={resetBudget}
                    >
                      {t("submit")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {popupMessage && <div className="popupMessage">{popupMessage}</div>}
          </div>

          <div className="transactions">
            <div className="heading">
              <h2>{t("category")}</h2>
            </div>
            <div className="list">
            <div className='transactionList'>
            {categories?.map((category, index) => (
              <div className='transactionCard' key={index}>
                <div className='transactionDetails'>
                  <p>
                    {category.category} 
                  </p>
                  <p>
                    ${category.amount} 
                  </p>
                </div>
                  <div className='delete-btn'>
                    <DeleteIcon
                      onClick={() => handleDelete(index)}
                      className='deleteIcon'
                    />
                  </div>
              </div>
            ))}
             </div>
            </div>
          </div>
        </>
      )
    }
    </div>
  )
}
