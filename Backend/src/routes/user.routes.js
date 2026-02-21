const express = require('express') ; 
const {body} = require('express-validator') ; 
const multer = require("multer");
const {
  Registration,
  Login,
  SignOut,
  ResetPassword,
  ResendOtp,
  VerifyOtp,
} = require("../controllers/auth.controllers");
const routers = express.Router() ; 

const RegistrationValidationMiddleware = [
    body('userName')
        .isLength({min : 3 })
        .withMessage('Length Less Than 3 character ... Route Model Line Number 17'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Provide Authentic Email'),
    body('password')
        .isLength({min : 6 })
        .withMessage('Password Must Be Greater than or Equal To 6 Character')
]
const LoginValidationMiddleware = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage('Provide Authentic Email'),
    body('password')
        .isLength({min : 6})
        .withMessage("Password Must Be Greater Than Or Equal To 6 Character")
];

const ResetPasswordd = [
    body('email') 
        .isEmail() 
        .normalizeEmail() 
        .withMessage('Provide Authentic Email'), 
  body("NewPassword")
    .isLength({ min: 6 })
    .withMessage("Password Must Be 6 character"),
];


const VerifyOtpValidationMiddleware = [
    body('otp')
    .isLength({min: 6 , max : 6})
    .withMessage("OTP MUST BE CONTAIN 6 Character")
]

const upload = multer({ storage: multer.memoryStorage() });

// /api/auth/users/Registration
console.log('UserREgistration')
routers.post('/users/Registration', upload.single('image') , RegistrationValidationMiddleware, Registration); 
routers.post("/users/Login", LoginValidationMiddleware, Login); 
routers.post("/users/SignOut", SignOut); 
routers.post("/users/ResetPassword", ResetPasswordd, ResetPassword); 
routers.get("/users/ResendOtp", ResendOtp); 
routers.post("/users/VerifyOtp", VerifyOtpValidationMiddleware, VerifyOtp); 

module.exports = routers;