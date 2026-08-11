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

  getUserById = async (_req: Request, res: Response) => {
    const { id } = res.locals.validated.params;
    const user = await userService.getById(id);

    return res.json(user);
  };

  createUser = async (_req: Request, res: Response) => {
    const data = res.locals.validated.body;
    const user = await userService.create(data);

    return res.status(201).json(user);
  };

  updateUser = async (_req: Request, res: Response) => {
    const { id } = res.locals.validated.params;
    const data = res.locals.validated.body;
    const user = await userService.update(id, data);

    return res.json(user);
  };

  deleteUser = async (_req: Request, res: Response) => {
    const { id } = res.locals.validated.params;
    await userService.delete(id);

    return res.sendStatus(204);
  };
}
