/**
 * Orders & licences — the purchase-per-template domain.
 *
 * Model
 * -----
 *   OrderEntity      : a checkout attempt. One order = one template × one event.
 *   TemplateLicence  : the entitlement that a *paid* order unlocks.
 *                      Bound to (templateId, invitationId) and never expires.
 *
 * Deliberately NOT modelled: subscription, renewal, expiry, publish lock.
 * A published invitation never stops working because a date passed. That was
 * the single most damaging inconsistency in the previous build.
 */

export type OrderStatus = 'pending' | 'payment_submitted' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  /** Template SKU being bought. */
  templateId: string;
  /** Invitation that will consume the licence (empty string when bought before creating an invitation). */
  invitationId: string;
  /** Human label captured at checkout time so receipts survive renames. */
  invitationTitle: string;
  amount: number;
  currency: 'IDR';
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  /** Which channel was used — mirrors the payment methods we advertise. */
  method?: 'qris' | 'bank-transfer' | 'ewallet';
  /** Fake-but-stable reference shown on the receipt. */
  reference: string;
}

export interface TemplateLicence {
  id: string;
  templateId: string;
  /** Empty string if purchased upfront and not yet bound to an invitation. */
  invitationId: string;
  invitationSlug?: string | null;
  invitationTitle?: string | null;
  orderId: string;
  /** Permanent. Present as a field only so the UI can phrase it explicitly. */
  kind: 'perpetual';
  issuedAt: string;
}

export interface EntitlementSummary {
  /** Invitations the user may still create before needing to buy again. */
  available: number;
  /** Invitations that don't have a licence for their template yet. */
  needsPurchase: number;
  /** Total value of licences held. */
  lifetimeValue: number;
}

import { ORDERS_KEY, LICENCES_KEY } from './storage';

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — the in-memory state still works for the session */
  }
}

export function loadOrders(): Order[] {
  return readJSON<Order[]>(ORDERS_KEY, []);
}

export function loadLicences(): TemplateLicence[] {
  return readJSON<TemplateLicence[]>(LICENCES_KEY, []);
}

export function saveOrders(orders: Order[]) {
  writeJSON(ORDERS_KEY, orders);
}

export function saveLicences(licences: TemplateLicence[]) {
  writeJSON(LICENCES_KEY, licences);
}

export function makeReference(seed = Date.now()): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  let n = seed;
  for (let i = 0; i < 8; i += 1) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + 7;
  }
  return `IM-${out.slice(0, 4)}-${out.slice(4)}`;
}

export interface CheckoutInput {
  templateId: string;
  amount: number;
  invitationId?: string;
  invitationTitle?: string;
  method: NonNullable<Order['method']>;
}

export interface CheckoutResult {
  order: Order;
  licence: TemplateLicence;
}

/**
 * Simulated checkout. Swapping this for a real gateway means replacing the
 * body of this function only — the rest of the app reads Orders/Licences.
 */
export function completeCheckout(input: CheckoutInput): CheckoutResult {
  const now = new Date();
  const order: Order = {
    id: `ord-${now.getTime()}`,
    templateId: input.templateId,
    invitationId: input.invitationId || '',
    invitationTitle: input.invitationTitle || 'Lisensi Template (Siap Digunakan)',
    amount: input.amount,
    currency: 'IDR',
    status: 'paid',
    createdAt: now.toISOString(),
    paidAt: now.toISOString(),
    method: input.method,
    reference: makeReference(now.getTime()),
  };

  const licence: TemplateLicence = {
    id: `lic-${now.getTime()}`,
    templateId: input.templateId,
    invitationId: input.invitationId || '',
    orderId: order.id,
    kind: 'perpetual',
    issuedAt: now.toISOString(),
  };

  return { order, licence };
}

export function hasLicence(
  licences: TemplateLicence[],
  invitationId: string,
  templateId: string
): boolean {
  return licences.some((l) => l.invitationId === invitationId && l.templateId === templateId);
}

export function licenceFor(
  licences: TemplateLicence[],
  invitationId: string
): TemplateLicence | undefined {
  return licences.find((l) => Boolean(invitationId) && l.invitationId === invitationId);
}

/** Returns all active licences that have not yet been bound to an invitation. */
export function unassignedLicences(licences: TemplateLicence[]): TemplateLicence[] {
  return licences.filter((l) => !l.invitationId);
}

/** Returns an unassigned active licence for a specific template, if the user has one. */
export function availableLicenceForTemplate(
  licences: TemplateLicence[],
  templateId: string
): TemplateLicence | undefined {
  return licences.find((l) => l.templateId === templateId && !l.invitationId);
}

export function formatOrderDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const METHOD_LABELS: Record<NonNullable<Order['method']>, string> = {
  qris: 'QRIS',
  'bank-transfer': 'Transfer bank',
  ewallet: 'E-wallet',
};

export function formatPaymentMethod(method: Order['method']): string {
  return method ? METHOD_LABELS[method] ?? method : '—';
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Menunggu pembayaran',
  payment_submitted: 'Menunggu verifikasi',
  paid: 'Lunas',
  failed: 'Gagal',
  refunded: 'Dikembalikan',
};

export function formatOrderStatus(status: OrderStatus): string {
  return STATUS_LABELS[status];
}
