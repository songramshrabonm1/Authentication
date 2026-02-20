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
import { useEffect } from "react";
import { FiCheckSquare, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

export const RiderSignUp = () => {

    const [notifications, setNotifications] = useState([]);

    const removeNotif = (id) => {
      setNotifications((pv) => pv.filter((n) => n.id !== id));
    };

    const [fullName , setFullName ] = useState('') ; 
    const [email , setEmail ] = useState('') ; 
    const [mobile , setMobile] = useState('') ;   
    const [password , setPassword ] = useState('') ; 
    const [AgainPassword , setAgainPassword] = useState('') ; 
    const [showPassword, setShowPassword] = useState(true);
    const [RenterShowPassword , setReEnterShowPassword] = useState(true) ; 
    const [imageData, setImageData] = useState(); 


      const handleSignUp = async () => {
        try {
          if(password !== AgainPassword)return setNotifications((pv) => [
            generateRandomNotif("Password & confirm password not same..."),
            ...pv,
          ]);
; 
          
           console.log('UserName' , fullName) ; 
           console.log('Email' , email) ; 
           console.log('Password', password); 
           console.log('mobile' , mobile); 
           console.log("image", imageData);
           console.log("role", "Rider");
           
           const formData = new FormData() ; 
        formData.append("userName", fullName);
        formData.append("email", email);
        formData.append("mobile", mobile);
        formData.append("role", "Rider");
        formData.append("image", imageData);
        formData.append("password", password);
           
        const res = await axios.post(
          `http://localhost:3000/api/auth/users/Registration`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials : true 
          },
        );
        console.log(res) ;
        console.log(res.data) ; 
        console.log(res.data.message); 
        console.log(res.data.success) ;
        
        setNotifications((pv) => [generateRandomNotif(res.data.message), ...pv]);
             
        // navigate("/signin", { state: { role: "Admin" } });
        // navigate("/signin", { state: { role: "user" } });
        navigate("/signin", { state: { role: "Rider" } });



        } catch (error) {
          const BackendMessage = error.response.data?.message || error.message || "Something Went Wrong"
          console.log(error);
          setNotifications((pv)=>[generateRandomNotif(BackendMessage) , ...pv]);
        }
      };


  
  // const navigate = useNavigate();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col gap-1 w-72 fixed top-2 right-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

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
                <div className="mb-2 fieldset">
                  <label
                    htmlFor="password"
                    className="block text-white font-medium mb-1"
                  >
                    Reenter Password{" "}
                  </label>
                  <div className="relative">
                    <input
                      type={RenterShowPassword ? "password" : "text"}
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
                    name = "mobile" // name ও দিতে ভুলে গিয়েছি। 
                    className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Mobile Number"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value); // এখানে ভুলে e.target.mobile লিখে ফেলেছিলাম কিন্তু এইটা e.target.value হবে। 
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
                    type="file"
                    name="image"
                    accept="image/*"
                    className="input  border rounded-lg px-3 py-3 focus:outline-none focus:border-orange-500"
                    placeholder="Enter Your Mobile Number"
                    onChange={(e) => {
                      setImageData(e.target.files[0]);
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    handleSignUp();
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




const NOTIFICATION_TTL = 5000;

const Notification = ({ text, id, removeNotif }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white bg-[#E74223] pointer-events-auto"
    >
      <FiCheckSquare className=" mt-0.5" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};


const generateRandomNotif = (message) => {
  const data = {
    id: Math.random(),
    text: `${message}`,
  };

  return data;
};

