import React from "react";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import styles from "./bubble.module.css";
import { useNavigate } from "react-router";



export const OwnerSignIn= () => {
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
      const [email , setEmail] = useState('') ; 
      const [password , setPassword] = useState('') ; 
      // const [role, setRole] = useState("owner"); ; 
        const handleSignIn = async () => {
          try{
            const role = "Admin";
            
            const res = await axios.post(
              `http://localhost:3000/api/auth/users/Login`,
              { email, password , role},
              { headers: { "Content-Type": "application/json" } , withCredentials : true  },
            ); 

            console.log(res.data.message); 
            alert(res.data.message); 
            navigate('/otp')
          }catch(error){
            console.error(error.message) ; 
            console.log(error.response.data.message); 
          }
        };
  return (
    <div className="min-h-screen w-full">
      <div class=" bg-base-200 ">
        <div class="flex justify-center items-start sm:items-center md:items-start lg:items-start flex-col sm:flex-col md:flex-row-reverse lg:flex-row-reverse">
          <div class="w-full lg:text-left">
            <DotLottieReact
              src="https://lottie.host/296b569c-75ec-44cc-8180-c6f087d545da/4HKPMkoYXg.lottie"
              loop
              autoplay
            />
          </div>
          <div class="card w-full max-w-sm shrink-0 shadow-2xl">
            <div class="card-body">
              <div className="fieldset rounded-xl shadow-amber-500 w-full max-w-sm p-8 border-[1px] border-amber-400">
                <p className="text-4xl  md:font-bold lg:font-bold">
                  {/* SignIn now! */}
                  <BubbleText />
                </p>
                <hr className="mb-8 " />

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
                <div className="mb-2 fieldset">
                  <label
                    htmlFor="password"
                    className="block text-white font-medium mb-1"
                  >
                    Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "password" : "text"}
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
                <p
                  onClick={() => {
                    navigate("/forgot-password");
                  }}
                  className="text-right text-orange-300 cursor-pointer underline font-bold text-wrap"
                >
                  Forget Password
                </p>

                <button
                  onClick={() => {
                    handleSignIn();
                  }}
                  className="btn mt-4 px-4 py-2 rounded cursor-pointer flex justify-center items-center border border-white bg-amber-600 hover:bg-red-500 transition duration-500"
                >
                  SIGN IN
                </button>
                <button className="flex justify-center items-center gap-2 mt-4 px-4 py-2 border border-gray-400 cursor-pointer rounded hover:bg-amber-50 hover:text-black transition duration-1000">
                  <FcGoogle /> SignIn With Google
                </button>
                <div class="divider divider-warning"> OR </div>
                <p className="text-center mt-2">
                  Dont Have An Account ?{" "}
                  <span
                    onClick={() => {
                      navigate("/signup");
                    }}
                    className="text-amber-500 cursor-pointer"
                  >
                    signup
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
    <h2 className="text-start text-5xl font-thin text-[#CD882A]">
      {"SignIn NoW".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};

