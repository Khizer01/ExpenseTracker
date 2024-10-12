import './App.css';
import './globalColor.css';
import i18n from "./Language/i18next";
import { BrowserRouter as Router } from 'react-router-dom';
import { Nav, SideBar } from './components/export';
import AppRoutes from './components/App Routes/AppRoutes';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const { currentUser } = useSelector((state) => state.user); 
  const currentTheme = useSelector((state) => state.theme.currentTheme);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) { 
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.lang) {
      i18n.changeLanguage(currentUser.lang);
    }
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <Router>
      <div className={`${currentTheme === 'dark' ? 'app dark-mode' : 'app'} ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {currentUser !== null ? (
          <>
            <Nav isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="container">
              <div className="link">
                <SideBar isOpen={isOpen} onLinkClick={closeSidebarOnLinkClick} />
              </div>
              <AppRoutes />
            </div>
          </>
        ) : (
          <AppRoutes />
        )}
      </div>
    </Router>
  );
}

export default App;
