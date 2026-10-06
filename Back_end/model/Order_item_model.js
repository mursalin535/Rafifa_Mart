const db = require('../DataBase/Database');

class Order_item_model {
    async Add_item({ order_id, variant_id, quantity, unit_price }) {
        const [result] = await db.execute(
            `INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
            [order_id, variant_id, quantity, unit_price]
        );
        return { id: result.insertId, order_id, variant_id, quantity, unit_price };
    }

    async Get_items_by_order(order_id) {
        const [rows] = await db.execute(
            `SELECT oi.*,
                    p.name AS item_name,
                    pv.volume_ml,
                    pv.price AS variant_price
             FROM order_items oi
             LEFT JOIN product_variants pv ON oi.variant_id = pv.id
             LEFT JOIN products p ON pv.product_id = p.id
             WHERE oi.order_id = ?`,
            [order_id]
        );
        return rows;
    }

    async Get_item_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM order_items WHERE id = ?`, [id]);
        return rows[0];
    }

    async Update_item(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE order_items SET ${setClause} WHERE id = ?`,
            values
        );
        return result;
    }

    async Delete_item(id) {
        const [result] = await db.execute(`DELETE FROM order_items WHERE id = ?`, [id]);
        return result;
    }

    async Delete_items_by_order(order_id) {
        const [result] = await db.execute(`DELETE FROM order_items WHERE order_id = ?`, [order_id]);
        return result;
    }
}

module.exports = Order_item_model;
