import React from "react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
// import { Navigate, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const Otp = () => {

  const Navigate = useNavigate();

  const OtpNumber = 6;
  const [InputArray, setInputArray] = useState(new Array(OtpNumber).fill(""));
  const refArray = useRef([]);
    const [Minute, setMinute] = useState(4);
    const [Second, setSecond] = useState(59);

  useEffect(() => {
    refArray.current[0]?.focus();
  }, []);

 
  // TIME
  // useEffect(()=>{
  //    let interval = setInterval(()=>{
    
  //       setSecond((Second) =>{
  //         if(Second > 0 ){
  //           return Second - 1 ;
  //         }
  //         setMinute((Minute) =>{
  //           if(Minute == 0 && Second == 0 )
  //           if(Minute === 0) {
  //             clearInterval(interval);
  //             return 0 
  //           }
  //           return Minute-1 ; 
  //         }); 
  //         if(Second === 0 ){  clearInterval(interval); return 0 ;} 
  //         else 
  //           return 59 ; 
  //       })
      
  //   } , 1000) ; 
  //   return () =>{clearInterval(interval)}; 
  // }, []) ; 


  const handleInput = (value, index) => {
    if (isNaN(value) || value?.trim() === " ") return;
    console.log(value);

    const newArray = [...InputArray];

    newArray[index] = value.slice(-1);
    setInputArray(newArray);
    console.log('index: ' , index + 1) ; 
    console.log('input', value); 

    if (value && refArray.current[index+1]) refArray.current[index + 1]?.focus();
  };
  const handleBack = (value, event, index) => {
    if (event.key === "Backspace" && !value) {
      refArray.current[index - 1]?.focus();
    }
  };


  const resendOtp = async() => {
    // setMinute(4);
    // setSecond(59);
    console.log("CLICK");
    try {
      const res =await  axios.get(`http://localhost:3000/api/auth/users/ResendOtp` , {withCredentials : true } );
      console.log(res.data.message);
      alert(res.data.message);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    // setMinute(0);
    // setSecond(0);
    const otp= InputArray.join("") ;
    console.log(otp);  
    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/users/VerifyOtp`,
        {otp},
        {headers : {"Content-Type" : "application/json"} , withCredentials : true }
      );
      console.log(res.data.message);
      console.log("OTP: ", InputArray.join(""));
      alert(res.data.message);
    } catch (error) {
      console.error(error.message);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <div class=" bg-black ">
        <div class="flex justify-center items-center sm:items-center md:items-center lg:items-center flex-col sm:flex-col ">
          <div class="w-80% lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={"otp"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <DotLottieReact
                  src="https://lottie.host/ba953c2b-1e80-449a-9f13-9711d06ee0bb/m5qCbVovo0.lottie"
                  loop
                  autoplay
                  height={80}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={"otp"}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <div class="card w-full max-w-sm shrink-0 shadow-2xl">
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
                          Verify Account
                        </h1>
                      </div>

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
                                    handleBack(InputArray[index], el, index);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        {/* HANDLEOTP END */}
                        {/* OTP TIME START */}
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
                              color: "#FF5630",
                                // Second > 0 || Minute > 0 ? "gray" : "#FF5630",
                              cursor: "pointer",
                              textDecoration:
                                Second > 0 || Minute > 0 ? "" : "underline",
                            }}
                            onClick={() => {
                              resendOtp();
                            }}
                          >
                            RESEND OTP
                          </button>
                        </div>
                        {/* RESEND OTP END */}
                        {/* OTP TIME END */}

                        <button
                          onClick={() => {
                            handleVerifyOtp();
                          }}
                          className="btn w-full mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-red-500 hover:bg-red-700 transition duration-500"
                        >
                          Verify OTP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};;

export default Otp;
