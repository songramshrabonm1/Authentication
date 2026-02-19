require('dotenv').config() ; 
const app = require('./src/app'); //. মানে current folder  . 
const connectedDb = require('./src/config/db') ; 
const port = process.env.PORT ; 

connectedDb() ; 

app.listen(port , ()=>{ //server start করা হয়েছে. 
    console.log(`Server Is Running At The Port - ${port}`); 
})
