const multer=require('multer')
const Admini = require('../models/admin')
const fs = require('fs');
const AddAdmin=(user,pass,mail)=>{
    const adduser=new Admini.Admin(
        {
            username:user,
            password:pass,
            email:mail,
        }
    )
    adduser.save()
}
const username =[]
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(username[0])
        user=username[0]
        const userFolderPath = `src/uploads/${user}`;
        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }
        cb(null, userFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload =new multer({ storage: storage });
const imageUpload = async (images) => {
  try {
    await Admini.Image.insertMany(images);
      console.log('Images saved successfully');
  } catch (error) {
      console.error('Error saving images:', error);
  }
};

module.exports={AddAdmin,upload,imageUpload,username}