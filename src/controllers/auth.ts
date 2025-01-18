import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errorhandler';
import { AuthRequest } from '../utils/types';

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await AuthService.createUser(email, password);
      const authResponse = await AuthService.validateUser(email, password);

      res.cookie('token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      logger.info(`User signed up successfully: ${email}`);
      res.status(201).json({
        message: 'User created successfully',
        user: { id: user.id, email: user.email },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        logger.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const authResponse = await AuthService.validateUser(email, password);

      res.cookie('token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      logger.info(`User logged in successfully: ${email}`);
      res.json({
        message: 'Login successful',
        user: authResponse.user,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'Unauthorized');
      }

      const user = await AuthService.getUserById(req.user.id);
      
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        logger.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}