import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'security_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ Terkoneksi ke MySQL');
    connection.release();
  } catch (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  }
}

testConnection();

export default pool;