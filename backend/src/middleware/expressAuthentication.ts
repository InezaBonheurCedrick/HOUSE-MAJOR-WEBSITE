import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function expressAuthenticationRecasted(
  request: Request,
  securityName: string,
  scopes?: string[],
  response?: Response
): Promise<any> {
  if (securityName === 'jwt') {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      const err = new Error('No authorization header');
      (err as any).status = 401;
      throw err;
    }
 
    const [scheme, token] = authHeader.split(' ');

    if (!scheme || scheme.toLowerCase() !== 'bearer') {
      const err = new Error('Invalid authorization format. Expected: Bearer <token>');
      (err as any).status = 401;
      throw err;
    }

    if (!token) {
      const err = new Error('No token provided');
      (err as any).status = 401;
      throw err;
    }

    try {
      const secret = process.env.JWT_SECRET || 'secret123';
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (err) {
      const e = new Error('Invalid token');
      (e as any).status = 401;
      throw e;
    }
  }

  const e = new Error('Unsupported security method');
  (e as any).status = 401;
  throw e;
}
