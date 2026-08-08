import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { UserQueryDto } from "../dto/user-query.dto.js";

const userService = new UserService();

export class UserController {
  getUsers = async (_req: Request, res: Response) => {
    const query = res.locals.validated as UserQueryDto;

    const users = await userService.getAll(query);

    return res.json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await userService.getById(Number(req.params.id));

    return res.json(user);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await userService.create(req.body);

    return res.status(201).json(user);
  };

  updateUser = async (req: Request, res: Response) => {
    const user = await userService.update(Number(req.params.id), req.body);

    return res.json(user);
  };

  deleteUser = async (req: Request, res: Response) => {
    await userService.delete(Number(req.params.id));

    return res.sendStatus(204);
  };
}
