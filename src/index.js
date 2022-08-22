import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { extendTheme } from '@chakra-ui/react'
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider } from 'ethers'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApgyXm51W5_zgu7HUNbTG7RA7NaYnxP-8",
  authDomain: "technology-dao.firebaseapp.com",
  projectId: "technology-dao",
  storageBucket: "technology-dao.appspot.com",
  messagingSenderId: "1083845751642",
  appId: "1:1083845751642:web:7ab8b35186672b5d7cf963",
  measurementId: "G-Y8PXF0M8RG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <WagmiConfig client={client}>
    <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
    </WagmiConfig>
  </ChakraProvider>
);
