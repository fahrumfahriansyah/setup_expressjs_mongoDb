const { validationResult } = require('express-validator');
const users = require("../Models/User");
const bcrypt = require("bcrypt");
const { createToken } = require('../Midleware/jwt');

exports.Register = async (req, res, next) => {
    const { email, username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(200).json({
            status:500,
            error:errors.array()
        })
    }
    try {
        const existingUser = await users.findOne({ username: username});

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists",
                status: 400,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new users({
            email,
            username: username,
            password: hashedPassword
        });

        const result = await newUser.save();

        res.status(201).json({
            message: "User created",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.Login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const account = await users.findOne({ username: username });
        console.log('Database query result:', account);

        if (account && account.password) {
            bcrypt.compare(password, account.password, function (err, result) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: "Error comparing passwords",
                        status: 500,
                    });
                }

                if (result) {
                    const accessToken = createToken(account);
                    res.cookie("accessToken", accessToken, {
                        maxAge: 30 * 60 * 1000, // 30 minutes
                        httpOnly: true,
                        signed: true,
                        sameSite: "strict",
                        secure: true,
                        expires: new Date(Date.now() + 30 * 60 * 1000),
                    });


                    return res.status(200).json({
                        message: "Login successful",
                        status: 200,
                    });
                } else {
                    return res.status(401).json({
                        message: "Invalid password",
                        status: 401,
                    });
                }
            });
        } else {
            return res.status(401).json({
                message: "Invalid username or password",
                status: 401,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            status: 500,
        });
    }
};
