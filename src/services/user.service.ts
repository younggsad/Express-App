import { PaginatedResponse } from "../dto/pagination.dto.js";
import { UserQueryDto } from "../dto/user-query.dto.js";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto.js";
import { AppError } from "../errors/app.error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

export class UserService {
  async getAll(query: UserQueryDto): Promise<PaginatedResponse<User>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = "name",
      order = "asc",
    } = query;

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          [sort]: order,
        },
      }),

      prisma.user.count({
        where,
      }),
    ]);

    return {
      data: users,

      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404, ErrorCodes.USER_NOT_FOUND);
    }

    return user;
  }

  async create(data: CreateUserDto) {
    return prisma.user.create({
      data,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
