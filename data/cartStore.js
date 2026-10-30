export const CART_STORAGE_KEY = 'maintainiq-cart';
const CART_UPDATED_EVENT = 'maintainiq-cart-updated';

export function getCartSnapshot() {
  return localStorage.getItem(CART_STORAGE_KEY) || '[]';
}

export function getServerCartSnapshot() {
  return '[]';
}

export function subscribeToCart(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener(CART_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CART_UPDATED_EVENT, callback);
  };
}

export function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
