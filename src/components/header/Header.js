import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice.js";
import styles from "./Header.module.css";
import shoppingBagIcon from "../../icons/shopping-bag.png";
import gitHubLogo from "../../icons/github.png";

const Header = () => {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  let headerLinks;
  if (isAuthenticated) {
    headerLinks = ( 
      <>
        <Link to="/my-account" className={styles.link}>My Account</Link>
        <p className={styles.link} onClick={handleLogout}>Logout</p>
      </>
    );
  } else {
    headerLinks = <Link to="/login" className={styles.link}>Login</Link>;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.homeLink}>
          <img className={styles.logo} src={shoppingBagIcon} alt="Shopping Bag Icon" />
          <span className={styles.appName}>E-commerce Store</span>
        </Link>
        {/* <Searchbar /> */}
        { headerLinks }
        <a href="https://github.com/Pedro-Freddi/ecommerce-client" target="_blank" rel="noreferrer">
          <img className={styles.gitHubLogo} src={gitHubLogo} alt="GitHub logo" />
        </a>
      </div>
  </header>
  );
};

export default Header;