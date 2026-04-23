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
