export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  isPublicUser: boolean;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export interface EmailAvailabilityDto {
  isAvailable: boolean;
}

export interface UpdateProfileCommand {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
}

export interface UpdateProfileCommandDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc?: string;
  refreshTokenExpiresAtUtc?: string;
  expiresAtUtc?: string;
}
