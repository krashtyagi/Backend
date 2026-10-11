import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
  vendorId?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (
  userId: string,
  vendorId: string | null = null,
): AuthTokens => {
  // ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      id: userId,
      vendorId,
    },
    process.env.JWT_ACCESS_SECRET as Secret,
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
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: "7d",
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyToken = (
  token: string,
  secret: Secret,
): string | JwtPayload => {
  return jwt.verify(token, secret);
};
