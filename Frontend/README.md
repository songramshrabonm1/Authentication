1. প্রথম হচ্ছে Backend আর frontend দুইটা folder create করেছি। 
2. Backend folder এর ভিতরে প্রথম node js initialize করেছি **npm init -y** 
3. তারপর package গুলো install করে ফেলেছি **npm i express mongoose cors jsonwebtoken cookie-parser nodemailer bcrypt multer @imagekit/nodejs express-validator**
4. src folder create করেছি এর ভিতরে প্রথম app.js file create করেছি। 
5. app.js file এর ভিতরে আমরা server instance create করেছি 

6. src folder এ প্রথম config folder create করেছি এর ভিতরে db.js file create করেছি আর এর ভিতরে mongodb database connect করেছি। 

7. তারপর models folder create করেছি এই folder এর ভিতরে আমাদের mongodb এর model গুলো রাখব - user.models.js। 

8. src folder থেকে বের হয়ে server.js file create করেছি এর ভিতরে server start করব app.listen দিয়ে। 


9. src folder এর ভিতরে utils folder create করব , এই folder এর মধ্যে আমাদের এই js folder function  গুলো রাখবো যেগুলো আমাদের বার বার দরকার পড়বে  এর ভিতরে token.utils.js file create করব 


10. এর ভিতরে services folder বানাবো এর ভিতরে imagekit , nodemailer এর মতো services function এর code গুলো রাখবো আলাদা আলাদা file বানিয়ে ।

11. imagekit.services.js file create করব।
12. email send করার জন্য sendEmail.sevices.js file বানাবো। 
13. .env file আর .gitignore file create করবো Backend Folder এ । 
14. controller folder create করবো src folder এর ভিতরে আর এর ভিতরে আমাদের signup , signin , resendotp , verifyOtp , resetPassword route এর function গুলো create করবো । 
15. route folder create করব। তারপর app.js file এ import করব। 

16. forntend folder এর ভিতরে npm create vite@latest . 
17. tailwind , react-router-dom , axios , daisyui , motion package install করব 
16. app.jsx folder এ route গুলো বানাবো। 
17. authentication folder এ RoleSigUp, RoleSigIn, Forgetpassword  folder আর signin.jsx & signUp.jsx বানাবো। 
18. এর ভিতরে userSignup, ownersignup, riderSignup create করব। আর RoleSign এর ভিতরে otp , owndersign , ridersignin , ridersignin create করব। 


আমার ভুল গুলো 
- আমি const {userName , email , password , role , mobile} = req.body [এই টাই declare করি নাই ]
- frontend এ axios.post(`API` , {data} , {headers : {"Content-type" : "application/json"} , withcredentials : true}) ; withcredentials : true দিতে ভুলে গিয়েছি এর ফলে আমার frontend এ cookie তে backend এর res.cookie('RefreshToken' , RefreshToken) আর res.cookie('AccessToken' , AccessToken) এই দুইটা Token set হয় নাই। 
- findByIdAndUpdate এই method টা তো model এর কিন্তু আমি এই method টা use করার সময় UserExist এইটা দিয়ে খুজতেছিলাম বার বার এর জন্য error আস্তেছিল। 
- express-validator package এর যে validationResult method টা use করতে হবে অন্য কোন নাম দেওয়া যাবে না  আমি অন্য নাম দিতেছিলাম এর জন্য error আসতেছিল ।
- frontend এ axios.post(`API`) এর ভিতরে এই backend এর API  টা ভালোভাবে দেখে দিতে হবে আমি Resetpassword এর api এর জায়গাতে  আমি ResendOtp এর api দিয়ে দিয়েছিলাম 
- model এর মধ্যে isExpired এইটা default true বসতে হবে আমি false বসিয়ে ফেলেছিলাম। 
- postman এ method ঠিক ভাবে দিতে হবে 
