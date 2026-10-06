const db = require('../DataBase/Database');
const Product_offer_model = require('./Product_offer_model');

class Offer_model {
    async Add_offer({ offer_name, title, punchline, thumbnail, discount_type, discount_value, valid_from, valid_until }) {
        const [result] = await db.execute(
            `INSERT INTO offers (offer_name, title, punchline, thumbnail, discount_type, discount_value, valid_from, valid_until) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [offer_name, title, punchline, thumbnail || null, discount_type, discount_value, valid_from, valid_until]
        );
        return { id: result.insertId, offer_name, title, punchline, thumbnail: thumbnail || null, discount_type, discount_value, valid_from, valid_until };
    }

    async Get_all_offers() {
        const [rows] = await db.execute(`SELECT * FROM offers ORDER BY created_at DESC`);
        return rows;
    }

    async Get_offer_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM offers WHERE id = ?`, [id]);
        return rows[0];
    }

    async Update_offer(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE offers SET ${setClause} WHERE id = ?`,
            values
        );
        return result;
    }

    async Delete_offer(id) {
        const [result] = await db.execute(`DELETE FROM offers WHERE id = ?`, [id]);
        return result;
    }

    async Get_offers_with_products() {
        const [offers] = await db.execute(`SELECT * FROM offers ORDER BY created_at DESC`);
        const productOfferModel = new Product_offer_model();
        const results = [];
        for (const offer of offers) {
            const products = await productOfferModel.Get_products_by_offer(offer.id);
            results.push({ ...offer, products });
        }
        return results;
    }
}

module.exports = Offer_model;
