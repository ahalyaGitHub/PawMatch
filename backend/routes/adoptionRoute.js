const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');

router.post('/add',adoptionController.addAdoption);
router.get('/',adoptionController.getAllAdoptions);
router.get('/status/:userId/:petId', adoptionController.checkAdoptionStatus);
router.get('/:id',adoptionController.getParticularAdoption);
router.put('/:id',adoptionController.updateAdoption);

module.exports = router;