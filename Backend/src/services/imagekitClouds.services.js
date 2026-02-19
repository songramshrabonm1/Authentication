const imagekit = require('@imagekit/nodejs'); 

const ImageKit = new imagekit({
    privateKey : process.env.PRIVATE_KEY_IMAGEKIT
})

const UploadImage = async(imageFile , ImageName)=>{
    const File = await ImageKit.files.upload({
        file : imageFile.toString('base64'), 
        fileName : `${ImageName}-${Date.now()}`
    })
    return File 
}
module.exports = UploadImage; 