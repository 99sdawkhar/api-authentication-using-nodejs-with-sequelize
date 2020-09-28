const express = require('express');

const router = express.Router();

const {SendSms} = require('../controllers/smsController');


router.post('/verify' ,SendSms);

module.exports = router;