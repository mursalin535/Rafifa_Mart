const db = require('../DataBase/Database');

class Address_model {
    async Add_address({ customer_id, label, recipient_name, phone, address_line1, address_line2, city, district, division, postal_code, country, is_default }) {
        if (is_default) {
            await db.execute(
                `UPDATE addresses SET is_default = FALSE WHERE customer_id = ?`,
                [customer_id]
            );
        }

        const [result] = await db.execute(
            `INSERT INTO addresses (customer_id, label, recipient_name, phone, address_line1, address_line2, city, district, division, postal_code, country, is_default)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customer_id,
                label || 'Home',
                recipient_name || null,
                phone || null,
                address_line1,
                address_line2 || null,
                city,
                district || null,
                division || null,
                postal_code || null,
                country || 'Bangladesh',
                is_default || false
            ]
        );
        return this.Get_address_by_id(result.insertId);
    }

    async Get_address_by_id(id) {
        const [rows] = await db.execute(`SELECT * FROM addresses WHERE id = ?`, [id]);
        return rows[0];
    }

    async Get_addresses_by_customer(customer_id) {
        const [rows] = await db.execute(
            `SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC`,
            [customer_id]
        );
        return rows;
    }

    async Get_default_address(customer_id) {
        const [rows] = await db.execute(
            `SELECT * FROM addresses WHERE customer_id = ? AND is_default = TRUE LIMIT 1`,
            [customer_id]
        );
        return rows[0];
    }

    async Update_address(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return { affectedRows: 0 };

        if (fields.is_default === true) {
            const address = await this.Get_address_by_id(id);
            if (address) {
                await db.execute(
                    `UPDATE addresses SET is_default = FALSE WHERE customer_id = ? AND id != ?`,
                    [address.customer_id, id]
                );
            }
        }

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => fields[key]);
        values.push(id);

        const [result] = await db.execute(
            `UPDATE addresses SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );
        return result;
    }

    async Set_default(customer_id, address_id) {
        await db.execute(
            `UPDATE addresses SET is_default = FALSE WHERE customer_id = ?`,
            [customer_id]
        );
        const [result] = await db.execute(
            `UPDATE addresses SET is_default = TRUE WHERE id = ? AND customer_id = ?`,
            [address_id, customer_id]
        );
        return result;
    }

    async Delete_address(id) {
        const [result] = await db.execute(`DELETE FROM addresses WHERE id = ?`, [id]);
        return result;
    }

    async Delete_all_addresses(customer_id) {
        const [result] = await db.execute(
            `DELETE FROM addresses WHERE customer_id = ?`,
            [customer_id]
        );
        return result;
    }
}

module.exports = Address_model;
