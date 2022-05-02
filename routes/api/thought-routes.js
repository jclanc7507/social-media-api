const router = require('express').Router();
const {
	getThoughts,
	getThoughtWithId,
	addNewThought,
	updatedThought,
	removedThought,
	addedReaction,
	removedReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router
	.route('/')
	.get(getThoughts)
	.post(addNewThought);

// /api/thoughts/:id
router
	.route('/:thoughtId')
	.get(getThoughtWithId)
	.post(addNewThought)
	.put(updatedThought)
	.delete(removedThought);

// /api/thoughts/:thoughtId/reactions
router
	.route('/:thoughtId/reactions')
	.post(addedReaction);

router.route('/:thoughtId/:reactionId')
	.delete(removedReaction);

module.exports = router;
