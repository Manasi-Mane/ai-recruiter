const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllCandidates, getCandidate, shortlistCandidate } = require('../controllers/recruiterController');

router.get('/candidates', auth, getAllCandidates);
router.get('/candidates/:id', auth, getCandidate);
router.patch('/candidates/:id/shortlist', auth, shortlistCandidate);

module.exports = router;