import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '@shared/errors/AppError';

import { UsersRepository } from '../../../../modules/accounts/infra/typeorm/repositories/UsersRepository';

interface IPaylod {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('token missing!', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(
      token,
      '0f392cb1e7ae8e4c751daf48ba1a5c02'
    ) as IPaylod;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists!', 401);
    }

    request.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError('Invalid token!', 401);
  }
}
