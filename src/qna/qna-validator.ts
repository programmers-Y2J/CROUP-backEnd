import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateCreateQuestion = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

export const validateCreateComment = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    content: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};