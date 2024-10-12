import './Login.css';
import './Login-dark.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, resetError } from '../../Redux Store/User/UserSlice';
import { loginUser } from '../../ApiCalls/Login/Login';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const currentTheme = useSelector(state => state.theme.currentTheme);
  const dispatch = useDispatch();
  const { error, isFetching } = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [show, setShow] = useState(" ");

  useEffect(() => {
      dispatch(resetError());
  },[dispatch])
  
  const handleLogin = async (name, pass) => {
    dispatch(loginStart()); 
    const username = name.trim();
    const password = pass.trim();
    try {
      const response = await loginUser(username, password);
      if (response.success) {
        dispatch(loginSuccess(response.user)); 

        if (response.user.role === true) {
            navigate('/admin-home');  
          } else {
            navigate('/home');  
          }
      } else {
        dispatch(loginFailure()); 
        setShow(response.message);
      }
    } catch (error) {
      dispatch(loginFailure());
      console.error("Login error:", error);
    }
  };

  return (
      <div className={`login ${currentTheme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="login-wrapper">
        <h1 className="title">SIGN IN</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(username, password); }}>
        <div className="input">
        <input type="text" placeholder=" " onChange={(e) => setUsername(e.target.value)} required />
        <label>UserName</label>
        </div>
        <div className="input">
        <input type="password" placeholder=" " onChange={(e) => setPassword(e.target.value)} required />
        <label>Password</label>
        </div>
        <button type="submit" disabled={isFetching}>Login</button>
      </form>
      {
      error && show === " " ? <p className="login-error">Failed to login. Please try again.</p> : show !== " " &&  <p className="login-error">{show}</p>
      }
      </div>
    {  isFetching && (
        <div className='login-loading'>
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
      </div>
    )}
    </div>
  );
};
