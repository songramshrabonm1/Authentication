const express = require('express') ; 
const cors = require('cors'); 
const cookieparser = require('cookie-parser'); 
const app = express() ; //server instance create করা হয়েছে। 
const AuthRouter = require('./routes/user.routes');
//Middleware Part 
app.use(cors({
    origin : true , 
    credentials : true 
}))
app.use(express.json()); //forntend থেকে ডাটা আসলে তা যেন use করতে পারে এর জন্য এই middleware 
app.use(express.urlencoded({extended : true})); //frontend থেকে file এর data আসলে তা যেন use করতে পারে। 
app.use(cookieparser()); //cookie save, use  এগুলো করার জন্য 
//User Router
app.use('/api/auth' , AuthRouter); 
module.exports = app ; 

