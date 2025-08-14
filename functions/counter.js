
const { Pool } = require('pg');

exports.handler = async (event) => {
    console.log('Function invoked:', event.httpMethod);
    console.log('NEON_DATABASE_URL:', process.env.NEON_DATABASE_URL ? 'Set' : 'Missing');

    if (!process.env.NEON_DATABASE_URL) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Server error', details: 'NEON_DATABASE_URL is not set' })
        };
    }

    try {
        const pool = new Pool({
            connectionString: process.env.NEON_DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Changed to false to avoid SSL issues
        });

        const client = await pool.connect();
        console.log('Connected to Neon database');

        if (event.httpMethod === 'GET') {
            const result = await client.query('SELECT count FROM visitor_counter WHERE id = 1');
            console.log('GET query result:', result.rows);
            if (result.rows.length === 0) {
                await client.release();
                return {
                    statusCode: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'No counter found for id = 1' })
                };
            }
            const count = result.rows[0].count;
            await client.release();
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count })
            };
        } else if (event.httpMethod === 'POST') {
            console.log('Executing POST query');
            const updateResult = await client.query('UPDATE visitor_counter SET count = count + 1 WHERE id = 1 RETURNING count');
            console.log('POST update result:', updateResult.rows);
            if (updateResult.rows.length === 0) {
                await client.release();
                return {
                    statusCode: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'No counter found for id = 1 after update' })
                };
            }
            const count = updateResult.rows[0].count;
            await client.release();
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count })
            };
        } else {
            await client.release();
            return {
                statusCode: 405,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }
    } catch (err) {
        console.error('Function error:', err.message, err.stack);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Server error', details: err.message })
        };
    }
};

// NEON_DATABASE_URL = 'postgresql://neondb_owner:npg_fCe7DjqMR4hV@ep-shiny-glitter-aejdsrrm-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';