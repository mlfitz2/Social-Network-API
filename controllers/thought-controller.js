// require thought and user models
const { Thought, User } = require('../models');

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      .select('-__v')
      .then((results) => res.json(results))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

//get thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((results) => {
        if (!results) {
          res.status(404).json({
            message: 'No results found based on that ID',
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

  //create new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then((results) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $addToSet: { thoughts: results._id } },
          { new: true }
        );
      })
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found based on that ID' });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.json(err));
  },

  //Update thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
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

  //delete thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((results) => {
        if (!results) {
          res.status(404).json({
            message: 'No results found based on that ID',
          });
          return;
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },

  //add reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true }
    )
      .then((results) => {
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found based on that ID' });
        }
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },

  //delete reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((results) => res.json(results))
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtController;