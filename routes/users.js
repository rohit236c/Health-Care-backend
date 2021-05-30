const express = require("express");
const router = express.Router();
const {getSecret, getDocuments} = require('../controllers/documents')
//router.post("/join", join);
router.post("/getsecret", getSecret);

router.post("/getdocs", getDocuments);

module.exports = router;
