// require thought and user models
const { Thought, User } = require('../models');

// initiate thought controller
const thoughtController = {
  // get all the thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v',
      })
      // .populate({
      //   path: 'thoughts',
      //   select: '-__v',
      // })
      .select('-__v')
      .then((results) => res.json(results))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // get single thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .then((results) => {
        // if no results, set status to 404 and reply with message
        if (!results) {
          res.status(404).json({
            message: 'No results found with that ID, please try again',
          });
          return;
        }
        // else respond with results
        res.json(results);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // create a new thought
  createThought({ body }, res) {
    // create new thought with req body
    Thought.create(body)
      .then((results) => {
        // find user and add new thought
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $addToSet: { thoughts: results._id } },
          { new: true }
        );
      })
      .then((results) => {
        // if no results, respond with 404 and message
        if (!results) {
          res
            .status(404)
            .json({ message: 'No user found, try again with different ID' });
          return;
        }
        // else, respond with results
        res.json(results);
      })
      .catch((err) => res.json(err));
  },
  // update a thought by its ID
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((results) => {
        // if no results, set status 404 and message user
        if (!results) {
          res
            .status(404)
            .json({ message: 'No user found, try again with different ID' });
          return;
        }
        // else, respond with results
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  // delete a thought by its ID
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((results) => {
        // if no results, set status 404 and message user
        if (!results) {
          res.status(404).json({
            message: 'No results found with that ID, try a different one',
          });
          return;
        }
        // else respond with results
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },
  // add a new reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true }
    )
      .then((results) => {
        //   if no results, set status 404 and message user
        if (!results) {
          res
            .status(404)
            .json({ message: 'No results found, try again with different ID' });
        }
        //   else respond with results
        res.json(results);
      })
      .catch((err) => res.status(400).json(err));
  },

  // delete a reaction
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

// export
module.exports = thoughtController;