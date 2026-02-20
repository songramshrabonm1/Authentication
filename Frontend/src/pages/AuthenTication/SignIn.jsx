import React, { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "motion/react";
import { UserSignUp } from "./RoleSignUp/UserSignUp";
import { OwnerSignUp } from "./RoleSignUp/OwnerSignUp";
import { RiderSignUp } from "./RoleSignUp/RiderSignUp";
import { UserSignIn } from "./RoleSignIn/UserSignIn";
import { OwnerSignIn } from "./RoleSignIn/OwnerSignIn";
import { RiderSignIn } from "./RoleSignIn/RiderSignIn";
import { useLocation } from "react-router";
import { useEffect } from "react";

export const SignIn = () => {
  /*
  navigate("/signin", { state: { role: "Admin" } });
              navigate("/signin", { state: { role: "user" } });
              navigate("/signin", { state: { role: "Rider" } });


  navigate('/signIn', {state : {role : 'user'}}) 
  tarpor signin component e giye 
  const location = useLocation() ; 
  const State = location.state || {} ; 
  console.log(State.role) eivabe pabo 
  evabe pabo na 
  */
  const location = useLocation();
  console.log('location: ' , location) ; 
  const State = location.state || "user";
  console.log('State: ', State) ; 
  const [Role, setRole] = useState(State.role);
  console.log('Role: ' , Role) ; 
  


  return (
    <div>
      <div className="flex flex-col items-center justify-center  w-ful">
        <h1 className="text-4xl font-bold">
          Citys<span className="text-red-500">Food</span>
        </h1>

        <p className="text-white mt-4 text-center">
          SignIn and select your role (User, Author, or Rider) to access your
          personalized experience.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1   gap-3 m-4">
          {["user", "Admin", "Rider"].map((r) => (
            <button
              onClick={() => setRole(r)}
              className=" cursor-pointer text-center flex-1 border rounded-lg px-12 py-3 font-medium transition-colors"
              style={
                Role == r
                  ? { backgroundColor: "#e64323", color: "white" }
                  : { border: "1px solid orange", color: "white" }
              }
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {/* === SHOW FORM BASED ON ROLE === */}
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={Role}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Role === "user" && <UserSignIn />}
            {Role === "Admin" && <OwnerSignIn></OwnerSignIn>}
            {Role === "Rider" && <RiderSignIn></RiderSignIn>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};



// export default SignIn;
