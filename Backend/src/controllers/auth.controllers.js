const UserModel = require('../models/user.models'); 
const { validationResult } = require("express-validator");
const UploadImage = require('../services/imagekitClouds.services');
const { genRefreshToken, genAccessToken, genAccessTokenCookiePayload, genRefreshTokenCookiePayload, verifyAccessToken, verifyRefrehsToken } = require('../utils/tokens.utils');
const { SendOtpEmail } = require('../services/sendEmail.services');
const Registration = async (req, res) => {
  try {
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

    console.log('UploadImageUrl' , UploadImage.url);

    const NewUser = await UserModel.create({
      userName,
      password,
      email,
      role,
      mobile,
      profileImage: UploadImageUrl.url,
    });

    console.log('NewUser' , NewUser);

    const Payload = {
        email , 
        UserId : NewUser._id , 
    }
    console.log('Payload' , payload); 
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
    await NewUser.findByIdAndUpdate(NewUser._id, {
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
    const {email , password} = req.body ; 
    if(!email || 
    !password || 
    email?.trim()=== "" || 
    password?.trim()==="")
    {
        return res.status(400).json({
            success : true , 
            message : 'All Fields Required', 
            statusCode : 400
        })
    }
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

    const IsMatchPassword = await UserExist.comparePassword(password) ; 
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
    const RefreshToken = genRefreshToken(payload);
    const AccessToken = genAccessToken(payload); 
    const RefreshTokenPayload = genRefreshTokenCookiePayload() ; 
    const AccessTokenPayload = genAccessTokenCookiePayload();


    res.cookie("RefreshToken", RefreshToken, RefreshTokenPayload);
    res.cookie("AccessToken", AccessToken, AccessTokenPayload);


    const OtpGenerate = Math.floor(100000+ Math.random() * 999999).toString(); 
    UserExist.otp = OtpGenerate; 
    UserExist.isExpired = false ; 
    UserExist.otpVerified = false ; 
    UserExist.otpTime = new Date(Date.now() + 5 * 60 * 1000); 

    await UserExist.save();

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

    const {otp} = req.body; 
  
   

    if(UserExist.otpTime < Date.now()){
        UserExist.isExpired = true ; 
        UserExist.otpVerified = false ; 
        return res.status(401).json({
            message : "OTP TIME EXPIRED" , 
            statusCode : 401, 
            success : false 
        })
    }

    if(!otp){
        // 400 bad request
        return res.status(400).json({
            message : "OTP Required" , 
            statusCode : 400, 
            success : false 
        })
    }

     if(otp !== UserExist.otp){
        return res.status(401).json({
            message : 'OTP NOT Matched' , 
            success : false , 
            statusCode : 401
        })
    }

    UserExist.isExpired = false ; 
    UserExist.otpVerified = true ; 
    UserExist.otp = null 

    await UserExist.save();

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

    const UserExist = await UserModel.findOne({Email}); 
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
    const RefreshToken = req.cookies.RefreshToken; 
    if(!RefreshToken){
        return res.status(4001).json({
            message : 'Authentication Error', 
            success : false , 
            statusCode : 401 
        })
    }
    const decode = verifyRefrehsToken(RefreshToken);
    if(!decode){
        return res.status(401).json({
            message : 'Invalid Token' , 
            success : false , 
            statusCode : 401
        })
    } 
    const email = RefreshToken.email ; 
    if(!email){
        return res.status(401).json({
            message : 'Authentication Error...' , 
            success : false , 
            statusCode : 401
        })
    }
    const UserExist = await UserModel.findOne({email}) ; 
    if(!UserExist){
        return res.status(401).json({
            message : 'Authentication Error', 
            success : false , 
            statusCode : 401
        })
    }
    await UserExist.findByIdAndUpdate(UserExist._id, {
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

    const ExpressValidation = validationResult(req) ; 
    if(!ExpressValidation.isEmpty()){
        return res.status(400).json({
            message : ExpressValidation.array() , 
            success : false, 
            statusCode : 400
        })
    }
    const AccessToken = req.cookies?.AccessToken; 
    if(!AccessToken){
        return res.status(401).json({
            message : 'Invlaid AccessToken', 
            success : false , 
            statusCode : 401
        })
    }
    let Decode;

    try{

         Decode = verifyAccessToken(AccessToken); 
    }catch(error){
        return res.status(401).json({
            message : 'Invalid Or Expired Token' , 
            success : false , 
            statusCode : 401
        })
    }
  



    const email = Decode?.email ; 
    if(!email){
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
    const {password , NewPassword} = req.body; 
    if (
      !password ||
      !NewPassword ||
      NewPassword.trim() === "" ||
      password.trim() === ""
    ) {
      return res.status(400).json({
        message: "All Fields Are Required",
        success: false,
        statusCode: 400,
      });
    }

    if(password === NewPassword){
        return res.status(400).json({
            message : 'NewPassword Must Be Different', 
            success : false , 
            statusCode : 400
        })
    }

    const IsMatchPassword = await UserExist.comparePassword(password); 
    if(!IsMatchPassword){
        return res.status(401).json({
            message : "Incorrect Password" ,
            statusCode : 401, 
            success : false 
        })
    }
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