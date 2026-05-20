const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = "secret" 

const createUser = async (req, res) => {

    const hashedpassword = await bcrypt.hash(req.body.password, 10)

    try {
        const savedUser = await userSchema.create({
            ...req.body,
            password: hashedpassword
        });

        // ✅ Email ko try-catch me daalo
        try {
            await mailSend(
                savedUser.email,
                "Welcome Mail",
                "Welcome to expense manager app"
            );
        } catch (mailErr) {
            console.log("Email failed ❌", mailErr.message);
        }

        res.status(201).json({
            message: "user created..",
        });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error while creating user..",
        });
    }
}
const getAllUsers = async (req, res) => {

    const query = req.query

    try {
        const users = await userSchema.find(query);
        res.status(200).json({
            message: "users",
            data: users,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "error while ferching user",
            err: err,
        });
    }
}
const deleteUser = async (req, res) => {

    try {
        const deletedUser = await userSchema.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: "user delete sucessfully",
            data: deletedUser
        })
    }
    catch (err) {
        res.status(500).json({
            message: "user is not deleted",
            err: err
        })
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUserFromEmail = await userSchema.findOne({ email: email })
        console.log(foundUserFromEmail)

        if (foundUserFromEmail) {
            if (bcrypt.compareSync(password, foundUserFromEmail.password)) {
                const token = jwt.sign(foundUserFromEmail.toObject(), secret);
                res.status(200).json({
                    message: "Login Success",
                    token: token
                })
            }
            else {
                res.status(401).json({
                    message: "invalid credentials",
                })
            }
        }
        else {
            res.status(404).json({
                message: "user not Found",
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error during login",
            error: err.message
        })
    }
}
const getProfile = async (req, res) => {

  try {
    const userId = req.user._id
    const user = await userSchema.findById(userId)

    res.status(200).json({
      message: "Profile fetched successfully",
      data: user

    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
    message: "Error while fetching profile"

    })

  }

}

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    loginUser,
    getProfile
}