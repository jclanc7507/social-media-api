const { Thought, User } = require('../models');

const thoughtController = {

	getThoughts(req, res) {
		Thought.find({})
			.select('-__v')
			.sort({ _id: -1 })
			.then(dbThoughtData => res.json(dbThoughtData))
			.catch(err => {
				console.log(err);
				res.sendStatus(400);
			});
	},
	// get one Thought by id
	getThoughtWithId({ params }, res) {
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

	// add Thought to User
	addNewThought({ params, body }, res) {
		console.log(params);
		Thought.create(body)
			.then(({ _id }) => {
				let a = User.findOneAndUpdate(
					{ _id: params.UserId },
					{ $push: { Thoughts: _id } },
					{ new: true }
				);
				res.json({ a });
			})
			.catch(err => res.json(err));
	},

	// update Thought by id
	updatedThought({ params, body }, res) {
		Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
			.then(dbThoughtData => {
				if (!dbThoughtData) {
					res.status(404).json({ message: 'No Thought found with this id!' });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch(err => res.json(err));
	},

	// add Reaction to Thought
	addedReaction({ params, body }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $push: { reactions: body } },
			{ new: true, runValidators: true }
		)
			.then(dbUserData => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No User found with this id!' });
					return;
				}
				res.json(dbUserData);
			})
			.catch(err => res.json(err));
	},

	// delete Thought
	removedThought({ params }, res) {
		Thought.findOneAndDelete(
			{ _id: params.thoughtId },
			{ new: true, runValidators: true }
		)
			.then(dbThoughtData => res.json(dbThoughtData))
			.catch(err => res.json(err));
	},


	// remove Reaction
	removedReaction({ params }, res) {
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $pull: { reactions: { reactionId: params.reactionId } } },
			{ new: true, runValidators: true }
		)
			.then(dbUserData => res.json(dbUserData))
			.catch(err => res.json(err));
	}
};

module.exports = thoughtController;