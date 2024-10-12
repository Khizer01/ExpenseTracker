import { useDispatch, useSelector } from 'react-redux';
import './Home.css';
import { useEffect, useState } from 'react';
import FeaturedInfo from '../../components/FeaturedInfo/FeaturedInfo';
import { Chart } from '../../components/export';
import { fetchData } from '../../ApiCalls/UsersData/fetchData';
import { getData } from '../../Redux Store/AdminInfo/AdminSlice';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx'; 

export default function Home() {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [expenditureData, setExpenditureData] = useState(null);
  const [totalsInfo, setTotalsInfo] = useState({ income: 0, budget: 0, expenses: 0 });
  const [pieChartData, setPieChartData] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      setError(null);
      const response = await fetchData(currentUser.id, currentUser.role);

      if (response.success) {
        const userData = response.data;
        setExpenditureData(userData);
        
        const income = userData?.account.reduce((acc, bank) => acc + bank.amount, 0) || 0;
        const budget = userData?.category.reduce(
          (acc, category) => acc + category.amount,
          0
        ) || 0;
        const expenses = userData?.expenditures?.reduce((acc, exp) => acc + exp.amount, 0) || 0;

        setTotalsInfo({ income, budget, expenses });
        dispatch(getData({ income, budget, expenses, transactions: userData.expenditures, account: userData.account, category: userData.category }));

        const pieData = userData?.expenditures?.reduce((acc, expenditure) => {
          const existing = acc.find(item => item.label === expenditure.category);
          if (existing) {
            existing.value += expenditure.amount;
          } else {
            acc.push({ id: acc.length, value: expenditure.amount, label: expenditure.category });
          }
          return acc;
        }, []) || [];

        setPieChartData(pieData); 
      } else {
        setError(response.message);
      }

      setIsLoading(false);
    };

    getUserData();
  }, [currentUser, dispatch]);

  const exportToExcel = () => {
    if (!expenditureData) return;

    const dataForExcel = expenditureData.expenditures.map((exp, index) => ({
      [`Expenditure ${index + 1} Category`]: exp.category,
      [`Expenditure ${index + 1} Amount`]: exp.amount
    }));

    const summary = {
      Name: expenditureData.name,
      Income: expenditureData.income,
      Budget: expenditureData.budget,
      TotalExpenses: totalsInfo.expenses
    };

    const worksheet = XLSX.utils.json_to_sheet([summary, ...dataForExcel]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');
    XLSX.writeFile(workbook, `${currentUser.username}_ExpenditureData.xlsx`);
  };

  return (
    <div className={`home ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
      {isLoading ? (
        <div className="loading">
          <div className="spinner">
            <div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="userContainer">
            <div className="userTitle">{currentUser.username?.toUpperCase()}</div>
            <button onClick={exportToExcel}>{t('exportToExcel')}</button>
          </div>
          <FeaturedInfo {...totalsInfo} />
          <Chart expenditureData={[expenditureData]} pieChartData={pieChartData} />
        </>
      )}
    </div>
  );
}
