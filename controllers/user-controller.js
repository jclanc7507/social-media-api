const { User } = require('../models');

const userController = {
	// get all Users
	getAllUsers(req, res) {
		User.find({})
			.populate({
				path: 'thoughts',
				select: '-__v'
			})
			.select('-__v')
			.sort({ _id: -1 })
			.then(dbUserData => res.json(dbUserData))
			.catch(err => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	// get one User by id
	getUserWithId({ params }, res) {
		User.findOne({ _id: params.userId })
			.populate({
				path: 'thoughts',
				select: '-__v'
			})
			.select('-__v')
			.then(dbUserData => res.json(dbUserData))
			.catch(err => {
				console.log(err);
				res.sendStatus(400);
			});
	},

	// create new User
	createNewUser({ body }, res) {
		User.create(body)
			.then(dbUserData => res.json(dbUserData))
			.catch(err => res.json(err));
	},

	// update User by id
	updatedUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
			.then(dbUserData => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No User found with this id!' });
					return;
				}
				res.json(dbUserData);
			})
			.catch(err => res.json(err));
	},

	// delete User
	destroyUser({ params }, res) {
		User.findOneAndDelete({ _id: params.userId })
			.then(dbUserData => res.json(dbUserData))
			.catch(err => res.json(err));
	},

	//add new friend to user
	addNewFriend({ params, body }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $push: { friends: params.friendId } },
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
	// delete existing friend from user
	removeOldFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } },
			{ new: true }
		)
			.then(dbUserData => res.json(dbUserData))
			.catch(err => res.json(err));
	}


};

module.exports = userController;