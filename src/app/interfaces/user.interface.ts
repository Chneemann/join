export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  initials: string;
  color: string;
  isOnline: boolean;
  isContactOnly: boolean;
  lastLogin: number | null;
}

export interface UserSummary {
  id?: string;
  firstName: string;
  lastName: string;
  initials: string;
  color: string;
}
