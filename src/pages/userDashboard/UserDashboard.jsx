import React, { useEffect, useState } from 'react';
import { Chart, FeaturedInfo } from '../../components/export';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx'; 

export default function UserDashboard() {
    const currentTheme = useSelector(state => state.theme.currentTheme); 
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const userId = location.pathname.split('/')[2];
    const { t } = useTranslation();
    const usersData = useSelector(state => state.data.transactions);
    const [expenditureData, setExpenditureData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [totalsInfo, setTotalsInfo] = useState({ income: 0, budget: 0, expenses: 0 });

    useEffect(() => {
        const userData = usersData.find(user => user.id === userId);
        setExpenditureData(userData);

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

        const expenses = userData?.expenditures?.reduce((acc, exp) => acc + exp.amount, 0) || 0;
        const income = userData?.account.reduce((acc, bank) => acc + bank.amount, 0) || 0;
        const budget = userData?.category.reduce(
            (acc, category) => acc + category.amount, 0
        ) || 0;
        setTotalsInfo({ income, budget, expenses });

        setIsLoading(false);
    }, [userId, usersData]);

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

        XLSX.writeFile(workbook, `${expenditureData.name}_ExpenditureData.xlsx`);
    };

    if (!expenditureData) {
        return <h1 className="error">{t('errors.somethingWrong')}</h1>; 
    }

    return (
        <div className={`home ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
            {isLoading ? (
                <div className="loading">
                    <div className="spinner">
                        <div></div><div></div><div></div><div></div><div></div><div></div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="userContainer">
                        <div className="userTitle">{expenditureData.name?.toUpperCase()}</div>
                        <button onClick={exportToExcel}>{t('exportToExcel')}</button>
                    </div>
                    <FeaturedInfo {...totalsInfo} />
                    <Chart expenditureData={[expenditureData]} pieChartData={pieChartData} />
                </>
            )}
        </div>
    );
}
