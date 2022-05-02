const router = require('express').Router();
const {
  getAllThoughts,
  getOneThought,
  addThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router
	.route('/')
	.get(getAllThoughts)
	.post(addThought);

// /api/thoughts/:id
router
	.route('/:thoughtId')
	.get(getThoughtById)
	.post(addThought)
	.put(updateThought)
	.delete(removeThought);

// /api/thoughts/:thoughtId/reactions
router
	.route('/:thoughtId/reactions')
	.post(addReaction);

router.route('/:thoughtId/:reactionId')
	.delete(removeReaction);
  
module.export = router;