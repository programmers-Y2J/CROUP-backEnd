import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateCreateRoom = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    playListUrl: Joi.string().uri().required(),
    playList: Joi.array().items(
      Joi.object({
        musicTitle: Joi.string().required(),
        musicThumbnail: Joi.string().required(),
        musicChannelTitle: Joi.string().required(),
        videoId: Joi.string().required()
      })
    ).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};