// backend/routes/api/session.js
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');

const router = express.Router();

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a password.'),
    handleValidationErrors,
  ];

// LOG IN A USER
router.post(
    '/',
    async (req, res) => {
      const { credential, password } = req.body;

      if (!credential || !password) {
        res.status(400)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                credential: "Email or username is required",
                password: "Password is required"
            }
        })
      }

      const user = await User.login({ credential, password });

      if (!user) {
        res.status(401)
        return res.json({
            message: "Invalid credentials",
            statuscode: 401
        })
      }

      await setTokenCookie(res, user);

      return res.json({
        user: user
      });
    }
  );

  // Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );

// GET THE CURRENT USER
router.get(
    '/',
    restoreUser,
    requireAuth,
    (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user: user.toSafeObject()
        });
      } else return res.json({ user: null });
    }
  );

module.exports = router;
