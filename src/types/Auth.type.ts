// Generic API Envelope
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Auth Sub-models
export interface CustomerProfile {
    id: number;
    referralCode: string | null;
    totalOrders: number;
    totalSpent: number;
    walletBalance: number;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'CUSTOMER' | 'ADMIN' | string;
    provider: 'LOCAL' | 'GOOGLE' | string;
    googleId: string | null;
    profileImage: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    customerProfile: CustomerProfile | null;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
}

// Authentication Payloads & Responses
export interface RegisterRequest {
    name: string;
    email: string;
    password?: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface GoogleLoginRequest {
    token: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface LogoutRequest {
    refreshToken: string;
}

export interface AuthSuccessData {
    user: AuthUser;
    tokens: AuthTokens;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}

export interface ErrorResponse {
    success: false;
    message: string;
    details?: Record<string, unknown> | null;
    errors?: string[];
}


export type AuthSuccessResponse = ApiResponse<AuthSuccessData>;
export type MeResponse = ApiResponse<AuthUser>;
