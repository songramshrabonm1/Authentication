import React from "react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
// import { Navigate, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";
import  { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


export const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const [ReEnterNewpassword, setReEnterNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ReEntershowPassword, setReEntershowPassword] = useState(false);
  const Navigate = useNavigate();

  const OtpNumber = 6;
  const [InputArray, setInputArray] = useState(new Array(OtpNumber).fill(""));
  const refArray = useRef([]);
  useEffect(() => {
    refArray.current[0]?.focus();
  }, []);
  const handleInput = (value, index) => {
    if (isNaN(value) || value?.trim() === " ") return;
    console.log(value);

    const newArray = [...InputArray];

    newArray[index] = value.slice(-1);
    setInputArray(newArray);
    value && refArray.current[index + 1]?.focus();
  };
  const handleBack = (value, event, index) => {
    if (event.key === "Backspace" && !value) {
      refArray.current[index - 1]?.focus();
    }
  };



  const [Minute, setMinute] = useState(4);
  const [Second, setSecond] = useState(59);
  const resendOtp = () => {
    setMinute(4) ; 
    setSecond(59) ; 
    console.log("CLICK");
  };

  // TIME
  // useEffect(() => {
  //   // console.log("STEP: ", step) ; 
  //   if(step == 1 || step == 3)return ; 
  //   // if(step == 2 ){
  //     console.log("step: ", step);

  //     const interval = setInterval(() => {
  //       if (Second > 0) {
  //         setSecond(Second - 1);
  //       }
  //       if (Second === 0) {
  //         if (Minute === 0) {
  //           // stop the countdown when both minutes and second are 0
  //           clearInterval(interval);
  //         } else {
  //           setSecond(59);
  //           setMinute(Minute - 1);
  //         }
  //       }
  //     }, 1000);
  //     return () => {
  //       clearInterval(interval);
  //     };
  //   // }
  // }, [Second,step]);


  // Email....
  // এইটা hit করবে resend otp route এ। 
  const handleSendOtp = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/auth/users/ResendOtp`,
        {
          headers : {
            "Content-Type" : 'application/json' 
          }, 
          withCredentials : true 
        }

      );
      alert(res.data.message); 
      setStep(2) ; 
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  // এইটা hit করবে verify otp route এ। 
  const handleVerifyOtp = async () => {
    setMinute(0) ; 
    setSecond(0) ; 
    try{
    const otp = InputArray.join("");
    const res = await axios.post(
      `http://localhost:3000/api/auth/users/VerifyOtp`,
      { otp },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );
    alert(res.data.message); 
    }catch(error){
      alert(error.response.data.message);
    }


    setStep(3) ; 
  };

  // এইটা hit করবে reset password route এ. 
  const handleResetPassword = async()=>{
    try{
      if(ReEnterNewpassword !== Newpassword ){
        return alert('Password & Reenter Password Mustbe same...'); 
      }
     
      Navigate('/signin');
    }catch(error){
      console.log(error) ; 
    }
  }

  return (
    <div>
      <div className="min-h-screen w-full bg-black">
        <div class=" bg-black ">
          <div class="flex justify-center items-center sm:items-center md:items-center lg:items-center flex-col sm:flex-col ">
            <div class="w-80% lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  {step == 1 && (
                    <DotLottieReact
                      src="https://lottie.host/02b65d19-39d8-4b69-8fba-92eaf1e5287a/N7NZahzFeU.lottie"
                      loop
                      height={80}
                      autoplay
                    />
                  )}
                  {step == 2 && (
                    <DotLottieReact
                      src="https://lottie.host/ba953c2b-1e80-449a-9f13-9711d06ee0bb/m5qCbVovo0.lottie"
                      loop
                      autoplay
                      height={130}
                    />
                  )}
                  {step == 3 && (
                    <DotLottieReact
                      src="https://lottie.host/13532801-d73c-4b37-9f2c-37eb68b3b75d/z2Pq30o5XB.lottie"
                      loop
                      autoplay
                      height={120}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <main>
              <AnimatePresence mode="wait">
                <motion.div
                className="bg-black "
                
                  key={step}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.9 }}
                >
                  <div class="card w-full max-w-sm shrink-0 shadow-2xl bg-black">
                    <div class="card-body">
                      <div className="fieldset rounded-xl shadow-amber-500 w-full max-w-sm p-8 border-[1px] border-amber-400">
                        <div className="flex items-center gap-4 mb-6">
                          <IoMdArrowRoundBack
                            onClick={() => {
                              Navigate("/signin");
                            }}
                            className="text-red-400 cursor-pointer"
                          />
                          <h1 className="text-xl text-red-400 text-wrap">
                            Forgot Password
                          </h1>
                        </div>

                        {step == 1 && (
                          <div>
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
                                onChange={(e) => {
                                  setEmail(e.target.value);
                                }}
                                value={email}
                              />
                            </div>

                            <button
                              onClick={() => {
                                //Resend Otp Route এ hit হবে। 
                                handleSendOtp();
                              }}
                              className="btn w-full mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-red-500 hover:bg-red-700 transition duration-500"
                            >
                              SEND OTP
                            </button>
                          </div>
                        )}

                        {step == 2 && (
                          <div>
                            {/* HANDLEOTP START */}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              {InputArray.map((input, index) => {
                                console.log("index: ", index);
                                console.log("input: ", input);

                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      textAlign: "center",
                                    }}
                                    key={index}
                                  >
                                    {index === 3 && (
                                      <p
                                        style={{
                                          width: "100%",
                                          margin: "auto",
                                        }}
                                      >
                                        -
                                      </p>
                                    )}

                                    <input
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        width: "30px",
                                        height: "40px",
                                        borderRadius: "7px",
                                        border: "1px solid red",
                                        textAlign: "center",
                                        margin: "1.5px",
                                      }}
                                      type="text"
                                      ref={(el) => {
                                        refArray.current[index] = el;
                                      }}
                                      value={InputArray[index]}
                                      onChange={(e) =>
                                        handleInput(e.target.value, index)
                                      }
                                      onKeyDown={(el) => {
                                        handleBack(
                                          InputArray[index],
                                          el,
                                          index
                                        );
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            {/* HANDLEOTP END */}

                            {/* RESEND OTP START */}
                            <div className="mb-4 mt-4 text-wrap wrap-break-word">
                              {/* <p>
                                Time Remaining :
                                <span>
                                  {Minute < 10 ? `0${Minute}` : Minute}:
                                  {Second < 10 ? `0${Second}` : Second}
                                </span>
                              </p> */}
                              {/* BUTTON TO RESET OTP */}
                              <button
                                // disabled={Second > 0 || Minute > 0}
                                style={{
                                  color:"#FF5630",
                                    // Second > 0 || Minute > 0
                                    //   ? "gray"
                                    //   : "#FF5630",
                                  cursor: "pointer",
                                  textDecoration: "underline"
                                    // Second > 0 || Minute > 0 ? "" : "underline",
                                }}
                                onClick={() => {
                                  resendOtp();
                                }}
                              >
                                RESEND OTP
                              </button>
                            </div>
                            {/* RESEND OTP END */}
                            <button
                              onClick={() => {
                                handleVerifyOtp();
                              }}
                              className="btn w-full mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-red-500 hover:bg-red-700 transition duration-500"
                            >
                              Verify OTP
                            </button>
                          </div>
                        )}

                        {step == 3 && (
                          <div>
                            <div className="mb-2">
                              <label
                                htmlFor="password"
                                className="block text-white font-medium mb-1"
                              >
                                New Password{" "}
                              </label>
                              <div className="relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                                  placeholder="Enter Your password"
                                  onChange={(e) => {
                                    setNewPassword(e.target.value);
                                  }}
                                  value={Newpassword}
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
                                  type={
                                    ReEntershowPassword ? "text" : "password"
                                  }
                                  className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                                  placeholder="Reenter password"
                                  onChange={(e) =>
                                    setReEnterNewPassword(e.target.value)
                                  }
                                  value={ReEnterNewpassword}
                                />

                                <button
                                  onClick={() => {
                                    setReEntershowPassword(
                                      !ReEntershowPassword
                                    );
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "18px",
                                    right: "20px",
                                  }}
                                >
                                  {ReEntershowPassword ? (
                                    <FaEye />
                                  ) : (
                                    <FaEyeSlash />
                                  )}
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                handleResetPassword()
                              }}
                              className="btn w-full mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-red-500 hover:bg-red-700 transition duration-500"
                            >
                              Reset PASSWORD
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
