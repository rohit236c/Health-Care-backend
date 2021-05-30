const express = require("express");
const router = express.Router();
const {signup, login, getDoctors,provideAccess, getPatients, getSecret} = require("../controllers/auth");
// const {getSecret, getDocuments} = require('../controllers/documents')
//router.post("/join", join);
router.post("/signup", signup);
router.post("/signin", login);
router.get("/doctors", getDoctors);
router.post('/access',provideAccess);
//router.post("/join", join);
router.post("/getsecret", getSecret);
// router.post("/getdocs", getDocuments);
router.get('/patients/:id', getPatients);
module.exports = router;
