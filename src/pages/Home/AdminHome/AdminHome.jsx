import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FeaturedInfo from '../../../components/FeaturedInfo/FeaturedInfo';
import './Adminhome.css';
import { Chart } from '../../../components/export';
import { fetchData } from '../../../ApiCalls/UsersData/fetchData';
import { getData } from '../../../Redux Store/AdminInfo/AdminSlice'; 
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx'; 

export default function AdminHome() {
    const currentTheme = useSelector(state => state.theme.currentTheme);
    const currentUser = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [expenditureData, setExpenditureData] = useState([]);
    const [totalsInfo, setTotalsInfo] = useState({ income: 0, budget: 0, expenses: 0 });
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        const getDataAndUpdateStore = async () => {
            try {
                const response = await fetchData(currentUser.id, currentUser.role);

                if (response.success) {
                    const data = response.data;
                    setExpenditureData(data);

                    const income = data.reduce((acc, user) => {
                        const userIncome = user.account.reduce((accountAcc, account) => accountAcc + account.amount, 0);
                        return acc + userIncome;
                      }, 0);
                      
                    const budget = data.reduce((acc, user) => acc + user.category.reduce(
                        (categoryAcc, category) => categoryAcc + category.amount, 0
                    ), 0);
                    const expenses = data.reduce((acc, user) => acc + user.expenditures.reduce((a, b) => a + b.amount, 0), 0);

                    setTotalsInfo({ income, budget, expenses });

                    const expense = data.flatMap(user => user.expenditures);
                    dispatch(getData({ income, budget, expenses, transactions: data, account: data.find(user => user.id === currentUser.id).account, category: data.find(user => user.id === currentUser?.id).category }));

                    const pieData = expense.reduce((acc, expenditure) => {
                        const existing = acc.find(item => item.label === expenditure.category);
                        if (existing) {
                            existing.value += expenditure.amount;
                        } else {
                            acc.push({ id: acc.length, value: expenditure.amount, label: expenditure.category });
                        }
                        return acc;
                    }, []);

                    setPieChartData(pieData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getDataAndUpdateStore();
    }, [currentUser, dispatch]);

    const exportToExcel = () => {
        const dataForExcel = expenditureData.map(user => ({
            Name: user.name,
            Income: user.income,
            Budget: user.budget,
            ...user.expenditures.reduce((acc, exp, index) => ({
                ...acc,
                [`Expenditure ${index + 1} Category`]: exp.category,
                [`Expenditure ${index + 1} Amount`]: exp.amount
            }), {})
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenditure Data');

        XLSX.writeFile(workbook, 'ExpenditureData.xlsx');
    };

    const { t } = useTranslation();

    return (
        <div className={`home ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
            {isLoading ? (
                <div className="loading">
                    <div className="spinner">
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
                        <div className="userTitle">
                            {(currentUser.username).toUpperCase()}
                        </div>
                        <button onClick={exportToExcel}>{t('exportToExcel')}</button>
                    </div>
                    <FeaturedInfo {...totalsInfo} />
                    <Chart expenditureData={expenditureData} pieChartData={pieChartData} />
                </>
            )}
        </div>
    );
}
