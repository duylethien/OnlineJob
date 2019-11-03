//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValiddation = data => {
    const schema = {
        name: Joi.string()
            .min(6)
            .required(),
        username: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .required()
    };
    return Joi.validate(data, schema);
};

//Login Validation
const loginValidation = data => {
    const schema = {
        username: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .required()
    };
    return Joi.validate(data, schema);
};

module.exports.registerValiddation = registerValiddation; 
module.exports.loginValidation = loginValidation; 
