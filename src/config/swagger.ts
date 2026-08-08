import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Express App API",
      version: "1.0.0",
      description: "REST API for managing users",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],

    components: {
      schemas: {
        User: {
          type: "object",
          required: ["id", "name", "email"],
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Alex Johnson",
            },
            email: {
              type: "string",
              format: "email",
              example: "alex.johnson@example.com",
            },
          },
        },

        UserListResponse: {
          type: "object",
          required: ["data", "meta"],
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/User",
              },
            },
            meta: {
              type: "object",
              required: ["page", "limit", "total", "totalPages"],
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  example: 10,
                },
                total: {
                  type: "integer",
                  example: 25,
                },
                totalPages: {
                  type: "integer",
                  example: 3,
                },
              },
            },
          },
        },

        CreateUser: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              minLength: 2,
              example: "Alex Johnson",
            },
            email: {
              type: "string",
              format: "email",
              example: "alex.johnson@example.com",
            },
          },
        },

        UpdateUser: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 2,
              example: "Alex Updated",
            },
            email: {
              type: "string",
              format: "email",
              example: "alex.updated@example.com",
            },
          },
        },

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "User not found",
            },
            code: {
              type: "string",
              example: "USER_NOT_FOUND",
            },
          },
        },
      },
    },
  },

  apis: [
    process.env.NODE_ENV === "production"
      ? "./dist/routes/*.js"
      : "./src/routes/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
