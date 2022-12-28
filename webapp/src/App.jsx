import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import GameScreen from "./components/GameScreen";
import LoadingScreen from "./components/LoadingScreen";
import { HOME } from "./constants/routes";
import "./popupS.css";
import { Chain } from "./providers/walletProvider";

const App = () => {
  const [loadingAccount, setLoadingAccount] = useState(true);
  const { active, isLoading, account, chainId } = useEthers();
  const location = useLocation();

  useEffect(() => {
    // account will need sometime to load after isLoading is false
    setTimeout(() => {
      setLoadingAccount(false);
    }, 500);
  }, []);

  if (!active || isLoading || loadingAccount) {
    return <LoadingScreen />;
  }

  if (active && !isLoading && !loadingAccount && !account) {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }

  if (chainId !== Chain.chainId) {
    return <Navigate to={HOME} state={{ from: location }} replace />;
  }

  return (
    <div>
      <GameScreen />
    </div>
  );
};

export default App;
