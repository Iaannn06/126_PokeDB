const axios = require('axios');
const db = require('../config/db');

const checkUserRole = async (apiKey) => {
    const query = `SELECT u.id, u.role FROM users u JOIN api_keys k ON u.id = k.user_id WHERE k.key_string = ?`;
    const [rows] = await db.query(query, [apiKey]);
    return rows.length > 0 ? rows[0] : null;
};

exports.getGlobalPokemon = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const getStat = (n) => { const s = response.data.stats.find(s => s.stat.name === n); return s ? s.base_stat : 0; };
        const stats = { hp: getStat('hp'), attack: getStat('attack'), defense: getStat('defense'), sp_attack: getStat('special-attack'), sp_defense: getStat('special-defense'), speed: getStat('speed') };
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        const sprites = response.data.sprites;
        const official = sprites.other['official-artwork'];

        res.json({
            source: "Official PokeAPI (Global)",
            id: response.data.id,
            name: response.data.name,
            types: response.data.types.map(t => t.type.name),
            sprite: official.front_default || sprites.front_default,
            sprite_shiny: official.front_shiny || sprites.front_shiny,
            stats: stats,
            total_stats: total
        });
    } catch (error) { res.status(404).json({ error: "Pokemon tidak ditemukan." }); }
};

exports.createCustomPokemon = async (req, res) => {
    const { name, type, sprite, hp, attack, defense, sp_attack, sp_defense, speed } = req.body;
    const apiKey = req.headers['x-api-key'];
    if (!name || !type) return res.status(400).json({ error: "Nama & Tipe wajib diisi" });

    try {
        const [result] = await db.query(
            'INSERT INTO custom_pokemons (name, type, sprite, hp, attack, defense, sp_attack, sp_defense, speed, created_by_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, type, sprite||null, hp||50, attack||50, defense||50, sp_attack||50, sp_defense||50, speed||50, apiKey]
        );
        res.json({ status: "success", message: "Data tersimpan!", id: result.insertId });
    } catch (error) { res.status(500).json(error); }
};

exports.getCustomPokemon = async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const user = await checkUserRole(apiKey);
    if (!user) return res.status(401).json({ error: "Invalid API Key" });

    try {
        let query = 'SELECT * FROM custom_pokemons ORDER BY id DESC';
        let params = [];
        if (user.role !== 'admin') {
            query = 'SELECT * FROM custom_pokemons WHERE created_by_key = ? ORDER BY id DESC';
            params = [apiKey];
        }
        const [rows] = await db.query(query, params);
        
        const formattedData = rows.map(row => {
            const stats = { hp: row.hp, attack: row.attack, defense: row.defense, sp_attack: row.sp_attack, sp_defense: row.sp_defense, speed: row.speed };
            return {
                id: row.id,
                name: row.name,
                type: row.type, 
                sprite: row.sprite || 'https://cdn-icons-png.flaticon.com/512/5726/5726678.png',
                source: user.role === 'admin' ? `Local DB (By: ${row.created_by_key.substring(0,5)}...)` : "Local Database (Private)",
                stats: stats,
                total_stats: Object.values(stats).reduce((a, b) => a + b, 0),
                is_mine: row.created_by_key === apiKey,
                can_delete: (user.role === 'admin' || row.created_by_key === apiKey)
            };
        });
        res.json({ user_role: user.role, total: rows.length, data: formattedData });
    } catch (error) { res.status(500).json(error); }
};

exports.deleteCustomPokemon = async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const { id } = req.params;
    const user = await checkUserRole(apiKey);
    if (!user) return res.status(401).json({ error: "Invalid API Key" });

    try {
        let result;
        if (user.role === 'admin') {
            [result] = await db.query('DELETE FROM custom_pokemons WHERE id = ?', [id]);
        } else {
            [result] = await db.query('DELETE FROM custom_pokemons WHERE id = ? AND created_by_key = ?', [id, apiKey]);
        }
        if (result.affectedRows === 0) return res.status(403).json({ error: "Gagal hapus." });
        res.json({ status: "success", message: "Terhapus." });
    } catch (error) { res.status(500).json(error); }
};

exports.updateCustomPokemon = async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const { id } = req.params;
    const { name, type, sprite, hp, attack, defense, sp_attack, sp_defense, speed } = req.body;
    
    const user = await checkUserRole(apiKey);
    if (!user) return res.status(401).json({ error: "Invalid API Key" });

    try {
        const updateQuery = `UPDATE custom_pokemons SET name=?, type=?, sprite=?, hp=?, attack=?, defense=?, sp_attack=?, sp_defense=?, speed=? WHERE id=?`;
        const updateData = [name, type, sprite||null, hp||50, attack||50, defense||50, sp_attack||50, sp_defense||50, speed||50, id];
        
        let result;
        if (user.role === 'admin') {
            [result] = await db.query(updateQuery, updateData);
        } else {
            [result] = await db.query(updateQuery + ' AND created_by_key = ?', [...updateData, apiKey]);
        }

        if (result.affectedRows === 0) return res.status(403).json({ error: "Gagal update." });
        res.json({ status: "success", message: "Updated!" });
    } catch (error) { res.status(500).json(error); }
};