import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import WalletProvider from "./providers/walletProvider";
import WalletConnect from "./components/WalletConnect";
import "./index.css";
import { GAME_SCREEN, HOME } from "./constants/routes";

const router = createBrowserRouter([
  {
    path: GAME_SCREEN,
    element: <App />,
  },
  {
    path: HOME,
    element: <WalletConnect />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WalletProvider>
      <RouterProvider router={router} />
    </WalletProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
