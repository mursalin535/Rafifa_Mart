const db = require('../DataBase/Database');

class Bottle_model {
    async Add_bottle({ name, photo_url, total_piece, volume, price_per_piece, description }) {
        const [result] = await db.execute(
            `INSERT INTO bottles (name, photo_url, total_piece, volume, price_per_piece, description) VALUES (?, ?, ?, ?, ?, ?)`,
            [name, photo_url, total_piece, volume, price_per_piece, description]
        );
        return result;
    }

    async GetAll_bottles() {
        const [rows] = await db.execute(`SELECT * FROM bottles ORDER BY created_at DESC`);
        return rows;
    }

    async Get_bottle_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM bottles WHERE id = ?`, [id]);
        return rows[0];
    }

    async Update_bottle(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE bottles SET ${setClause} WHERE id = ?`,
            values
        );
        return result;
    }

    async Delete_bottle(id) {
        const [result] = await db.execute(`DELETE FROM bottles WHERE id = ?`, [id]);
        return result;
    }
}

module.exports = Bottle_model;
