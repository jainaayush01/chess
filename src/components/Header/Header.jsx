import React from "react";
import styles from "./Header.module.scss";
import { useNavigate } from "react-router";

const Header = () => {
    const navigate = useNavigate();
    
    return (
        <>
            <div className={styles.header}>
                <div className={styles.logo} onClick={() => navigate("/")}>
                    Play Chess
                </div>
            </div>
        </>
    )
}

export default Header;