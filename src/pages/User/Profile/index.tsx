import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/common/Toast';
import { useAppSelector } from '../../../app/hooks';
import { useGetMeQuery } from '../../../service/authApi';
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from '../../../service/addressApi';
import type { Address } from '../../../types/Address.type';
import ProfileScreen from './ProfileScreen';

export default function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Queries
  const { data: userData, isLoading: isUserLoading, refetch: refetchUser } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const { data: addressData, isLoading: isAddressLoading } = useGetAddressesQuery(undefined, { skip: !isAuthenticated });

  // Mutations
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  // Component States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  // Address Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [isDefault, setIsDefault] = useState(false);

  const user = userData?.data;
  const addresses = addressData?.data || [];

  const openAddModal = () => {
    setEditingAddress(null);
    setFullName('');
    setPhone('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    setIsDefault(addresses.length === 0); // Default if first address
    setShowAddressModal(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFullName(address.fullName);
    setPhone(address.phone);
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2 || '');
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country || 'India');
    setIsDefault(address.isDefault);
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const payload = {
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || null,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, body: payload }).unwrap();
        showToast('Address updated successfully.', 'success');
      } else {
        await createAddress(payload).unwrap();
        showToast('Address created successfully.', 'success');
      }
      setShowAddressModal(false);
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to save address.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAddressId) return;

    try {
      await deleteAddress(deletingAddressId).unwrap();
      showToast('Address deleted successfully.', 'success');
      setDeletingAddressId(null);
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to delete address.', 'error');
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await updateAddress({ id, body: { isDefault: true } }).unwrap();
      showToast('Default address updated successfully.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err?.data?.message || 'Failed to set default address.', 'error');
    }
  };

  return (
    <ProfileScreen
      isAuthenticated={isAuthenticated}
      isUserLoading={isUserLoading}
      refetchUser={refetchUser}
      isAddressLoading={isAddressLoading}
      isCreating={isCreating}
      isUpdating={isUpdating}
      isDeleting={isDeleting}
      showAddressModal={showAddressModal}
      setShowAddressModal={setShowAddressModal}
      editingAddress={editingAddress}
      deletingAddressId={deletingAddressId}
      setDeletingAddressId={setDeletingAddressId}
      fullName={fullName}
      setFullName={setFullName}
      phone={phone}
      setPhone={setPhone}
      addressLine1={addressLine1}
      setAddressLine1={setAddressLine1}
      addressLine2={addressLine2}
      setAddressLine2={setAddressLine2}
      city={city}
      setCity={setCity}
      state={state}
      setState={setState}
      postalCode={postalCode}
      setPostalCode={setPostalCode}
      country={country}
      setCountry={setCountry}
      isDefault={isDefault}
      setIsDefault={setIsDefault}
      user={user}
      addresses={addresses}
      openAddModal={openAddModal}
      openEditModal={openEditModal}
      handleAddressSubmit={handleAddressSubmit}
      handleDeleteConfirm={handleDeleteConfirm}
      handleSetDefaultAddress={handleSetDefaultAddress}
      navigate={navigate}
    />
  );
}
