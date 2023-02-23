var  cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true
})


const subirImagen = async (fileBase64) => { 
  return await cloudinary.uploader.upload(fileBase64, {
    folder: 'platos',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

const borrarImagen = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId, {
    folder: 'platos',
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

module.exports = {subirImagen,borrarImagen};