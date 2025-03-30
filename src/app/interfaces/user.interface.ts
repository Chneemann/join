export interface User {
  id?: string;
  uId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  initials: string;
  color: string;
  isOnline: boolean;
  isContactOnly: boolean;
  lastLogin: number;
}

export interface UserSummary {
  id?: string;
  firstName: string;
  lastName: string;
  initials: string;
  color: string;
}
