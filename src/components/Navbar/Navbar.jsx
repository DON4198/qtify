import React from "react";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import styles from "./Navbar.module.css";

function Navbar({ searchData }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Logo />
      </div>

      <div className={styles.center}>
        <Search
          placeholder="Search a song of your choice"
          searchData={searchData}
        />
      </div>

      <div className={styles.right}>
        <Button text="Give Feedback" />
      </div>
    </nav>
  );
}

export default Navbar;
