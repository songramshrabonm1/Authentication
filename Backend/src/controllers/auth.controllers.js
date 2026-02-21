const UserModel = require('../models/user.models'); 
const { validationResult } = require("express-validator");
const UploadImage = require('../services/imagekitClouds.services');
const { genRefreshToken, genAccessToken, genAccessTokenCookiePayload, genRefreshTokenCookiePayload, verifyAccessToken, verifyRefrehsToken } = require('../utils/tokens.utils');
const { SendOtpEmail } = require('../services/sendEmail.services');
const Registration = async (req, res) => {
  try {
    console.log('Registration');
    const expressValidationError = validationResult(req); 

    /*
     isEmpty() true / false return করে  true হয় যখন কোন error না থাকে 
     আর false হয় যখন error থাকে তাই false হলে if condtion pass করতেছি 

     
*/
    console.log('UserRegistration....');

    if(!expressValidationError.isEmpty()){
        return res.status(400).json({
            message : expressValidationError.array() , 
            success : false , 
            statusCode : 400
        })
    }

    const {userName, email, password, role , mobile} = req.body ; //must be declare করতে হবে। 

    if (
      !userName ||
      !email ||
      !password ||
      !role ||
      !mobile ||
      userName?.trim() == "" ||
      email?.trim() == "" ||
      password?.trim() == "" ||
      mobile?.trim() === "" || 
      role?.trim() === ""
    ) {
      return res.status(400).json({
        message: "All Fields Required",
        statusCode: 400,
        success: false,
      });
    }

    console.log('UserName' , userName); 
    console.log('email', email); 
    console.log('password' , password); 
    console.log('role' , role); 
    console.log('Mobile: ' , mobile); 

    if(!req.file){
      //profile Image // <-- function না, property হবে। আমি কিন্তু এখানে ভুলে প্রায় সময় ()function  use করে ফেলি 
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Image File Required",
      });
    }

    console.log(req.file) ; 

    const UserAlreadyExist = await UserModel.findOne({$or: [{email} , {userName}]}); 

    console.log('User: ' , UserAlreadyExist);
    if(UserAlreadyExist){
        return res.status(400).json({
            message : 'User Already Exist' , 
            success : false , 
            statusCode : 400
        })
    }

    console.log('UserAlreadyExist: ' , UserAlreadyExist);
    
    const UploadImageUrl = await UploadImage(req.file.buffer , userName) ; 

    console.log("UploadImageUrl", UploadImageUrl.url);

    const NewUser = await UserModel.create({
      userName,
      password,
      email,
      role,
      mobile,
      image: UploadImageUrl.url,
    });

    console.log('NewUser' , NewUser);

    const Payload = {
        email , 
        UserId : NewUser._id , 
    }
    console.log("Payload", Payload); 
    const RefreshToken = genRefreshToken(Payload);
    console.log('RefreshToken' , RefreshToken);
    const AccessToken = genAccessToken(Payload); 
    console.log('AccessToken' , AccessToken);
    const RefreshTokenPayload = genRefreshTokenCookiePayload() ; 
    console.log('RefreshTokenPayload' , RefreshTokenPayload); 
    const AccessTokenPayload = genAccessTokenCookiePayload();
    console.log('AccessTokenPayload' , AccessTokenPayload);


    res.cookie("RefreshToken", RefreshToken, RefreshTokenPayload);
    res.cookie("AccessToken", AccessToken, AccessTokenPayload);
    
    console.log('NewUserUpdate');
    await UserModel.findByIdAndUpdate(NewUser._id, { //এখানে model হবে। 
      $push: {
        RefreshToken: {
          $each: [
            {
              token: RefreshToken,
              expireAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            },
          ],
          $slice : -5 
        },
      },
    });

    console.log('NewUserUpdate');

    return res.status(201).json({
        message : 'SignUp Successfully...' , 
        success : true , 
        statusCode : 201
    })



  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
      statusCode : 500
    });
  }
};
const Login = async (req, res) => {
  try {
    const ValidationErrorResult = validationResult(req); 
    if(!ValidationErrorResult.isEmpty()){
        return res.status(400).json({
            message : ValidationErrorResult.array() ,
            success : false , 
            statusCode : 400
        })
    }
    const {email , password , role } = req.body ; 

    if(!email 
    || !password 
    || !role 
    || email?.trim()=== "" 
    || password?.trim()===""
    || role?.trim() === ""
    )
    {
        return res.status(400).json({
            success : true , 
            message : 'All Fields Required', 
            statusCode : 400
        })
    }
    console.log('email: 168 line ', email);
    console.log("password: 169 line ", password);
    const UserExist = await UserModel.findOne({email}).select("+password");
/*
 আমি এখানে প্রায় সময় ভুল করে ভুলে যায় select("+password") যে দিতে হবে 
 কারণ না দিলে password আসবে না। আর comparePassword এ error আসবে। 
*/
    if(!UserExist){
        return res.status(401).json({
            message : 'User Not Exist... SignUp Your Account First' , 
            success : false , 
            statusCode : 401 
        })
    }
    console.log("UserExist: 182line", UserExist);

    if(UserExist.role !== role){
        return res.status(401).json({
            message : "User Role Not Match..." , 
            success : false , 
            statusCode:  401
        })
    }


    const IsMatchPassword = await UserExist.comparePassword(password) ; 
    console.log('IsmatchPassword 186 line: ', IsMatchPassword);
    if(!IsMatchPassword){
        return res.status(401).json({
            message : 'Invalid Password' , 
            success : false , 
            statusCode : 401 
        })
    }


    const payload = {
        email : UserExist.email , 
        UserId : UserExist._id 
    }
    console.log('payload 200 line: ', payload);

    const RefreshToken = genRefreshToken(payload);
    console.log('RefreshToken : 203 line -  ' , RefreshToken); 
    const AccessToken = genAccessToken(payload); 
    console.log("AccessToken : 205 line -  ", AccessToken); 
    const RefreshTokenPayload = genRefreshTokenCookiePayload() ; 
    console.log("RefreshTokenPayload : 207 line -  ", RefreshTokenPayload); 
    const AccessTokenPayload = genAccessTokenCookiePayload();
    console.log("AccessTokenPayload : 209 line -  ", AccessTokenPayload); 


    res.cookie("RefreshToken", RefreshToken, RefreshTokenPayload);
    res.cookie("AccessToken", AccessToken, AccessTokenPayload);


    const OtpGenerate = Math.floor(100000+ Math.random() * 999999).toString(); 
    console.log('otp 213Line - ', OtpGenerate);
    UserExist.otp = OtpGenerate; 
    UserExist.isExpired = false; 
    UserExist.otpVerified = false ; 
    UserExist.otpTime = new Date(Date.now() + 5 * 60 * 1000); 

    await UserExist.save();
    console.log('UserSave- 224line' , UserExist);

    await SendOtpEmail(UserExist.email, OtpGenerate); 

    return res.status(200).json({
        message : 'SignIn Successfully & Send Otp Your Email....' , 
        success : true , 
        statusCode : 200
    })
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
      statusCode : 500
    });
  }
};

const VerifyOtp = async (req, res) => {
  try {
    const ExpressValidationResult = validationResult(req) ; 
    if(!ExpressValidationResult.isEmpty()){
        return res.status(400).json({
            message : ExpressValidationResult.array() , 
            success : false , 
            statusCode : 400
        })
    }
    const AccessToken = req.cookies?.AccessToken; 
    console.log('AccessToken 268' , AccessToken) ; 

    if(!AccessToken){
        return res.status(401).json({
            message : 'Authentication Error....' , 
            success : false , 
            statusCode : 401
        })
    }

    const Decode = verifyAccessToken(AccessToken);
    console.log('Decode : 279' , Decode); 
    if(!Decode){
        return res.status(401).json({
            message : "Invalid AccessToken" , 
            success : false ,
            statusCode : 401
        })
    }

    const Email = Decode.email; 
    console.log('Email :289 ' , Email) ; 
    if(!Email){
        return res.status(401).json({
            message : 'Authentication Error' , 
            success : false , 
            statusCode : 401
        })
    }

    const UserExist = await UserModel.findOne({email : Email}); 
    console.log('UserExist : 299' , UserExist); 
    if(!UserExist){
        
        return res.status(404).json({
            message : 'User Not Found' , 
            success : false , 
            statusCode : 404
        })
    }

    const {otp} = req.body; 
    console.log('Otp: 310' , otp); 
  
       if (!otp) {
         // 400 bad request
         return res.status(400).json({
           message: "OTP Required",
           statusCode: 400,
           success: false,
         });
       }
          if (otp !== UserExist.otp) {
            return res.status(401).json({
              message: "OTP NOT Matched",
              success: false,
              statusCode: 401,
            });
          }

    if(UserExist.otpTime < Date.now()){
        UserExist.isExpired = true ; 
        UserExist.otpVerified = false ; 
        return res.status(401).json({
            message : "OTP TIME EXPIRED" , 
            statusCode : 401, 
            success : false 
        })
    }
    console.log('Time Ache 337 ....');



  

    UserExist.isExpired = false ; 
    UserExist.otpVerified = true ; 
    UserExist.otp = null 

    console.log('UserExist Save Before line 347')
    
    await UserExist.save();
    console.log('UserExist Save After line 350')
    
    return res.status(200).json({
        message : 'OTP VALIDATION SUCCESSFULLYY', 
        statusCode : 200, 
        success : true 
    })

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
    });
  }
};

const ResendOtp = async (req, res) => {
  try {


    const AccessToken = req.cookies?.AccessToken; 
    if(!AccessToken){
        return res.status(401).json({
            message : 'Authentication Error....' , 
            success : false , 
            statusCode : 401
        })
    }

    const Decode = verifyAccessToken(AccessToken);
    if(!Decode){
        return res.status(401).json({
            message : "Invalid AccessToken" , 
            success : false ,
            statusCode : 401
        })
    }

    const Email = Decode.email; 
    if(!Email){
        return res.status(401).json({
            message : 'Authentication Error' , 
            success : false , 
            statusCode : 401
        })
    }

    const UserExist = await UserModel.findOne({email : Email}); 
    if(!UserExist){
        
        return res.status(404).json({
            message : 'User Not Found' , 
            success : false , 
            statusCode : 404
        })
    }




    const OtpGenerate = Math.floor(100000+ Math.random() * 999999).toString(); 
    UserExist.otp = OtpGenerate; 
    UserExist.isExpired = false ; 
    UserExist.otpTime = new Date(Date.now() + 5 * 60 * 1000); 

    await UserExist.save();

    await SendOtpEmail(UserExist.email, OtpGenerate); 

    return res.status(200).json({
        message : 'ReSend Otp Your Email....' , 
        success : true , 
        statusCode : 200
    })    
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
    });
  }
};

const SignOut = async (req, res) => {
  try {
    const RefreshToken = req.cookies?.RefreshToken; 
    const AccessToken = req.cookies?.AccessToken; 
    console.log('RefreshToken....417line' , RefreshToken);
    console.log("AccessToken:... 418 Line ", AccessToken);
    if(!RefreshToken){
        return res.status(401).json({
            message : 'Authentication Error', 
            success : false , 
            statusCode : 401 
        })
    }
    
    const decode = verifyRefrehsToken(RefreshToken);
    console.log('Decode : 425Line- ', decode);
    if(!decode){
        return res.status(401).json({
            message : 'Invalid Token' , 
            success : false , 
            statusCode : 401
        })
    } 
    const email = decode.email; 
    console.log('email : 434 line - ' , email); 
    if(!email){
        return res.status(401).json({
            message : 'Authentication Error...' , 
            success : false , 
            statusCode : 401
        })
    }
    const UserExist = await UserModel.findOne({email}) ; 
    console.log('UserExist:443 line -  ' , UserExist); 
    if(!UserExist){
        return res.status(401).json({
            message : 'Authentication Error', 
            success : false , 
            statusCode : 401
        })
    }
    await UserModel.findByIdAndUpdate(UserExist._id, { // findbyidAndUpdate এইটা model হবে। 
      $pull: {
        RefreshToken: {
          token: RefreshToken,
        },
      },
    });

    res.clearCookie("RefreshToken", RefreshToken);
    res.clearCookie("AccessToken", AccessToken);

    return res.status(200).json({
        message : 'SignOut Successfully...' , 
        success : false , 
        statusCode : 200
    })
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
    });
  }
};

const ResetPassword = async (req, res) => {
  try {

    console.log('Line - 503')
    const ExpressValidation = validationResult(req) ; 
    if(!ExpressValidation.isEmpty()){
        return res.status(400).json({
            message : ExpressValidation.array() , 
            success : false, 
            statusCode : 400
        })
    }
    const { email, NewPassword } = req.body; 
    console.log('Email - 511 ', email);
    if(!email || email?.trim() === "" || NewPassword === "" ||NewPassword?.trim() === ""){
        return res.status(401).json({
            message : 'Invalid AccessToken' , 
            success : false , 
            statusCode : 401 
        })
    }
    const UserExist = await UserModel.findOne({email}).select("+password"); 
    
    if(!UserExist){
        return res.status(401).json({
            message : 'Authentication Error', 
            success : false, 
            statusCode : 401
        })
    }
    console.log('UserExist: 555', UserExist);
    // if (!NewPassword || NewPassword.trim() === "") {
    //   return res.status(400).json({
    //     message: "All Fields Are Required",
    //     success: false,
    //     statusCode: 400,
    //   });
    // }


    if(!UserExist.otpVerified){
        return res.status(403).json({
          success: false,
          statusCode: 403, // NOT ALLOWED
          message: "OTP Verification Required",
        });
    }
    
    UserExist.RefreshToken = [] ; // আমরা খালি করে দিতেছি যেন সব ডিভাইস থেকে logout হয়ে যায়। 
    // আর আবার নতুন refreshToken বানাচ্ছি না কারণ নতুন password দেওয়ার পর user আবার login করতে হবে। 
    UserExist.password = NewPassword; 
    UserExist.otpVerified = false ; 
    console.log('Save-592');
    await UserExist.save() ; 

    return res.status(200).json({
        message : "UpdatePassword Successfully..." , 
        success : true , 
        statusCode : 200
    })
    
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Sever Error",
      success: false,
    });
  }
};

module.exports = {
  ResetPassword,
  VerifyOtp,
  ResendOtp,
  Registration,
  Login,
  SignOut,
};