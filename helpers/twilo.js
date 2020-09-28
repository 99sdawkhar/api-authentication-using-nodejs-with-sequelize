// const authy = require('authy')('xzzKYmSLEg8VFsd6BAywUtcWImVV8JYE');
const authy = require('authy')('xzzKYmSLEg8VFsd6BAywUtcWImVV8JYE');
const User = require('../model/user');

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

const Nexmo = require('nexmo');

// const nexmo = new Nexmo({
//   apiKey: 'f866c971',
//   apiSecret: 'ip38jiqAntt97ni2',
// });

const nexmo = new Nexmo({
  apiKey: process.env["NEXMO_API_KEY"],
  apiSecret: process.env["NEXMO_API_SECRET"]
});

exports.registerUser = async ( email, mobile ,) => {
  console.log(email , mobile);
  const result = await client.validationRequests.create({friendlyName: email, phoneNumber: mobile});
  const abc = await (validation_request => console.log(validation_request.friendlyName));
  console.log( abc);
} 

exports.sendToken = async (phone  ,authy_id) => {
  console.log(phone);
  const client = require('twilio')(accountSid,authToken);
  // console.log(authy, client);
  const otp =  generateOTP();
  console.log("otp",otp);
  client.messages.create({
    body: 'Your OTP is = '+ otp,
    from: phoneNumber,
    to: phone
  });
  const result = {
    message: "Otp sent" ,
    otp: otp
  };
  console.log("twilo" , result);
  return result;
  // const result = await authy.request_sms(authy_id, function (err, res) {
  //   if(err) {
  //     return console.log("twilo",err);
  //   }
  //   console.log(result);
  //   return result;
  //   // res.status(200).json(smsRes); 
  // });
};

// exports.sendToken = async (mobileno) => {
//   const from = 'Vonage APIs'; 
//   const to = mobileno; 
//   const otp = generateOTP();
//   const text = `OTP  ${otp}`; 
//   console.log(to);
//   let results;
//   await nexmo.message.sendSms(from, to, text, (err, responseData) => {
//     if (err) {
//       console.log(err);
//       results = "Fail";
//       return results;
//   } else {
//       if(responseData.messages[0]['status'] === "0") {
//           console.log("Message sent successfully.");
//           results = "Success";
//           return results;
//       } else {
//           console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//           results = "Fail";
//           return results;
//       }
//   }
//   });
// }

function generateOTP () {
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    let OTP = ''; 
      
    // Find the length of string 
    var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
      } 
      console.log("otp",OTP);
    return OTP; 
}

exports.VerifyToken =  (authyId , token ) =>{
  console.log("token",token);
    authy.verify(authyId,token, 
      function (err, tokenRes) {
      // console.log(tokenRes);
      return  tokenRes;
      // res.status(200).json(tokenRes);
  });
}







// https://authy.com/blog/quick-and-easy-2fa-adding-authy-to-a-nodejs-app/
