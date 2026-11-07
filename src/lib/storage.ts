// Single source of truth for app data keys so auth and stores clear them together.
export const INVITATIONS_KEY = 'infomase_invitations_v3';
export const ACTIVE_ID_KEY = 'infomase_active_invitation_v3';
export const ORDERS_KEY = 'infomase_orders_v1';
export const LICENCES_KEY = 'infomase_licences_v1';

export const AUTH_CHANGE_EVENT = 'infomase:auth-change';

export function clearDataStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(INVITATIONS_KEY);
  localStorage.removeItem(ACTIVE_ID_KEY);
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(LICENCES_KEY);
}

export function dispatchAuthChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}