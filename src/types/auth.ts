export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  role: UserRole;
  name: string;
  governorate: string;
  school: string;
  loggedInAt: string;
}

export const OMAN_GOVERNORATES = [
  'محافظة مسقط',
  'محافظة ظفار',
  'محافظة مسندم',
  'محافظة البريمي',
  'محافظة الداخلية',
  'محافظة شمال الباطنة',
  'محافظة جنوب الباطنة',
  'محافظة جنوب الشرقية',
  'محافظة شمال الشرقية',
  'محافظة الظاهرة',
  'محافظة الوسطى',
];
