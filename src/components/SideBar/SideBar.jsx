import "./sideBar.css";
import "./sideBar-dark.css";
import i18n from "../../Language/i18next";
import { useTranslation } from "react-i18next";
import {
  HomeOutlined,
  TrendingUp,
  AttachMoney,
  Logout,
  Language,
  ArrowDownward,
  Wallet,
} from "@mui/icons-material";
import PaidIcon from '@mui/icons-material/Paid';
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeLang, logout } from "../../Redux Store/User/UserSlice";
import { useState } from "react";

export default function Sidebar({isOpen, onLinkClick}) {
  const  currentTheme  = useSelector(state=> state.theme.currentTheme);
  const [display, setDisplay] = useState(false);
  const dispatch = useDispatch();
  const getClass = ({ isActive }) => isActive ? 'sidebarListItem link active' : 'link sidebarListItem';
  const currentUser = useSelector((state) => state.user.currentUser);
  const { t } = useTranslation();
 

 const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  dispatch(changeLang(lang));
 };
 
  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'} ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t('dashboard')}</h3>
          <ul className="sidebarList">
            <NavLink onClick={onLinkClick} to={currentUser.role ? '/admin-home' : '/home'} className={getClass}>
              <HomeOutlined className="sidebarIcon" />
              {t('home')}
            </NavLink>
           { currentUser.role &&
            <NavLink onClick={onLinkClick} to={'/admin-userAnalytics'} className={getClass}>
              <TrendingUp className="sidebarIcon" />
              {t('userAnalytics')}
            </NavLink>}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t('quicMenu')}</h3>
          <ul className="sidebarList">
            <NavLink onClick={onLinkClick} to={currentUser.role ? '/admin-manageExpense' : '/manageExpense'} className={getClass}>
              <AttachMoney className="sidebarIcon" />
              {t('manageExpenses')}
            </NavLink>
            <NavLink onClick={onLinkClick} to='/manageAccount' className={getClass}>
              <Wallet className="sidebarIcon" />
              {t('manageAccount')}
            </NavLink>
            <NavLink onClick={onLinkClick} to='/manageBudget' className={getClass}>
              <PaidIcon className="sidebarIcon" />
              {t('manageBudget')}
            </NavLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">{t('account')}</h3>
          <ul className="sidebarList">
            <NavLink to='/' onClick={()=>{dispatch(logout()); onLinkClick()}} className="link sidebarListItem">
              <Logout className="sidebarIcon" />
              {t('logout')}
            </NavLink>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Lang</h3>
          <ul className="sidebarList">
          <li className="sidebarListItem lang" onClick={() => setDisplay((prev) => !prev)}>
              <Language className="sidebarIcon" />
              {t('language')} <ArrowDownward className={`lang-arrow ${display ? 'rotate' : ''}`} />
              <ul className={display ? "show" : "hide"}>
                <li onClick={() =>{ changeLanguage('en'); onLinkClick();}}>{t('english')}</li>
                <li onClick={() =>{ changeLanguage('fr'); onLinkClick();}}>{t('french')}</li>
                <li onClick={() =>{ changeLanguage('es'); onLinkClick();}}>{t('spanish')}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
