const mongoose = require('mongoose'); 
const connectedDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('Database Connected Successfully.....'); 
    }catch(error){
        console.error(error.message);

        /*
এইটা কাজ করবে যখন আমাদের Database connect না হয়ে কোন error আসবে তখন যেন server বন্ধ হয়ে যায় 
কারণ server তো শুধু চালানোর দরকার নাই। 
        */
        process.exit(1);
    }
}

module.exports= connectedDb; 