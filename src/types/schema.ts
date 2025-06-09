// Enums
export enum FormFragment {
  PERSONAL_INFO = 'PERSONAL_INFO',
  ADDRESS = 'ADDRESS',
  ABOUT_ME = 'ABOUT_ME',
  PHARMACY = 'PHARMACY',
  INSURANCE_INFO = 'INSURANCE_INFO'
}

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  adminConfig?: AdminConfig;
  aboutMe?: AboutMe;
  personalInfo?: PersonalInfo;
  address?: Address;
  pharmacy?: Pharmacy;
  insuranceInfo?: InsuranceInfo;
}

// Admin Config types
export interface AdminConfig {
  id: string;
  userId: string;
  stepTwoTitle: string;
  stepThreeTitle: string;
  stepTwoFragments: FormFragment[];
  stepThreeFragments: FormFragment[];
  unusedFragments: FormFragment[];
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

// Form Fragment types
export interface AboutMe {
  id: string;
  userId: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface PersonalInfo {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Pharmacy {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface InsuranceInfo {
  id: string;
  userId: string;
  provider: string;
  policyNumber: string;
  groupNumber: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
} 