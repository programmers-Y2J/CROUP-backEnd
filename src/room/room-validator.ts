import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateCreateRoom = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    playListUrl: Joi.string().uri().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateJoinRoom = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    roomId: Joi.string().required(),
  });

  const { error } = schema.validate(req.params);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};