const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { sendWelcomeEmail } = require("../utils/MailUtil")
const { uploadToCloudinary } = require("../utils/CloudinaryUtil")
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET || "secret" 

const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: "firstName, lastName, email and password are required",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "password must be at least 6 characters",
        });
    }

    try {
        const existingUser = await userSchema.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(409).json({
                message: "email already registered",
            });
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const savedUser = await userSchema.create({
            ...req.body,
            email: email.toLowerCase(),
            password: hashedpassword
        });

        // ✅ Email ko try-catch me daalo
        try {
            await sendWelcomeEmail(savedUser.email, {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
            });
        } catch (mailErr) {
            console.log("Email failed ❌", mailErr.message);
        }

        const userPayload = savedUser.toObject();
        delete userPayload.password;
        const token = jwt.sign(userPayload, secret);

        res.status(201).json({
            message: "user created successfully",
            token: token,
            data: userPayload,
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
        const foundUserFromEmail = await userSchema.findOne({ email: email?.toLowerCase() })
        console.log(foundUserFromEmail)

        if (foundUserFromEmail) {
            if (bcrypt.compareSync(password, foundUserFromEmail.password)) {
                const userPayload = foundUserFromEmail.toObject();
                delete userPayload.password;
                const token = jwt.sign(userPayload, secret);
                res.status(200).json({
                    message: "Login Success",
                    token: token,
                    data: userPayload
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
    const user = await userSchema.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User profile not found"
      })
    }

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

const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.user._id;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const cloudinaryResponse = await uploadToCloudinary(file.path);
        
        if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Error uploading to cloudinary" });
        }

        const updatedUser = await userSchema.findByIdAndUpdate(userId, { profilePic: cloudinaryResponse.secure_url }, { new: true }).select("-password");
        
        res.status(200).json({
            message: "Profile picture uploaded successfully",
            data: updatedUser
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error uploading profile picture" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const loginUserId = req.user._id;
        const { firstName, lastName, age, gender } = req.body;

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (age !== undefined) updateData.age = age === "" ? null : age;
        if (gender !== undefined) {
            updateData.gender = (gender === "" || gender === "Select Gender") ? null : gender;
        }

        const user = await userSchema.findByIdAndUpdate(
            loginUserId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            data: user
        });

    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    loginUser,
    getProfile,
    uploadProfilePic,
    updateProfile
}
