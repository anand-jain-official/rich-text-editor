const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8000;
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));

var path = require("path");

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

var upload = multer({ storage });

app.post('/upload', upload.single("media"), (req, res) => {
    if (!req.file && !req.body.description)
    return res.status(500).json({ status: "failed", message: "No Media" });

  var ext = req.file ? req.file.mimetype.split("/") : "snull";

  if (ext[0] === "image") {
    sharp(req.file.path)
      .resize(600)
      .toBuffer()
      .then(data => {
        fs.writeFileSync(req.file.path, data);
        res.status(200).json({
            status: 200,
            success: true,
            data: {
                id: `${req.file.path.split('/')[1].split('.')[0]}`,
                account_id: 0,
                account_url: null,
                ad_type: 0,
                ad_url: "",
                animated: false,
                bandwidth: 0,
                datetime: Date.now(),
                deletehash: makeid(15),
                description: null,
                edited: "0",
                favorite: false,
                has_sound: false,
                height: 278,
                width: 600,
                in_gallery: false,
                in_most_viral: false,
                is_ad: false,
                name: "",
                nsfw: null,
                section: null,
                tags: [],
                title: null,
                type: `image/${req.file.path.split('.')[1]}`,
                views: 0,
                vote: null,
                link: `http://localhost:8000/${req.file.path.split('/')[1]}`,
                size: 600
            }
         });
      })
      .catch(err => {
        console.log(err);
      });
  }

});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});


