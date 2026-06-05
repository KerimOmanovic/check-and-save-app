export interface UserProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  isPublicUser: boolean;

}

export interface EmailAvailabilityDto {
  isAvailable: boolean;
}

export interface UpdateProfileCommand {
  firstName: string;
  lastName: string;
  email: string;

}

export interface UpdateProfileCommandDto {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  isManager: boolean;
  isPublicUser: boolean;
  isEnabled: boolean;
}
