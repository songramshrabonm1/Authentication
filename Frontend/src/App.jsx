import React from "react";
import { Route, Routes } from "react-router";
import { SignUp } from "./pages/AuthenTication/SignUp";
import { SignIn } from "./pages/AuthenTication/SignIn";
// import {Home } from './Home' ;
export const serverUrl = "http://localhost:8000";
import { ForgotPassword } from "./pages/AuthenTication/ForgotPassword/ForgotPassword";
import Otp from "./pages/AuthenTication/RoleSignIn/Otp";
const App = () => {
  return (
    <div>
      <Routes>
        {/* <Route path='/' element={<Home></Home>}></Route> */}
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/signin" element={<SignIn></SignIn>}></Route>
        <Route path="/otp" element={<Otp></Otp>}></Route>
        <Route
          path="/forgot-password"
          element={<ForgotPassword></ForgotPassword>}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
