export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
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
/**
 * Auth bundle returned after successful profile update.
 * Backend rotates JWT/refresh token so new claims (e.g. email) are applied immediately.
 */
export interface UpdateProfileCommandDto {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc?: string;
  refreshTokenExpiresAtUtc?: string;
  expiresAtUtc?: string;
}
