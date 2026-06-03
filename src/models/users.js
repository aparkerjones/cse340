import bcrypt from "bcrypt";
import { query } from "../database/index.js";

export const createUser = async (name, email, passwordHash) => {
  const sql = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES (
      $1,
      $2,
      $3,
      (SELECT role_id FROM roles WHERE role_name = 'user')
    )
    RETURNING user_id, name, email;
  `;

  const result = await query(sql, [name, email, passwordHash]);
  return result.rows[0] ?? null;
};

const findUserByEmail = async (email) => {
  const sql = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.password_hash,
      r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1;
  `;

  const result = await query(sql, [email]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

export const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, user.password_hash);

  if (!passwordMatches) {
    return null;
  }

  const { password_hash: _passwordHash, ...safeUser } = user;
  return safeUser;
};