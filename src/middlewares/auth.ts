import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../utils/types';


const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((cookies: Record<string, string>, cookie) => {
    const [key, value] = cookie.split('=').map(part => part.trim());
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {});
};

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Parse cookies manually
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.token; // Access the 'token' cookie

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as {
      id: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};