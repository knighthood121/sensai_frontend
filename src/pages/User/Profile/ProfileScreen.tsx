import React from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS, FONTS } from '../../../constant/style';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Button from '../../../components/common/Button';
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  Shield,
  ChevronRight,
  User
} from 'lucide-react';
import type { Address } from '../../../types/Address.type';

export interface ProfileScreenProps {
  isAuthenticated: boolean;
  isUserLoading: boolean;
  refetchUser: () => void;
  isAddressLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  showAddressModal: boolean;
  setShowAddressModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingAddress: Address | null;
  deletingAddressId: number | null;
  setDeletingAddressId: React.Dispatch<React.SetStateAction<number | null>>;
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  addressLine1: string;
  setAddressLine1: React.Dispatch<React.SetStateAction<string>>;
  addressLine2: string;
  setAddressLine2: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  postalCode: string;
  setPostalCode: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  isDefault: boolean;
  setIsDefault: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  addresses: Address[];
  openAddModal: () => void;
  openEditModal: (address: Address) => void;
  handleAddressSubmit: (e: React.FormEvent) => Promise<void>;
  handleDeleteConfirm: () => Promise<void>;
  handleSetDefaultAddress: (id: number) => Promise<void>;
  navigate: NavigateFunction;
}

export default function ProfileScreen({
  isAuthenticated,
  isUserLoading,
  refetchUser,
  isAddressLoading,
  isCreating,
  isUpdating,
  isDeleting,
  showAddressModal,
  setShowAddressModal,
  editingAddress,
  deletingAddressId,
  setDeletingAddressId,
  fullName,
  setFullName,
  phone,
  setPhone,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  isDefault,
  setIsDefault,
  user,
  addresses,
  openAddModal,
  openEditModal,
  handleAddressSubmit,
  handleDeleteConfirm,
  handleSetDefaultAddress,
  navigate,
}: ProfileScreenProps) {

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <Shield className="w-16 h-16 text-pink-500 mx-auto mb-6" />
            <h3 className="text-2xl font-black mb-3 tracking-tight">Access Denied</h3>
            <p className="text-gray-500 text-sm mb-8">Please log in to view and manage your profile details.</p>
            <Button onClick={() => navigate('/login')} fullWidth className="rounded-full py-3.5 font-bold uppercase tracking-wider text-xs">Go to Login</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Loading profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAFC]" style={{ fontFamily: FONTS.main }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="text-xl font-bold mb-2">Error Loading Profile</h3>
            <p className="text-gray-500 text-sm mb-6">Failed to load user information.</p>
            <Button onClick={() => refetchUser()} fullWidth className="rounded-full">Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const userInitials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] relative overflow-hidden" style={{ fontFamily: FONTS.main, color: COLORS.text }}>
      {/* Decorative ambient background blobs */}
      <div className="absolute top-[-8%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-pink-200/8 to-purple-200/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/8 to-emerald-100/8 rounded-full blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-12 relative z-10">
        
        {/* Breadcrumb Navigation & Title */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-pink-500 transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600">My Profile</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: FONTS.heading }}>
            My <span style={{ color: COLORS.primary }}>Profile</span>
          </h1>
          <p className="text-gray-400 mt-3 font-medium text-sm sm:text-base max-w-xl">
            Manage your account details, delivery address book, and wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ─── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div className="space-y-8">
            
            {/* User Overview Profile Card */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border border-gray-100 flex flex-col items-center">
              {/* Profile Avatar */}
              <div 
                className="w-24 h-24 rounded-full text-white flex items-center justify-center text-3xl font-black mb-5 shadow-lg shadow-pink-100/60 relative group overflow-hidden border-4 border-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                {userInitials}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <User size={18} />
                </div>
              </div>

              {/* Name & Badge */}
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
              <span 
                className="mt-2.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                style={{ 
                  backgroundColor: COLORS.primaryLight + '15', 
                  color: COLORS.primaryDark, 
                  borderColor: COLORS.primaryLight + '40'
                }}
              >
                {user.role} Member
              </span>

              {/* Info Rows */}
              <div className="w-full mt-8 pt-6 border-t border-gray-100 space-y-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold">Email Address</p>
                    <p className="text-gray-900 truncate font-bold">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3.5 group">
                    <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold">Phone Number</p>
                      <p className="text-gray-900 font-bold">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3.5 group">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold">Member Since</p>
                    <p className="text-gray-900 font-bold">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Balance widget (Glassmorphism look) */}
            {user.customerProfile && (
              <div className="bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-[24px] p-8 text-white shadow-[0_12px_30px_rgba(79,70,229,0.2)] relative overflow-hidden group">
                {/* Accent glow vector */}
                <div className="absolute -right-10 -bottom-10 opacity-20 transform scale-110 group-hover:scale-125 transition-transform duration-700">
                  <CreditCard className="w-48 h-48" />
                </div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-200">Wallet Account</p>
                    <h3 className="text-4xl font-black mt-1.5 tracking-tight">
                      ₹{Number(user.customerProfile.walletBalance || 0).toFixed(2)}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-white/10 relative z-10">
                  <span className="text-indigo-150">Total Spent: ₹{Number(user.customerProfile.totalSpent || 0).toFixed(2)}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[8px] uppercase tracking-wider">Active Wallet</span>
                </div>
              </div>
            )}

          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Account Details & Security Cards */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Security & Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Email verification status card */}
                <div className="bg-[#FAFAFC] hover:bg-gray-50 rounded-2xl p-5 flex items-center justify-between transition-colors border border-gray-100/50">
                  <div>
                    <span className="uppercase tracking-wider text-[9px] text-gray-400 font-extrabold block">Email Status</span>
                    <span className="font-bold text-gray-800 text-sm mt-1 block">{user.isEmailVerified ? 'Verified' : 'Pending Verification'}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    user.isEmailVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {user.isEmailVerified ? 'Active' : 'Unverified'}
                  </span>
                </div>

                {/* Login provider status card */}
                <div className="bg-[#FAFAFC] hover:bg-gray-50 rounded-2xl p-5 flex items-center justify-between transition-colors border border-gray-100/50">
                  <div>
                    <span className="uppercase tracking-wider text-[9px] text-gray-400 font-extrabold block">Login Provider</span>
                    <span className="font-bold text-gray-800 text-sm mt-1 block uppercase">{user.provider}</span>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Secured
                  </span>
                </div>
              </div>
            </div>

            {/* Address Book Area */}
            <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Saved Addresses</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage delivery locations and set defaults for orders.</p>
                </div>
                <button
                  onClick={openAddModal}
                  className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-100 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {isAddressLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                  <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-pink-500" />
                  </div>
                  <p className="font-bold text-sm text-gray-700 mb-1">No saved addresses</p>
                  <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto">Create shipping targets to accelerate checkout speed.</p>
                  <button 
                    onClick={openAddModal}
                    className="px-6 py-2 border border-pink-500 hover:bg-pink-50/50 hover:text-pink-600 rounded-full text-xs font-bold text-pink-500 transition-colors active:scale-95"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative rounded-[20px] p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 border bg-white ${
                        address.isDefault ? 'border-pink-500/30 ring-1 ring-pink-500/10' : 'border-gray-100'
                      }`}
                    >
                      <div className="text-left">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h4 className="font-bold text-sm text-gray-900 truncate pr-14 leading-snug">{address.fullName}</h4>
                          {address.isDefault ? (
                            <span 
                              className="px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border"
                              style={{ 
                                backgroundColor: COLORS.primaryLight + '20', 
                                color: COLORS.primaryDark, 
                                borderColor: COLORS.primaryLight + '50'
                              }}
                            >
                              Default
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border border-gray-200 hover:border-pink-250 text-gray-500 hover:text-pink-650 bg-white transition-all cursor-pointer active:scale-95 hover:bg-pink-50/10 shrink-0"
                            >
                              Set Default
                            </button>
                          )}
                        </div>
                        
                        <address className="text-xs text-gray-500 not-italic leading-relaxed space-y-0.5 font-semibold">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} - {address.postalCode}</p>
                          <p>{address.country}</p>
                          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 font-bold">
                            <Phone size={11} className="text-pink-400" />
                            <span>{address.phone}</span>
                          </div>
                        </address>
                      </div>

                      {/* Edit / Delete Options */}
                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                        <button
                          onClick={() => openEditModal(address)}
                          className="p-2 text-gray-400 hover:text-pink-600 rounded-xl hover:bg-pink-50/50 border border-transparent hover:border-pink-100 transition-all cursor-pointer active:scale-90"
                          title="Edit Address"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingAddressId(address.id)}
                          className="p-2 text-gray-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer active:scale-90"
                          title="Delete Address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ─── ADD/EDIT ADDRESS MODAL ─── */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isCreating && !isUpdating) setShowAddressModal(false);
              }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[24px] w-full max-w-lg p-8 shadow-2xl z-10 border border-gray-100 max-h-[90vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                disabled={isCreating || isUpdating}
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1" style={{ fontFamily: FONTS.heading }}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mb-6">
                Please enter the shipping details below.
              </p>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. Jane Doe"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                    disabled={isCreating || isUpdating}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +91 9876543210"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                    disabled={isCreating || isUpdating}
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <label htmlFor="addressLine1" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="addressLine1"
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="E.g. Flat No, Building Name, Street"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                    disabled={isCreating || isUpdating}
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label htmlFor="addressLine2" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    id="addressLine2"
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="E.g. Landmark, Locality"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                    disabled={isCreating || isUpdating}
                  />
                </div>

                {/* Grid for City, State, Pin */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="E.g. Mumbai"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                      disabled={isCreating || isUpdating}
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="E.g. Maharashtra"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                      disabled={isCreating || isUpdating}
                    />
                  </div>
                </div>

                {/* Grid for Postal Code, Country */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                      Postal Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="E.g. 400001"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                      disabled={isCreating || isUpdating}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="E.g. India"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all bg-white"
                      disabled={isCreating || isUpdating}
                    />
                  </div>
                </div>

                {/* Default address checkbox */}
                <div className="flex items-center gap-2.5 pt-2 select-none">
                  <input
                    id="isDefault"
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4.5 h-4.5 text-pink-650 focus:ring-pink-500 border-gray-200 rounded cursor-pointer accent-pink-500"
                    disabled={isCreating || isUpdating || (editingAddress?.isDefault && addresses.length > 1)}
                  />
                  <label htmlFor="isDefault" className="text-xs font-bold text-gray-500 cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
                    disabled={isCreating || isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-xs text-white shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: COLORS.primary }}
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Address'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CONFIRM DELETE DIALOG ─── */}
      <AnimatePresence>
        {deletingAddressId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (!isDeleting) setDeletingAddressId(null); }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[24px] w-full max-w-sm p-8 shadow-2xl z-10 border border-gray-100 text-center"
            >
              <h3 className="text-xl font-bold mb-2">Delete Address</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Are you sure you want to delete this address? This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDeletingAddressId(null)}
                  className="flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer active:scale-95"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 rounded-full font-bold uppercase tracking-wider text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
