const userModel = require('../Models/userModel');
const validator = require('validator');

const registerUser = async (req, res) => {
  try {
    const { firstName, email } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json({
        message: 'User with the given email already exists.',
        success: false
      });

    if (!firstName || !email)
      return res.status(400).json({
        message: 'All fields are required.',
        success: false
      });

    if (!validator.isEmail(email))
      return res.status(400).json({
        message: 'Please enter valid email.',
        success:false
      });

    user = new userModel({ firstName, email });

    await user.save();

    res.status(200).json({
      message: 'User added',
      success: true
    });
  } catch (e) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
    });
  }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
      const result = await userModel.updateOne({ _id: id }, updatedData);

      if (result.nModified === 0) {
        return res.status(404).json({
          message: 'No matching record found',
          success: false,
        });
      }

      res.status(200).json({
        message: 'User updated',
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        success: false,
      });
    }
}

const getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel.findById({ _id:id });

    const { _id, email, firstName } = user.toObject();
    const modifiedUser = {
      id: _id,
      email,
      firstName
    };

    res.status(200).json({
      success: true,
      user: modifiedUser
    });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({
        message: 'No matching record found',
        success: false,
      });
    }

    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();

    let modifiedUsers = users;

    if (users.length !== 0) {
      modifiedUsers = users.map(user => {
        const { _id, email, firstName } = user.toObject();
        return { id: _id, email, firstName };
      });
    }

    res.status(200).json({
      message: 'Users retrieved',
      success: true,
      users: modifiedUsers,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};


module.exports = { registerUser, updateUser, getUserDetails, getAllUsers };
