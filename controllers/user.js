const db = require('../config/db.config')

const User = require('../model/user')

const JWT = require('jsonwebtoken')

const nodemailer = require('nodemailer');

//sending msg
const {sendToken , VerifyToken , registerUser , sendTokens } = require('../helpers/twilo');


const sendReport = (email, cb) => {
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.BUSINESS_EMAIL,
            pass: process.env.BUSINESS_PASSWORD
        },
        tls: {
        rejectUnauthorized: false
    }
    });

    let mailtoken = emailToken(email)
    let mailOptions = {
        from: process.env.BUSINESS_EMAIL,
        to: email,
        subject: "Verify Email Account",
        html: `
            <h2>Click on the below link to verify your account</h2>
            <a href=${process.env.CLIENT_URL}/users/verify/${mailtoken}>${process.env.CLIENT_URL}/users/verify/${mailtoken}</a>
            <p>Expires in 10mins</p>
            ` 
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, data);
    });
}

// async email
emailToken = email => {
    return JWT.sign({
        email
      },
      process.env.JWT_ACC_ACTIVATION,
      {
        expiresIn: '10m',
      }
    );
}


signToken = user => {
    return JWT.sign({
      iss: 'SomePayloadData',
      sub: user.user_id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, process.env.JWT_SECRET); //change secret
}

module.exports = {
    signUp : async (req, res, next) => {
        //email and password
        const { email, password } = req.value.body

        let foundUser = await User.findOne({
            where: {
                email: email 
            }
        })
        if (foundUser) { 
            return res.status(403).json({ error: 'Email is already in use'});
        }

        sendReport(email, function(err, data) {
            if (err) {
                console.log('ERROR: ', err);
                return res.status(500).json({ message: err.message || 'Internal Error' });
            }
            console.log('Email sent!!!');
            // return res.json({ message: 'Email sent!!!!!' });
        });

        const user = {
            email: email,
            password: password,
            method: 'local'
        };

        // // Check if method is valid
        let isValidMethod = User.rawAttributes.method.values[0] //raw enum value
        if (isValidMethod != user.method) {
            return res.status(400).json("Method is not valid. Please contact administrator") 
        }

        //   // Save User in the database
        await User.create(user)
        .then((result) => {
            const token = signToken(result) //current inserted user
            res.status(200).json({ token })
        })
        .catch(err => {
            return res.status(500).json('Some error occurred while creating user account'+err)
        });
    },

    activateAccount: async (req, res, next) => {
        const {token} = req.body

        if(token) {
            JWT.verify(token, process.env.JWT_ACC_ACTIVATION, function(err, decodedToken) {
                if(err) {
                    return res.status(400).json({ error : "Incorrect TOken"})
                } else {
                    const { email } = decodedToken
                    res.status(200).json(`${email} is verified`)
                }
            })
        } else {
             return res.json({error: "Enter Token and Please verify account again"})
        }
    },

    googleOAuth: async (req, res, next) => {
        console.log('got here');
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    signIn : async (req, res, next) => {
        // generate tokens
        const token = signToken(req.user) //current entered user
        res.status(200).json({ token })
    },

    secret : async (req, res, next) => {
        console.log("token accessed")
        res.json("token accessed")
    },

    //sending otp
    signInUsingMobileSendOTP: async( req , res , next) => {
        console.log("inside send otp fun");
        const { email, password, mobile , authyID ,method } = req.body;
        let result;
        try {      

            //  await sendToken(mobile);
            //  console.log("abc",await sendTokens(mobile));
            const user = await User.findOne({ where: { email: req.body.email } });
                    
            if(!user) {
                const newUser = {
                    email:email,
                    password:password,
                    mobile:mobile,
                    authyID:authyID,
                    method:method 
                }
                //WORKS IN PAID VERSION
                // const twiloRegisteruser = await registerUser( newUser.email , newUser.mobile);
                // console.log("twiloRegisteruser",twiloRegisteruser);
                await User.create(newUser);
                result = await sendToken(newUser.mobile, newUser.authyID);

            } else {
                result = await sendToken(user.mobile  ,user.authyID);  
                await User.update({ otp: result.otp }, {
                    where: {
                        email:user.email
                    }
                  });
            }

               return res.status(201).send({
                    message: 'Account created successfully, kindly check your phone to activate your account!',
                    data: user,
                    result: result
                })
            
        } catch (error) {
            console.log(error);   
        }
    },

    //verify OTP
    verifyOTP : async (req , res , next) => {
        const {  authyId , otp } = req.body; 

        try {
            console.log(req.body.authyId);
            
            let user = await User.findOne({ where: { authyID : authyId } })
            // console.log(user);
            if(!user) {
                const error = new Error('user not found');
                console.log(error);
                error.statusCode = 422;
                error.data = 'user not found';
                return res.json({ 
                    error:error
                })
            }

            if(otp !== user.otp) {
                return res.json({ message:" Verification failed"})
            }
            return res.json({ message:" Verification succeful"})

        } catch (err) {
            const error2 = new Error('Something went wrong');
            console.log(err);
            error2.statusCode = 500;
            throw error2;
        }

        // let user = req.session.user; 
        // console.log("djsk",JSON.stringify(req.body.token));
        // User.findOne({email:user.email})
        // .then(registerdUser => {
        //     let tokenRes =  VerifyToken(req.session.user.authyID , JSON.stringify(req.body.token)); 
        //     // console.log("verifyOTP",tokenRes.message , tokenRes.success); 
            
        //     req.session.authy = tokenRes;
        //    return res.status(201).send({
        //     //    data: tokenRes.message ,
        //         message: 'OTP verified. '
        //     })
        // })
        // .catch( err => {
        //     console.log("sendotp" , err);
        //     return res.send({
        //         message: 'OTP not verified. ',
        //         success: false
        //     })
        // })
    }
}