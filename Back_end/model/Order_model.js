const db = require('../DataBase/Database');

class Order_model {
    async Create_order({ customer_id, address_id, payment_method, total_amount, items }) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [orderResult] = await connection.execute(
                `INSERT INTO orders (customer_id, address_id, payment_method, total_amount) VALUES (?, ?, ?, ?)`,
                [customer_id, address_id, payment_method, total_amount]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    `INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
                    [orderId, item.variant_id, item.quantity, item.unit_price]
                );

                if (item.variant_id) {
                    const [stockResult] = await connection.execute(
                        `UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?`,
                        [item.quantity, item.variant_id, item.quantity]
                    );

                    if (stockResult.affectedRows === 0) {
                        throw new Error(`Stock unavailable for variant_id ${item.variant_id} at time of order`);
                    }
                }
            }

            await connection.commit();
            return { id: orderId, customer_id, address_id, payment_method, total_amount, status: 'pending' };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async Create_bottle_order({ customer_id, address_id, payment_method, total_amount, items }) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [orderResult] = await connection.execute(
                `INSERT INTO orders (customer_id, address_id, payment_method, total_amount) VALUES (?, ?, ?, ?)`,
                [customer_id, address_id, payment_method, total_amount]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                await connection.execute(
                    `INSERT INTO order_bottles (order_id, bottle_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
                    [orderId, item.bottle_id, item.quantity, item.unit_price]
                );

                const [stockResult] = await connection.execute(
                    `UPDATE bottles SET total_piece = total_piece - ? WHERE id = ? AND total_piece >= ?`,
                    [item.quantity, item.bottle_id, item.quantity]
                );

                if (stockResult.affectedRows === 0) {
                    throw new Error(`Stock unavailable for bottle_id ${item.bottle_id} at time of order`);
                }
            }

            await connection.commit();
            return { id: orderId, customer_id, address_id, payment_method, total_amount, status: 'pending' };
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async Get_all_orders() {
        const [rows] = await db.execute(
            `SELECT o.*, c.name AS customer_name, c.email AS customer_email
             FROM orders o
             JOIN customers c ON o.customer_id = c.id
             ORDER BY o.created_at DESC`
        );
        return rows;
    }

    async Get_orders_by_customer(customer_id) {
        const [rows] = await db.execute(
            `SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC`,
            [customer_id]
        );
        return rows;
    }

    async Get_order_by_id(id) {
        const [orders] = await db.execute(
            `SELECT o.*, 
                    c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone,
                    a.label AS address_label, a.recipient_name, a.phone AS delivery_phone,
                    a.address_line1, a.address_line2, a.city, a.district, a.division, a.postal_code
             FROM orders o
             JOIN customers c ON o.customer_id = c.id
             JOIN addresses a ON o.address_id = a.id
             WHERE o.id = ?`,
            [id]
        );

        if (orders.length === 0) return null;

        const [items] = await db.execute(
            `SELECT oi.*,
                    p.name AS item_name,
                    pv.volume_ml,
                    pv.price AS variant_price
             FROM order_items oi
             LEFT JOIN product_variants pv ON oi.variant_id = pv.id
             LEFT JOIN products p ON pv.product_id = p.id
             WHERE oi.order_id = ?`,
            [id]
        );

        const [bottles] = await db.execute(
            `SELECT ob.*,
                    b.name AS item_name,
                    b.volume,
                    b.price_per_piece AS bottle_price
             FROM order_bottles ob
             LEFT JOIN bottles b ON ob.bottle_id = b.id
             WHERE ob.order_id = ?`,
            [id]
        );

        return { ...orders[0], items, bottles };
    }

    async Update_order_status(id, status) {
        const [result] = await db.execute(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, id]
        );
        return result;
    }

    async Delete_order(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [perfumeItems] = await connection.execute(
                `SELECT variant_id, quantity FROM order_items WHERE order_id = ?`,
                [id]
            );

            for (const item of perfumeItems) {
                if (item.variant_id) {
                    await connection.execute(
                        `UPDATE product_variants SET stock = stock + ? WHERE id = ?`,
                        [item.quantity, item.variant_id]
                    );
                }
            }

            const [bottleItems] = await connection.execute(
                `SELECT bottle_id, quantity FROM order_bottles WHERE order_id = ?`,
                [id]
            );

            for (const item of bottleItems) {
                if (item.bottle_id) {
                    await connection.execute(
                        `UPDATE bottles SET total_piece = total_piece + ? WHERE id = ?`,
                        [item.quantity, item.bottle_id]
                    );
                }
            }

            await connection.execute(`DELETE FROM order_items WHERE order_id = ?`, [id]);
            await connection.execute(`DELETE FROM order_bottles WHERE order_id = ?`, [id]);
            const [result] = await connection.execute(`DELETE FROM orders WHERE id = ?`, [id]);

            await connection.commit();
            return result;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }
}

module.exports = Order_model;
