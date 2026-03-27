const router = require('express').Router();
const auth = require('../middleware/auth');
const { getProfile, saveProfile, aiProcess } = require('../controllers/candidateController');

router.get('/profile', auth, getProfile);
router.post('/profile', auth, saveProfile);
router.post('/ai-process', auth, aiProcess);

module.exports = router;