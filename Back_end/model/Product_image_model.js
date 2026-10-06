const db = require('../DataBase/Database');

class Product_image_model {
    async Add_image({ product_id, image_url, is_primary }) {
        if (is_primary) {
            await db.execute(
                `UPDATE product_images SET is_primary = FALSE WHERE product_id = ?`,
                [product_id]
            );
        }
        const [result] = await db.execute(
            `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)`,
            [product_id, image_url, is_primary || false]
        );
        return { id: result.insertId, product_id, image_url, is_primary: is_primary || false };
    }

    async Get_images_by_product(product_id) {
        const [rows] = await db.execute(
            `SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC`,
            [product_id]
        );
        return rows;
    }

    async Get_image_by_id(id) {
        const [rows] = await db.execute(
            `SELECT * FROM product_images WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    async Set_primary(id, product_id) {
        await db.execute(
            `UPDATE product_images SET is_primary = FALSE WHERE product_id = ?`,
            [product_id]
        );
        const [result] = await db.execute(
            `UPDATE product_images SET is_primary = TRUE WHERE id = ? AND product_id = ?`,
            [id, product_id]
        );
        return result;
    }

    async Get_all_product_images() {
        const [rows] = await db.execute(
            `SELECT pi.*, p.name AS product_name 
             FROM product_images pi 
             JOIN products p ON pi.product_id = p.id 
             ORDER BY p.name ASC, pi.is_primary DESC`
        );
        return rows;
    }

    async Delete_image(id) {
        const [result] = await db.execute(
            `DELETE FROM product_images WHERE id = ?`,
            [id]
        );
        return result;
    }
}

module.exports = Product_image_model;
