const axios = require('axios');
const db = require('../config/db');

exports.getGlobalPokemon = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        res.json({
            source: "Official PokeAPI (Global)",
            id: response.data.id,
            name: response.data.name,
            types: response.data.types.map(t => t.type.name),
            sprite: response.data.sprites.front_default
        });
    } catch (error) {
        res.status(404).json({ error: "Pokemon tidak ditemukan di Global." });
    }
};

