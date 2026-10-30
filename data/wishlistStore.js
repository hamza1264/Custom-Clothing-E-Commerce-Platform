export const WISHLIST_STORAGE_KEY = 'maintainiq-wishlist';
const WISHLIST_UPDATED_EVENT = 'maintainiq-wishlist-updated';

export function getWishlistSnapshot() {
  return localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]';
}

export function getServerWishlistSnapshot() {
  return '[]';
}

export function subscribeToWishlist(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener(WISHLIST_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(WISHLIST_UPDATED_EVENT, callback);
  };
}

export function saveWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}
