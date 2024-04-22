const express = require('express');
const AddAd = require('../controllers/admin');
const database = require('../models/admin');
const bcrypt = require('bcrypt');
const otp = require('../middleware/admin')
const path = require('path')
const fs = require('fs')
const router = express.Router();
const upload = AddAd.upload
let userData = {};
let User = {};
router.post('/signup', async (req, res) => {
  try {
    const { user, pass, mail } = req.body;
    console.log(user + ' ' + pass+' '+mail);
    const foundUser = await database.Admin.findOne({ username: user });
    if (foundUser) {
      res.send("username already exist")
    }
    const send = otp.otp(mail)
    res.send('OTP sent successfully');
    const salts = 10;
    const hashedPass = await bcrypt.hash(pass, salts);
    userData = {
      user: user,
      hashedPass: hashedPass,
      mail: mail
    };
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.post('/upload-multiple', upload.array('image', 20), async (req, res) => {
    try {
        const files = req.files;
        const images = files.map(file => ({
            name: User.user, 
            img: {
                data: fs.readFileSync(file.path), 
                contentType: file.mimetype 
            }
        }));
        const result= await AddAd.imageUpload(images);
  res.send("IMAGE UPLOADED SUCCESSFULLY")
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.post('/login', async (req, res) => {
    const { user, pass } = req.body;
    console.log(user+' '+pass)
    AddAd.username[0] = user;
    User = {
      user:user
    }
    const foundUser = await database.Admin.findOne({ username: user });
    if (!foundUser) {
      return res.send("Username not found");
    }
    console.log("Found user:", foundUser);
    const isPassMatch = await bcrypt.compare(pass, foundUser.password);
    if (isPassMatch) {
      console.log("Login Successful");
      return res.send("Login Successful");
    } else {
      return res.send("Wrong password");
    }
});

router.get('/view-photos', async (req, res) => {
  try {
    const username = User.user; 
    const foundImages = await database.Image.find({ name: username });

    if (foundImages.length === 0) {
      return res.status(404).json({ message: 'No images found for user' });
    }

    // Map found images to include image source and ID
    const imageSrcs = foundImages.map(image => {
      const imageData = image.img.data.toString('base64');
      return {
        id: image._id, // Add ID property
        src: `data:${image.img.contentType};base64,${imageData}` // Image source
      };
    });

    res.status(200).json({ imageSrcs });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE route to delete an image
router.delete('/delete-image/:id', async (req, res) => {
  try {
      const imageId = req.params.id;
      const deletedImage = await database.Image.findByIdAndDelete(imageId);
      if (!deletedImage) {
          return res.status(404).json({ message: 'Image not found' });
      }
      res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/otp', async (req,res)=>{
   const userOtp=req.body;
   const re = await otp.verifyOtp(userOtp);
   const user = userData.user;
    const hashedPass = userData.hashedPass;
    const mail = userData.mail;
    console.log(user+" "+hashedPass+" "+mail);
   if(re){
    const result = await AddAd.AddAdmin(user,hashedPass,mail);
    res.send("USER ADDED SUCCESSFULLY")
   }
   else{
    res.send("wrong OTP")
   }
})

module.exports = {router,User};