import { Request, Response, NextFunction, RequestHandler } from 'express';

export function validateBody(type: Zod.Schema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log(req.body);
      req.body = type.parse(req.body);
      next();
    } catch (error) {
      console.log("Erro validando body");
      res.status(400).json({ error });
    }
  };
}

export function validateQuery(type: Zod.Schema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = type.parse(req.query);
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}

export function validateParams(type: Zod.Schema): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = type.parse(req.params);
      next();
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
