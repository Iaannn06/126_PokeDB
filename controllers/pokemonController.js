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

exports.createCustomPokemon = async (req, res) => {
    const { name, type, base_power } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!name || !type) return res.status(400).json({ error: "Nama & Tipe wajib diisi" });

    try {
        const [result] = await db.query(
            'INSERT INTO custom_pokemons (name, type, base_power, created_by_key) VALUES (?, ?, ?, ?)',
            [name, type, base_power || 0, apiKey]
        );
        res.json({ status: "success", message: "Data tersimpan di MySQL!", id: result.insertId, name });
    } catch (error) {
        res.status(500).json(error);
    }
};

