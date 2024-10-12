import "./Chart.css";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Chart({ expenditureData = [], pieChartData = [] }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [userData, setUserData] = useState({
    name: [],
    budget: [],
    income: [],
    expenses: [],
  });

  useEffect(() => {
    if (Array.isArray(expenditureData)) {
      const userNames = expenditureData.map((user) => user.name);
      const budgets = expenditureData.map((user) => user.budget);
      const incomes = expenditureData.map((user) =>
        user.account.reduce((acc, bank) => acc + bank.amount, 0)
      );
      const expenses = expenditureData.map((user) =>
        user.expenditures.reduce(
          (acc, expenditure) => acc + expenditure.amount,
          0
        )
      );

      setUserData({
        name: userNames,
        budget: budgets,
        income: incomes,
        expenses: expenses,
      });
    } else if (
      typeof expenditureData === "object" &&
      expenditureData !== null
    ) {
      const name = expenditureData?.name || "";
      const budget = expenditureData?.budget || 0;
      const incomes = expenditureData?.income || 0;
      const expenses =
        expenditureData?.expenditures?.reduce(
          (acc, expenditure) => acc + expenditure.amount,
          0
        ) || 0;

      setUserData({
        name: [name],
        budget: [budget],
        income: [incomes],
        expenses: [expenses],
      });
    } else {
      console.error(
        "Expenditure data is in an unexpected format:",
        expenditureData
      );
    }
  }, [expenditureData, currentUser.role]);

  const { t } = useTranslation();

  return (
    <div className="charts">
      <div className="chart-container">
        {userData.name.length > 0 && (
          <BarChart
            xAxis={[{ scaleType: "band", data: userData.name }]}
            series={[
              { label: t("budget"), data: userData.budget },
              { label: t("expenses"), data: userData.expenses },
              { label: t("income"), data: userData.income },
            ]}
            width={500}
            height={300}
            colors={[
              "var(--accent-color)",
              "var(--primary-color)",
              "var(--dark-secondary-color)",
            ]}
          />
        )}
      </div>
      <div className="chart-container">
        <PieChart
          series={[{ data: pieChartData }]}
          width={400}
          height={200}
          colors={[
            "var(--primary-color)",
            "var(--secondary-color)",
            "var(--accent-color)",
            "var(--dark-orange-color)",
            "var(--dark-secondary-color)",
            "var(--text-color)",
          ]}
        />
      </div>
    </div>
  );
}
