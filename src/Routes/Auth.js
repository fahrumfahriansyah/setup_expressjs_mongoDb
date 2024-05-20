const express = require('express');
const router = express.Router();
const Auth = require("../Controllers/ControllersAuth.js");
const User = require("../Controllers/ControllersUser.js");
const { check } = require("express-validator");
const { validateToken } = require('../Midleware/jwt.js');

router.post("/register", [
    check('email').isEmail().withMessage('Invalid email format'),
    check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], Auth.Register);

router.post("/login",[
    check('email').isEmail().withMessage('Invalid email format'),
    check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],Auth.Login)

router.get("/users",validateToken,User.getAlls)
router.delete("/users",validateToken,User.deletes)
router.put("/users",validateToken,[
     check('email').optional().isEmail().withMessage('Invalid email format'),
    check('username').optional().isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('newPassword').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],User.Updates)


module.exports = router;
