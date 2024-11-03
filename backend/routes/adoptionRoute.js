const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

router.post('/',adoptionController.addAdoption);
router.get('/',adoptionController.getAllAdoptions);
router.get('/:id',adoptionController.getParticularAdoption);
router.put('/:id',adoptionController.updateAdoption);

module.exports = router;