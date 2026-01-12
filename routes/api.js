const express = require('express');
const router = express.Router();
const validateKey = require('../middlewares/apiKeyAuth');
const authController = require('../controllers/authController');
const pokemonController = require('../controllers/pokemonController');


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);


router.post('/dashboard/generate-key', authController.generateKey);
router.get('/dashboard/my-key', authController.getMyKey);


router.get('/v1/pokemon/:name', validateKey, pokemonController.getGlobalPokemon);
router.post('/v1/pokemon', validateKey, pokemonController.createCustomPokemon);
router.get('/v1/custom-pokemon', validateKey, pokemonController.getCustomPokemon);
router.delete('/v1/pokemon/:id', validateKey, pokemonController.deleteCustomPokemon);
router.put('/v1/pokemon/:id', validateKey, pokemonController.updateCustomPokemon);

module.exports = router;