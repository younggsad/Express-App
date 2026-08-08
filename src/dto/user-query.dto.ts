export interface UserQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "name" | "email";
  order?: "asc" | "desc";
}
