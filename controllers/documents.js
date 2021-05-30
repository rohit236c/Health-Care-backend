let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();
const {blockchain} = require('../controllers/blockchain');
const fs = require('fs');
const DIR = './public/';

let id = 1;

const Patients = require("../models/Patient");
const Doctors = require("../models/doctor");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, id + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model
let Documents = require('../models/Documents');
const asyncHandler = require("../async");

const run  = asyncHandler(async(req,res,next) => {
    const url = req.protocol + '://' + req.get('host')
    const id = req.params.id;
    console.log(req.body,"d");
    const doc = new Documents({
        userid: id,
        img: url + '/public/' + req.file.filename,
        secret: req.body.secret
    });
    console.log(req.file, "path")
    doc.image.data = fs.readFileSync(req.file.path)
    doc.image.contentType = 'image/jpeg';
    const patient =  await Patients.findOne({
        id: id
    }).exec()
    console.log(patient, "response", req.params.id)
    doc.save().then(result => {
        patient.documents.push(result)
        patient.save();
        next();
        console.log(result, "result")
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                success: false,
                error: err
            });
    })
})
router.post('/upload/:id', upload.single('profileImg'), run, blockchain)


module.exports = router;