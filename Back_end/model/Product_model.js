const db = require('../DataBase/Database');

class Product_model {
    async Add_product({ name, description, perfume_type, perfume_for }) {
        const [result] = await db.execute(
            `INSERT INTO products (name, description, perfume_type, perfume_for) VALUES (?, ?, ?, ?)`,
            [name, description, perfume_type || null, perfume_for || null]
        );
        return { id: result.insertId, name, description, perfume_type, perfume_for };
    }

    async GetAll_products() {
        const [rows] = await db.execute(
            `SELECT p.*,
                MIN(pv.price) AS min_price,
                MAX(pv.price) AS max_price,
                IFNULL(SUM(pv.stock), 0) AS total_stock,
                GROUP_CONCAT(DISTINCT pv.packaging_type ORDER BY pv.packaging_type SEPARATOR ', ') AS available_categories
             FROM products p
             LEFT JOIN product_variants pv ON p.id = pv.product_id
             GROUP BY p.id
             ORDER BY p.created_at DESC`
        );
        return rows;
    }

    async Get_product_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
        if (rows.length === 0) return null;

        const [variants] = await db.execute(
            `SELECT * FROM product_variants WHERE product_id = ? ORDER BY packaging_type ASC, volume_ml ASC`,
            [id]
        );

        return { ...rows[0], variants };
    }

    async Update_product(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE products SET ${setClause} WHERE id = ?`,
            values
        );
        return result;
    }

    async Delete_product(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(`DELETE FROM product_images WHERE product_id = ?`, [id]);
            await connection.execute(`DELETE FROM product_offers WHERE product_id = ?`, [id]);
            await connection.execute(`DELETE FROM ratings WHERE product_id = ?`, [id]);
            await connection.execute(`DELETE FROM product_variants WHERE product_id = ?`, [id]);
            const [result] = await connection.execute(`DELETE FROM products WHERE id = ?`, [id]);

            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async Add_variant({ product_id, packaging_type, volume_ml, price, stock }) {
        const [result] = await db.execute(
            `INSERT INTO product_variants (product_id, packaging_type, volume_ml, price, stock) VALUES (?, ?, ?, ?, ?)`,
            [product_id, packaging_type, volume_ml, price, stock || 0]
        );
        return { id: result.insertId, product_id, packaging_type, volume_ml, price, stock: stock || 0 };
    }

    async Get_variants_by_product(product_id) {
        const [rows] = await db.execute(
            `SELECT * FROM product_variants WHERE product_id = ? ORDER BY packaging_type ASC, volume_ml ASC`,
            [product_id]
        );
        return rows;
    }

    async Get_variant_by_id(variant_id) {
        const [rows] = await db.execute(
            `SELECT * FROM product_variants WHERE id = ?`,
            [variant_id]
        );
        return rows[0];
    }

    async Update_variant(variant_id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(variant_id);

        const [result] = await db.execute(
            `UPDATE product_variants SET ${setClause} WHERE id = ?`,
            values
        );
        return result;
    }

    async Get_all_variants() {
        const [rows] = await db.execute(
            `SELECT pv.*, p.name AS product_name
             FROM product_variants pv
             JOIN products p ON pv.product_id = p.id
             ORDER BY p.name ASC, pv.packaging_type ASC, pv.volume_ml ASC`
        );
        return rows;
    }

    async Delete_variant(variant_id) {
        const [result] = await db.execute(
            `DELETE FROM product_variants WHERE id = ?`,
            [variant_id]
        );
        return result;
    }
}

module.exports = Product_model;
