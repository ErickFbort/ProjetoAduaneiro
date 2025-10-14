export interface UserProfile {
  id: string;
  name: string;
  email: string;
  jobTitle?: string;
  avatar?: string;
  lastLogin?: string;
  department?: string;
  role?: string;
}

export interface UserProfileUpdate {
  jobTitle?: string;
  avatar?: string;
  department?: string;
}

export interface AvatarUpload {
  file: File;
  preview: string;
  isValid: boolean;
  error?: string;
}
