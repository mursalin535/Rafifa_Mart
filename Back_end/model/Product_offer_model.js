const db = require('../DataBase/Database');

class Product_offer_model {
    async Assign_offer(product_id, offer_id) {
        const [existing] = await db.execute(
            `SELECT * FROM product_offers WHERE product_id = ? AND offer_id = ?`,
            [product_id, offer_id]
        );

        if (existing.length > 0) {
            return { already_assigned: true };
        }

        const [result] = await db.execute(
            `INSERT INTO product_offers (product_id, offer_id) VALUES (?, ?)`,
            [product_id, offer_id]
        );
        return { id: result.insertId, product_id, offer_id, already_assigned: false };
    }

    async Get_offers_by_product(product_id) {
        const [rows] = await db.execute(
            `SELECT o.* FROM offers o 
             JOIN product_offers po ON o.id = po.offer_id 
             WHERE po.product_id = ?`,
            [product_id]
        );
        return rows;
    }

    async Get_products_by_offer(offer_id) {
        const [rows] = await db.query(
            `SELECT p.id, p.name, p.description, p.created_at, p.perfume_type, p.perfume_for,
                MIN(pv.price) AS min_price,
                MAX(pv.price) AS max_price,
                IFNULL(SUM(pv.stock), 0) AS total_stock,
                (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id AND pi.is_primary = 1 LIMIT 1) AS image_url
             FROM products p
             JOIN product_offers po ON p.id = po.product_id
             LEFT JOIN product_variants pv ON p.id = pv.product_id
             WHERE po.offer_id = ?
             GROUP BY p.id, p.name, p.description, p.created_at, p.perfume_type, p.perfume_for`,
            [offer_id]
        );
        return rows;
    }

    async Remove_offer_from_product(product_id, offer_id) {
        const [result] = await db.execute(
            `DELETE FROM product_offers WHERE product_id = ? AND offer_id = ?`,
            [product_id, offer_id]
        );
        return result;
    }

    async Get_all_product_offers() {
        const [rows] = await db.execute(
            `SELECT po.*, o.offer_name, o.title, o.discount_type, o.discount_value, 
                    p.name AS product_name 
             FROM product_offers po 
             JOIN offers o ON po.offer_id = o.id 
             JOIN products p ON po.product_id = p.id 
             ORDER BY p.name ASC`
        );
        return rows;
    }

    async Remove_all_offers_from_product(product_id) {
        const [result] = await db.execute(
            `DELETE FROM product_offers WHERE product_id = ?`,
            [product_id]
        );
        return result;
    }
}

module.exports = Product_offer_model;
