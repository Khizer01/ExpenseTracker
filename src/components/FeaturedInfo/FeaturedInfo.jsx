import './featuredInfo.css';
import './featuredInfo-dark.css';
import { useSelector } from 'react-redux';
import 'react-loading-skeleton/dist/skeleton.css';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';

export default function FeaturedInfo({ income, budget, expenses }) {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const { t } = useTranslation();
  return (
    <div className={`featured ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
    <div className="featuredItem">
      <span className="featuredTitle">{t('income')}</span>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{t('currency')}{(income)?.toFixed(1) || <Skeleton count={1}/> }</span>
      </div>
    </div>
    <div className="featuredItem">
      <span className="featuredTitle">{t('budget')}</span>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{t('currency')}{(budget)?.toFixed(1) || <Skeleton count={1}/> }</span>
      </div>
    </div>
    <div className="featuredItem">
      <span className="featuredTitle">{t('totalExpense')}</span>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">{t('currency')}{(expenses)?.toFixed(1) || <Skeleton count={1}/> }</span>
      </div>
    </div>
  </div>
  );
}


