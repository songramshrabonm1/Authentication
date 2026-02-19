import React from "react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
import { serverUrl } from "../../../App";
import axios from "axios";
import styles from "./bubble.module.css";
import { useNavigate } from "react-router";


export const RiderSignUp = () => {

    const [fullName , setFullName ] = useState('') ; 
    const [email , setEmail ] = useState('') ; 
    const [mobile , setMobile] = useState('') ;   
    const [password , setPassword ] = useState('') ; 
    const [AgainPassword , setAgainPassword] = useState('') ; 
    const [showPassword, setShowPassword] = useState(true);
    const [RenterShowPassword , setReEnterShowPassword] = useState(true) ; 
    const [role, setRole] = useState("deliveryBoy"); 


      const handleSignUp = async () => {
        try {
          if(password !== AgainPassword)return ; 
    
          const result = await axios.post(
            `${serverUrl}/api/auth/signup`,
            { fullName, email, mobile, password, role },
            { withCredentials: true }
          );
          console.log(result) ; 
        } catch (error) {
          console.log(error);
        }
      };


  
  // const navigate = useNavigate();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full">
      <div class=" bg-base-200 ">
        <div class="flex justify-center items-start sm:items-center md:items-start lg:items-start flex-col sm:flex-col md:flex-row-reverse lg:flex-row-reverse">
          <div class="w-full lg:text-left">
            <DotLottieReact
              src="https://lottie.host/26b9ca50-0232-43b7-b656-554ab500b205/veQFjkjQ6i.lottie"
              loop
              autoplay
            />
          </div>
          <div class="card w-full max-w-sm shrink-0 shadow-2xl">
            <div class="card-body">
              <div className="fieldset rounded-xl shadow-amber-500 w-full max-w-sm p-8 border-[1px] border-[#EED840]">
                <p className="text-4xl  md:font-bold lg:font-bold">
                  <BubbleText></BubbleText>
                </p>
                <hr className="mb-8 " />

                <div className="mb-2">
                  <label
                    htmlFor="fullName"
                    className="block text-white font-medium mb-1"
                  >
                    Name{" "}
                  </label>
                  <input
                    type="text"
                    className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Full Name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                  />
                </div>

                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className=" input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="password"
                    className="block text-white font-medium mb-1"
                  >
                    Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                      placeholder="Enter Your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />

                    <button
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: "20px",
                      }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="password"
                    className="block text-white font-medium mb-1"
                  >
                    Reenter Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      type={RenterShowPassword ? "text" : "password"}
                      className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                      placeholder="ReEnter Your password"
                      value={AgainPassword}
                      onChange={(e) => {
                        setAgainPassword(e.target.value);
                      }}
                    />

                    <button
                      onClick={() => {
                        setReEnterShowPassword(!RenterShowPassword);
                      }}
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "20px",
                      }}
                    >
                      {RenterShowPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="mobile"
                    className="block text-white font-medium mb-1"
                  >
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.mobile);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="image"
                    className="block text-white font-medium mb-1"
                  >
                    Profile Image
                  </label>
                  <input
                    type="text"
                    name="image"
                    className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.mobile);
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    handleSignUp;
                  }}
                  className="btn mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-amber-600 hover:bg-red-500 transition duration-500"
                >
                  SIGN UP
                </button>
                <button className="flex justify-center items-center gap-2 mt-4 px-4 py-2 border border-gray-400 cursor-pointer rounded hover:bg-amber-50 hover:text-black transition duration-1000">
                  <FcGoogle /> SignUp With Google
                </button>
                <div class="divider divider-warning"> OR </div>
                <p className="text-center mt-2">
                  Already Have An Account ?{" "}
                  <span
                    onClick={() => {
                      navigate("/signin");
                    }}
                    className="text-amber-500 cursor-pointer"
                  >
                    Sign In
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const BubbleText = () => {
  return (
    <h2 className="text-start text-5xl font-thin text-[#EED840]">
      {"SignUp NoW".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

