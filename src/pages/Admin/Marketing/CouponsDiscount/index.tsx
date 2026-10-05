import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../../components/common/Toast';
import {
  useListCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from '../../../../service/couponApi';
import type { Coupon } from '../../../../types/Coupon.type';
import CouponsDiscountScreen from './CouponsDiscountScreen';

export interface CouponsDiscountScreenProps {
  coupons: Coupon[];
  isLoading: boolean;
  error: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingCoupon: Coupon | null;
  formError: string;
  code: string;
  setCode: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  couponType: 'PERCENTAGE' | 'FIXED';
  setCouponType: (val: 'PERCENTAGE' | 'FIXED') => void;
  discountValue: number;
  setDiscountValue: (val: number) => void;
  maxDiscount: string;
  setMaxDiscount: (val: string) => void;
  minOrderAmount: string;
  setMinOrderAmount: (val: string) => void;
  maxUsagePerUser: string;
  setMaxUsagePerUser: (val: string) => void;
  maxTotalUsage: string;
  setMaxTotalUsage: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  handleOpenCreate: () => void;
  handleOpenEdit: (coupon: Coupon) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleToggleStatus: (coupon: Coupon) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  onBack: () => void;
}

export default function CouponsDiscount() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // API Queries & Mutations
  const { data: couponsResponse, isLoading, error } = useListCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  // Modal & form states
  const [isOpen, setIsOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formError, setFormError] = useState('');

  // Form Fields (aligned with backend Joi schema)
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<string>('');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('');
  const [maxUsagePerUser, setMaxUsagePerUser] = useState<string>('1');
  const [maxTotalUsage, setMaxTotalUsage] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setCouponType('PERCENTAGE');
    setDiscountValue(0);
    setMaxDiscount('');
    setMinOrderAmount('');
    setMaxUsagePerUser('1');
    setMaxTotalUsage('');
    setExpiresAt('');
    setIsActive(true);
    setFormError('');
    setIsOpen(true);
  };

  const handleOpenEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDescription(coupon.description ?? '');
    setCouponType(coupon.couponType);
    setDiscountValue(coupon.discountValue);
    setMinOrderAmount(coupon.minOrderAmount?.toString() ?? '');
    setMaxDiscount(coupon.maxDiscount?.toString() ?? '');
    setMaxUsagePerUser(coupon.maxUsagePerUser?.toString() ?? '1');
    setMaxTotalUsage(coupon.maxTotalUsage?.toString() ?? '');
    setExpiresAt(coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '');
    setIsActive(coupon.isActive);
    setFormError('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }
    if (discountValue <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }
    if (!expiresAt) {
      setFormError('Expiration date is required.');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      description: description.trim() || null,
      couponType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      maxUsagePerUser: maxUsagePerUser ? Number(maxUsagePerUser) : 1,
      maxTotalUsage: maxTotalUsage ? Number(maxTotalUsage) : null,
      expiresAt: new Date(expiresAt).toISOString(),
      isActive,
    };

    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, data: payload }).unwrap();
        showToast('Coupon updated successfully!', 'success');
      } else {
        await createCoupon(payload).unwrap();
        showToast('Coupon created successfully!', 'success');
      }
      setIsOpen(false);
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Failed to save coupon. Please try again.';
      setFormError(errMsg);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await updateCoupon({
        id: coupon.id,
        data: { isActive: !coupon.isActive }
      }).unwrap();
      showToast(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (err: any) {
      showToast('Failed to toggle coupon status.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id).unwrap();
        showToast('Coupon deleted successfully!', 'success');
      } catch (err: any) {
        showToast('Failed to delete coupon.', 'error');
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/marketing');
  };

  const coupons = couponsResponse?.data || [];

  return (
    <CouponsDiscountScreen
      coupons={coupons}
      isLoading={isLoading}
      error={error}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      editingCoupon={editingCoupon}
      formError={formError}
      code={code}
      setCode={setCode}
      description={description}
      setDescription={setDescription}
      couponType={couponType}
      setCouponType={setCouponType}
      discountValue={discountValue}
      setDiscountValue={setDiscountValue}
      maxDiscount={maxDiscount}
      setMaxDiscount={setMaxDiscount}
      minOrderAmount={minOrderAmount}
      setMinOrderAmount={setMinOrderAmount}
      maxUsagePerUser={maxUsagePerUser}
      setMaxUsagePerUser={setMaxUsagePerUser}
      maxTotalUsage={maxTotalUsage}
      setMaxTotalUsage={setMaxTotalUsage}
      expiresAt={expiresAt}
      setExpiresAt={setExpiresAt}
      isActive={isActive}
      setIsActive={setIsActive}
      handleOpenCreate={handleOpenCreate}
      handleOpenEdit={handleOpenEdit}
      handleSubmit={handleSubmit}
      handleToggleStatus={handleToggleStatus}
      handleDelete={handleDelete}
      isCreating={isCreating}
      isUpdating={isUpdating}
      onBack={handleBack}
    />
  );
}