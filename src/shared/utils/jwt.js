// const jwt = require('jsonwebtoken');

// exports.generateTokens = (userId) => {
//   const accessToken = jwt.sign(
//     { id: userId },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: '1d' } //15 minutes validity
//   );

//   const refreshToken = jwt.sign(
//     { id: userId },
//     process.env.JWT_REFRESH_SECRET,
//     { expiresIn: '7d' } //7 days validity
//   );

//   return { accessToken, refreshToken };
// };

// exports.verifyToken = (token, secret) => {
//   return jwt.verify(token, secret);
// };

const jwt = require("jsonwebtoken");

exports.generateTokens = (userId, vendorId = null) => {
  // ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      id: userId,

      vendorId,
    },

    process.env.JWT_ACCESS_SECRET,

    {
      expiresIn: "1d",
    },
  );

  // REFRESH TOKEN
  const refreshToken = jwt.sign(
    {
      id: userId,

      vendorId,
    },

    process.env.JWT_REFRESH_SECRET,

    {
      expiresIn: "7d",
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

exports.verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};
