const res = require('express/lib/response');
const { User } = require('../models');


const userController = {
  //get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .populate({
        path: 'friends',
        select: '-__v',
      })
      .select('-__v')
      .then((results) => res.json(results))
      .catch((err) => res.status(500).json(err))
  },
  //get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((results) => {
        if (!results) {
          res.status(404).json({
            message:
              'No results found based on that ID',
          });
          return;
        }
        res.json(results);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  //create user
  createUser({ body }, res) {
    User.create(body)
      .then((results) => res.json(results))
      .catch((err) => res.status(400).json(err));
  },
  //update user
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found based on that ID' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  //delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found based on that ID' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  //add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendsId } },
      { new: true }
    )
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(400).json(err));
  },
  //delete friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendsId } },
      { new: true }
    )
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found based on that ID' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;