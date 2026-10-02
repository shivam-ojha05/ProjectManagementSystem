import { body } from 'express-validator';
import { AvailableUserRole } from '../utils/constants.js';

const userRegisterValidator = () => {
  return [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Email is invalid'),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLowercase()
      .withMessage('Username must be in lower case')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('fullname').optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body('email').optional().isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body('oldPassword').notEmpty().withMessage('Old Password is required'),

    body('newPassword').notEmpty().withMessage('New Password is required'),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email is Required')
      .isEmail()
      .withMessage('Email is Invalid'),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body('newPassword').notEmpty().withMessage('Password is required')];
};

const createProjectValidator = () => {
  return[
    body("name")
      .notEmpty()
      .withMessage("Name is required"),
    body("description")
      .optional(),
  ]
};

const addMembertoProjectValidator = () =>{
  return[
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid"),
    body("role")
      .notEmpty()
      .withMessage("Role is Required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid"),

  ]
}

export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator
};
