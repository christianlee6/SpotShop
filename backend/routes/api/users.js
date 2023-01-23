// backend/routes/api/users.js
const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ]

// SIGN UP A USER
router.post("/", validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    //status 400 is given when body validations for the email, firstName, or lastName are violated
  if (!username || !email || !firstName || !lastName) {
    res.status(400)
    return res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    })
  }

  //status 403 is given when the specified email/ username already exists
  const existingEmail = await User.findOne({
    where: { email }
  })

  if (existingEmail) {
    res.status(403)
    return res.json({
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "email": "User with that email already exists"
      }
    });
  }

  const existingUsername = await User.findOne({
    where: { username }
  })

  if (existingUsername) {
    res.status(403)
    return res.json({
      "message": "User already exists",
      "statusCode": 403,
      "errors": {
        "username": "User with that username already exists"
      }
    });
  }

  const user = await User.signup({ firstName, lastName, email, username, password })

  //find jwt token
  const token = await setTokenCookie(res, user)

  // user.dataValues.token = token
  // return res.json(user)

  return res.json({user: user})

    // let errObj = {
    //     message: "Validation error",
    //     statusCode: 400,
    //     errors: [],
    // };

    // if (!email || !email.includes("@")) {
    //     errObj.errors.push("Invalid email");
    // }

    // if (!username || !username.length) {
    //     errObj.errors.push("Username is required");
    // }

    // if (username) {
    //     if (username.length < 4) {
    //         errObj.errors.push("Username must be at least 4 characters");
    //     }
    // }

    // if (!firstName) {
    //     errObj.errors.push("First Name is required");
    // }

    // if (!lastName) {
    //     errObj.errors.push("Last Name is required");
    // }

    // if (
    //     !email ||
    //     !username ||
    //     username.length < 5 ||
    //     !firstName ||
    //     !lastName ||
    //     !email.includes("@")
    // ) {
    //     res.status(400);
    //     return res.json(errObj);
    // }

    // let usersList = [];

    // usersList = await User.findAll({
    //     attributes: ["email", "username"],
    // });

    // usersList.forEach((user) => {
    //     let userEmail = user.email;
    //     let userUsername = user.username;
    //     if (email === userEmail && username === userUsername) {
    //         res.status(403);
    //         return res.json({
    //             message: "User already exists",
    //             statusCode: 403,
    //             errors: [
    //                 "User with that email already exists",
    //                 "User with that username already exists",
    //             ],
    //         });
    //     }
    // });

    // usersList.forEach((user) => {
    //     let userEmail = user.email;
    //     if (email === userEmail) {
    //         res.status(403);
    //         return res.json({
    //             message: "User already exists",
    //             statusCode: 403,
    //             errors: ["User with that email already exists"],
    //         });
    //     }
    // });

    // usersList.forEach((user) => {
    //     let userUsername = user.username;
    //     if (username === userUsername) {
    //         res.status(403);
    //         return res.json({
    //             message: "User already exists",
    //             statusCode: 403,
    //             errors: [
    //                 "User with that username already exists",
    //             ]
    //         });
    //     }
    // });

    // const user = await User.signup({
    //     email,
    //     username,
    //     password,
    //     firstName,
    //     lastName,
    // });

    // await setTokenCookie(res, user);

    // return res.json({user: user});
});



module.exports = router;
