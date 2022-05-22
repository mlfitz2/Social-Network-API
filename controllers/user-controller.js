const res = require('express/lib/response');
const { User } = require('../models');


const userController = {
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
              'No user with that ID found, try again with different ID please.',
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
  createUser({ body }, res) {
    User.create(body)
      .then((results) => res.json(results))
      .catch((err) => res.status(400).json(err));
  },
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No user with that ID found, try again!' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No user with that ID found, try again' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendsId } },
      { new: true }
    )
      .then((results) => res.status(200).json(results))
      .catch((err) => res.status(400).json(err));
  },
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
            .json({ message: 'No results found with that ID, try again' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;