const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
    //   const result = Joi.validate(req.body, schema); // deprecated method 
    const result = schema.validate(req.body); // new method

      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      next();
    }
  },
  schemas: {
    authSchema: Joi.object({
      // method: Joi.string().required(),

      email: Joi.string()
      .email().required(),
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),  
    password: Joi.string().required()
    // .required() // NOT required because other authentications are present
    // we can add it based on which login option user selects
    })
  }
}

// ,
//   googleSchema : {
//     authSchema: Joi.object({
//       // method: Joi.string().required(),

//       google_id: Joi.string().required(),
//       // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),  
//       google_gmail: Joi.string().email().required(),
//       // .required() // NOT required because other authentications are present
//       // we can add it based on which login option user selects
//     })
//   }
