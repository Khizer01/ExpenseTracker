import { useNavigate } from 'react-router-dom';
import './Page404.css';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import image404 from '../../Assets/404.jpg';

export default function Page404() {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={currentTheme === 'dark' ? 'page404 dark' : 'page404'}>
      <div className="contain">
        <img src={image404} alt="Resource not found" className='imagenotfound'/>
        <p>{t('pageNotFound')}</p>
        <button className='back-btn' onClick={() => navigate('/')}>
          {t('backToHome')}
        </button>
      </div>
    </div>
  )
}
