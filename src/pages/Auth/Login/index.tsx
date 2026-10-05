import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import { useLoginMutation, useGoogleLoginMutation } from '../../../service/authApi';
import { useAddToCartMutation } from '../../../service/cartApi';
import { getGuestCart, clearGuestCart } from '../../../utils/guestCart';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [addToCart] = useAddToCartMutation();

  // Extract redirect warning message if passed
  const message = (location.state as { message?: string })?.message || '';

  /** After successful login, sync any guest cart items to the backend */
  const syncGuestCart = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;

    // Fire all addToCart requests; ignore individual failures silently
    await Promise.allSettled(
      guestItems.map((item) =>
        addToCart({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })
      )
    );

    clearGuestCart();
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleSubmit = async (email: string, pass: string) => {
    setError('');
    try {
      const result = await login({ email, password: pass }).unwrap();
      await syncGuestCart();
      const userRole = result.data.user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        // If the user was coming from /cart, send them back there
        const from = (location.state as any)?.from || '/';
        navigate(from);
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Invalid email or password. Please try again.';
      setError(errMsg);
    }
  };

  const handleGoogleSubmit = async (credential: string) => {
    setError('');
    try {
      const result = await googleLogin({ token: credential }).unwrap();
      await syncGuestCart();
      const userRole = result.data.user.role;
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        const from = (location.state as any)?.from || '/';
        navigate(from);
      }
    } catch (err: any) {
      const errMsg = err?.data?.message || 'Google Login failed. Please try again.';
      setError(errMsg);
    }
  };

  return (
    <LoginScreen
      onBackClick={handleBackClick}
      onSignupClick={handleSignupClick}
      onSubmit={handleSubmit}
      onGoogleSubmit={handleGoogleSubmit}
      error={error}
      message={message}
    />
  );
}
