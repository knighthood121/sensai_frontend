export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddressResponse {
  success: boolean;
  message?: string;
  data: Address[];
}

export interface SingleAddressResponse {
  success: boolean;
  message?: string;
  data: Address;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}
