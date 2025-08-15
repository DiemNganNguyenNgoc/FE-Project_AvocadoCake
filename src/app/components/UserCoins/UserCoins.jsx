import React, { useState, useEffect } from "react";
import GameService from "../../services/GameService";
import styles from "./UserCoins.module.css";

const UserCoins = () => {
  const [coins, setCoins] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token) {
      const fetchCoins = async () => {
        try {
          const response = await GameService.checkCoins();
          if (response.success) {
            setCoins(response.data.coins);
          }
        } catch (error) {
          console.error("Error fetching coins:", error);
        }
      };
      fetchCoins();
    }
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.coinsContainer}>
      <span className={styles.coinsIcon}>🪙</span>
      <span className={styles.coinsText}>{coins.toLocaleString()} xu</span>
    </div>
  );
};

export default UserCoins;
