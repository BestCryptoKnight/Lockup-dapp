/* eslint-disable react/jsx-no-duplicate-props */
import { Box } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Routes as Router } from "./Routes";
import "./App.css";
import Staking from "./Pages/Staking";


const App: React.FC = () => {
  const renderMainPage = () => {
    return <BrowserRouter>
      <Box display="flex" height="100vh">
        <Routes>
          <Route>
            <Route path="/" element={<Staking />} />
            {/* <Route path="/staking" element={<Staking />} /> */}
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  }
  return renderMainPage()
};

export default App;
