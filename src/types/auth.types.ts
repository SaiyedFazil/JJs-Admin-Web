export interface AdminLoginPayload {
  phone_number: string;
  password: string;
}

export interface AdminLoginResponse {
  message: string;
  status: boolean;
  data: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    countryCode: string;
    phoneNumber: string;
    role: string;
    status: string;
    accessToken: string;
    refreshToken: string;
  };
}
