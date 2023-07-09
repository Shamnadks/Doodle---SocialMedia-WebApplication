dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SOCIAL-MEDIA',
        allowedformats: ['jpeg', 'png', 'jpg']
    }
})

export default storage;
