import { jwtDecode, JwtPayload } from 'jwt-decode';

interface DecodedUserToken extends JwtPayload {
  userId: string;
  role: string;
}

interface DecodedUserTokenResult {
  userId: string | null;
  role: string | null;
}

export const decodeUserToken = (token: string): DecodedUserTokenResult => {
  try {
    const decoded: DecodedUserToken = jwtDecode<DecodedUserToken>(token);
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return { userId: null, role: null };
  }
};