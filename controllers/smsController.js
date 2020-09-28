const sendToken = require('../helpers/twilo');

const userDatabase = [];

exports.SendSms = (req , res , next) =>{
  const { email, password, phone , authy_id } = req.body;
  const user = {
    email,
    password,
    phone,
    authy_id
  };
  userDatabase.push(user);
  console.log(userDatabase);

  const welcomeMessage = 'Welcome to Opalod! Your verification code is 54875';
    console.log(user.phone);
    const a = user.phone;
    console.log(parseInt(a));
    // sendToken(parseInt(a) , welcomeMessage , user.authy_id);

  res.status(201).send({
    message: 'Account created successfully, kindly check your phone to activate your account!',
    data: user
  }) 
};