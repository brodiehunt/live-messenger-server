const {body, validationResult} = require('express-validator');

exports.signinValidation = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({min: 6, max: 20})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Invalid password')
];

exports.registerValidation = [
  body('name')
    .trim()
    .isLength({min: 3, max: 20})
    .withMessage('Name must be more than 2 and less than 20 characters'),
  body('username')
    .trim()
    .toLowerCase()
    .isLength({min: 5, max: 15})
    .withMessage('Invalid Username'),
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .trim()
    .isLength({min: 6, max: 20})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Invalid password')
];

exports.nameValidation = [
  body('name')
    .trim()
    .isLength({min: 3, max: 20})
    .withMessage('Name must be more than 2 and less than 20 characters')
]

exports.usernameValidation = [
  body('username')
    .trim()
    .toLowerCase()
    .isLength({min: 5, max: 15})
    .withMessage('Invalid Username')
];

exports.emailValidation = [
  body('email')
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage('Invalid email')
];

exports.passwordValidation = [
  body('password')
    .trim()
    .isLength({min: 6, max: 20})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Invalid password')
];


exports.handleValidation = (req, res, next) => {
  const result = validationResult(req);
  console.log('enter valiation block');
  if (result.isEmpty()) {
    return next();
  }
  // result errArr = [[path, msg], [path, msg]]
  const errorsArr = result.errors.map((fieldObj) => {
    return [fieldObj.path, fieldObj.msg]
  })

  // result errorsObj = {path: msg, path: msg}
  const errorsObj = Object.fromEntries(errorsArr);

  return res.status(422).json({
    error: errorsObj
  })
}