# api-authentication-using-nodejs-with-sequelize
# route to send otp = http://localhost:3000/users/send-otp
# BODY FOR SEND OTP ROUTe {
#    "method": "mobile" ,
#    "email" : "XXXXX@gmail.com",
#    "password" : "XXXX",
#    "mobile" : "+91XXXXXXXX" ,
#    "authyID" :  ""
# }
# Number must be registerd

# route to verify otp = http://localhost:3000/users/verify
# body for verify otp route
# {
#    "authyId" : XXXXXXXXX ,
#    "token" : "XXXXXXX"
# }