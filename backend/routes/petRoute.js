const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const petController = require('../controllers/petController');

  // Configure storage for images
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../frontend/public/uploads')); // Store images in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp as filename
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('imageUrl'), petController.addPet);
router.get('/',petController.getAllPets);
router.get('/search',petController.searchPets);
router.get('/recent',petController.recentPetDetails);
router.get('/:id',petController.getParticularPet);
router.put('/:id', upload.single('imageUrl'), petController.updatePet);
router.delete('/:id',petController.deletePet);
router.put('/status/:id',petController.updatePetStatus);


module.exports = router;