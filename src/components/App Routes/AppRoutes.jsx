import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AdminHome, Home, Login, Page404 } from '../export';
import ManageExpenses from '../../pages/ManageExpenses/ManageExpenses';
import AdminManageExpenses from '../../pages/ManageExpenses/Admin Expense/AdminManageExpenses';
import UserAnalytics from '../../pages/UserAnalytics/UserAnalytics';
import UserDashboard from '../../pages/userDashboard/UserDashboard';
import AccountBudgetManage from '../../pages/Account&BudgetManage/AccountBudgetManage';
import ManageBudget from '../../pages/ManageBudget/ManageBudget';

export default function AppRoutes() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={currentUser === null ? <Login /> : <Navigate to={currentUser.role ? '/admin-home' : '/home'} /> } />

      <Route path='*' element={<Page404 />}/>
     
      { currentUser !== null && currentUser?.role === true ?
      <>
      <Route
        path="/admin-home"
        element={
          currentUser?.role === true ? <AdminHome /> :
          <Navigate to="/home" />
        }/>
        <Route path='/admin-manageExpense' element={<AdminManageExpenses />}/>
        <Route path='/admin-userAnalytics' element={<UserAnalytics />}/>
        <Route path='/user/:id' element={<UserDashboard />}/>
        <Route path='/manageAccount' element={<AccountBudgetManage />}/>
        <Route path='/manageBudget' element={<ManageBudget />}/>
        </>
        : currentUser !== null
        &&     
        <>
        <Route
        path="/home"
        element={
          currentUser?.role !== true ?  <Home /> : <Navigate to="/admin-home" />
        }
      /> 
        <Route path='/manageBudget' element={<ManageBudget />}/>
        <Route path='/manageExpense' element={<ManageExpenses/>}/>
        <Route path='/manageAccount' element={<AccountBudgetManage />}/>
      </>
  }
    </Routes>
  );
}
