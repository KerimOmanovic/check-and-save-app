export interface CurrentUserDto {
  userId: number;
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  isPublicUser: boolean;
  tokenVersion: number;
}
