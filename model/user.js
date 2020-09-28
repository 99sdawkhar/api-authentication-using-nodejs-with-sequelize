// const Sequelize = require('sequelize')

// db connection
const db = require("../config/db.config"); //changed name of sequelize to db update: again changed to sequelize again to db
// NOTE: db.Sequelize and db.sequelize are used differently check db file

const bcrypt = require('bcryptjs');
const { sequelize,Sequelize } = require('../config/db.config');

const User = db.sequelize.define('persons', { 
    user_id:{
        type:Sequelize.INTEGER,
        autoIncrement:true, 
        allowNull:false, 
        primaryKey:true
    },

    method: {
      type: Sequelize.ENUM,
      values: ['local', 'google', 'facebook' , 'mobile'],
      allowNull: false
    },

    google_id: {
      type: Sequelize.STRING, 
      allowNull:true
    },
  
    fname: { 
      type: Sequelize.STRING, 
      allowNull:true }, 
  
    lname: { 
      type: Sequelize.STRING, 
      allowNull:true }, 

    email: { 
      type: Sequelize.STRING, 
      allowNull:true }, 

    password: { 
      type: Sequelize.STRING, 
      allowNull:true
    }, 

    mobile: { 
      type: Sequelize.STRING, 
      allowNull:true 
    } ,
    authyID: Sequelize.STRING,
    otp: Sequelize.STRING
    
    
    // google_mail: { //adding this to email field
    //   type: Sequelize.STRING, 
    //   allowNull:true
    // }


}
// ,{
//   hooks: {
//     beforeCreate: async function(persons) {
//       const salt = await bcrypt.genSalt(10); 
//       persons.password = await bcrypt.hash(persons.password, salt);
//     }
//   }
// }
)

User.beforeCreate(async function(persons) {
  try {
    // console.log(persons.method)
    if (persons.method == 'local' || persons.method == 'mobile') {
      const salt = await bcrypt.genSalt(10); 
      persons.password = await bcrypt.hash(persons.password, salt);
    }
  } catch (err) {
    console.log(err)
  }
});

// compare password from database with user entered for local login
User.prototype.isValidPassword = async function(newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password); //db_pass -> this.password and user entered pass > newPassword
  } catch(error) {
    console.log(error)
    // throw new Error(error);
  }
}

module.exports = User