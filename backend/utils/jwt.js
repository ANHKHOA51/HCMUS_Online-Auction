import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
  // If payload has id and role, it might be a user object or a custom payload.
  // We want to support both: passing a user object (which gets destructured to id/role)
  // or passing a custom object which is used as is (merged).

  const tokenPayload = {
    id: payload.id,
    role: payload.role,
    ...payload
  };

  return jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET)
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
};
