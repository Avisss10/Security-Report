import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: err.message || 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// Untuk cek role
export const checkRole = (allowedRoles) => (req, res, next) => {
  // allowedRoles: array of id_level, misal [1] untuk admin, [2] untuk security
  if (!req.user || !allowedRoles.includes(req.user.id_level)) {
    return res.status(403).json({ message: 'Akses ditolak: role tidak sesuai' });
  }
  next();
};