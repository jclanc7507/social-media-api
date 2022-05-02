const { Thought, User } = require('../models');

const thoughtController = {

  // get all thoughts
  getAllThoughts(req, res) {
		Thought.find({})
			.select('-__v')
			.sort({ _id: -1 })
			.then(dbThoughtData => res.json(dbThoughtData))
			.catch(err => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	// get one thought by id
	getThoughtById({ params }, res) {
		Thought.findOne({ _id: params.thoughtId })
			.populate({
				path: 'reactions',
				select: '-__v'
			})
			.select('-__v')
			.then(dbThoughtData => res.json(dbThoughtData))
			.catch(err => {
				console.log(err);
				res.sendStatus(400);
			});
	},

  // add thought from user
  addThought({ params, body}, res) {
    console.log(params);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true, runValidators: true }
        );
      })
      .then(dbUserData => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: 'No pizza found with this ID.'});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this ID'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(removeThought => {
        if (!removeThought) {
          return res.status(404).json({ message: 'No reaction found with this ID'});
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true, runValidators: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this ID' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { replies: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = { thoughtController };