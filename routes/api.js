const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pokeController = require('../controllers/pokemonController');
const validateKey = require('../middlewares/apiKeyAuth');

router.post('/auth/register', authController.register); // <-- Register
router.post('/auth/login', authController.login);       // <-- Login
router.post('/dashboard/generate-key', authController.generateKey);
router.get('/dashboard/my-key', authController.getMyKey);

router.get('/v1/pokemon/:name', validateKey, pokeController.getGlobalPokemon);
router.post('/v1/pokemon', validateKey, pokeController.createCustomPokemon);
router.get('/v1/custom-pokemon', validateKey, pokeController.getCustomPokemon);

module.exports = router;