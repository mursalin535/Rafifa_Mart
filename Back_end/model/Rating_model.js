const db = require('../DataBase/Database');

class Rating_model {
    async Add_rating({ product_id, customer_id, rating, comment }) {
        const [existing] = await db.execute(
            `SELECT id FROM ratings WHERE product_id = ? AND customer_id = ?`,
            [product_id, customer_id]
        );

        if (existing.length > 0) {
            const [result] = await db.execute(
                `UPDATE ratings SET rating = ?, comment = ? WHERE product_id = ? AND customer_id = ?`,
                [rating, comment, product_id, customer_id]
            );
            return { id: existing[0].id, product_id, customer_id, rating, comment, updated: true };
        }

        const [result] = await db.execute(
            `INSERT INTO ratings (product_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)`,
            [product_id, customer_id, rating, comment]
        );
        return { id: result.insertId, product_id, customer_id, rating, comment, updated: false };
    }

    async Get_ratings_by_product(product_id) {
        const [rows] = await db.execute(
            `SELECT r.*, c.name AS customer_name 
             FROM ratings r 
             JOIN customers c ON r.customer_id = c.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [product_id]
        );
        return rows;
    }

    async Get_rating_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM ratings WHERE id = ?`, [id]);
        return rows[0];
    }

    async Get_avg_rating(product_id) {
        const [rows] = await db.execute(
            `SELECT AVG(rating) AS avg_rating, COUNT(*) AS total_reviews 
             FROM ratings WHERE product_id = ?`,
            [product_id]
        );
        return rows[0];
    }

    async Get_all_ratings() {
        const [rows] = await db.execute(
            `SELECT r.*, c.name AS customer_name, p.name AS product_name 
             FROM ratings r 
             JOIN customers c ON r.customer_id = c.id 
             JOIN products p ON r.product_id = p.id 
             ORDER BY r.created_at DESC`
        );
        return rows;
    }

    async Delete_rating(id) {
        const [result] = await db.execute(`DELETE FROM ratings WHERE id = ?`, [id]);
        return result;
    }
}

module.exports = Rating_model;
