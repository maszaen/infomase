'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  InvitationData,
  TemplateId,
  RSVPItem,
  GuestItem,
  EventDetail,
  LoveStory,
  GalleryPhoto,
  BankAccount,
  WhatsAppMessageTemplate,
} from '@/types/invitation';
import { DEMO_INVITATION, DEMO_SLUG, getDemoInvitation } from './defaultData';
import {
  Order,
  TemplateLicence,
  completeCheckout,
  formatOrderDate,
  hasLicence,
  licenceFor,
  loadLicences,
  loadOrders,
  saveLicences,
  saveOrders,
} from './orders';
import { getTemplate, TEMPLATES, TemplateMeta, normalizeTemplateId } from './templates';
import {
  invitationsApi,
  ordersApi,
  guestsApi,
  rsvpsApi,
  templatesApi,
  getToken,
  getAuthSession,
  hasServerSession,
  type RemoteOrderResponse,
  type RemoteLicenceResponse,
  type RemoteTemplate,
} from './api';
import { INVITATIONS_KEY, ACTIVE_ID_KEY, AUTH_CHANGE_EVENT } from './storage';

export type PublishResult =
  | { ok: true; isPublished: boolean }
  | { ok: false; reason: 'not-found' | 'licence-required' | 'server-error'; templateId?: string; error?: string };

export type PurchaseResult =
  | { ok: true; status: 'paid' | 'pending' | 'verifying'; order: Order }
  | { ok: false; error: string };

interface InvitationStoreValue {
  templates: TemplateMeta[];
  invitations: InvitationData[];
  activeId: string;
  data: InvitationData;
  isLoaded: boolean;
  loadError: string;
  saveStates: Record<string, { status: 'saving' | 'saved' | 'error'; message?: string }>;
  saveNow(id: string): Promise<void>;

  orders: Order[];
  licences: TemplateLicence[];

  setActiveInvitation(id: string): void;
  createInvitation(input: {
    title: string;
    slug: string;
    templateId: TemplateId;
    groomName: string;
    brideName: string;
    eventDate?: string;
  }): Promise<InvitationData>;
  duplicateInvitation(id: string): Promise<InvitationData>;
  deleteInvitation(id: string): Promise<void>;

  /** Requires a licence when the template is paid. */
  togglePublish(id: string): Promise<PublishResult>;
  /** True when this invitation can be published right now. */
  isPublishable(id: string): boolean;
  /** True when this invitation still needs to be bought. */
  needsPurchase(id: string): boolean;
  licenceOf(id: string): TemplateLicence | undefined;

  /** Checkout for one template (optionally bound to an existing invitation). */
  purchase(input: {
    templateId: string;
    invitationId?: string;
    method: 'qris' | 'bank-transfer' | 'ewallet';
  }): Promise<PurchaseResult>;

  /** Re-fetch orders & licences from the backend (after proof upload / admin verification). */
  refreshOrdersAndLicences(): Promise<Order[]>;

  /** Update one order's status locally after a payment-proof round-trip. */
  markOrderStatus(orderId: string, status: Order['status']): void;

  getInvitationBySlug(slug: string): InvitationData | undefined;

  setTemplateId(templateId: TemplateId, targetId?: string): void;
  updateGroom(updates: Partial<InvitationData['groom']>): void;
  updateBride(updates: Partial<InvitationData['bride']>): void;
  updateGeneral(title: string, slug: string): void;
  updateQuote(quote: InvitationData['quote']): void;
  updateEvents(events: EventDetail[]): void;
  updateEvent(id: string, updates: Partial<EventDetail>): void;
  addEvent(event: EventDetail): void;
  deleteEvent(id: string): void;
  updateStories(stories: LoveStory[]): void;
  updateGallery(gallery: GalleryPhoto[]): void;
  updateMusic(music: InvitationData['music']): void;
  updateBankAccounts(accounts: BankAccount[]): void;
  updateGiftAddress(address: InvitationData['giftAddress']): void;
  addRSVP(item: Omit<RSVPItem, 'id' | 'createdAt'>): void;
  deleteRSVP(id: string): void;
  addGuest(guest: Omit<GuestItem, 'id'>): void;
  deleteGuest(id: string): void;
  checkInGuest(guestId: string, isCheckedIn: boolean): void;
  updateWaTemplates(templates: WhatsAppMessageTemplate[]): void;
  resetToDefault(): void;
}

const InvitationContext = createContext<InvitationStoreValue | undefined>(undefined);

function replaceInvitation(
  list: InvitationData[],
  id: string,
  updater: (prev: InvitationData) => InvitationData
): InvitationData[] {
  return list.map((item) =>
    item.id === id ? { ...updater(item), updatedAt: new Date().toISOString() } : item
  );
}

/**
 * Ids are only ever consumed on the client (they land in localStorage and in
 * links), but the store is created during the server render too. Using
 * Date.now() there makes the markup identical on both sides; randomUUID
 * would not, so it is deliberately avoided.
 */
function clientId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function mapRemoteOrder(o: RemoteOrderResponse): Order {
  const status: Order['status'] =
    o.status === 'confirmed' || o.status === 'paid'
      ? 'paid'
      : o.status === 'payment_submitted'
        ? 'payment_submitted'
        : o.status === 'cancelled' || o.status === 'failed'
          ? 'failed'
          : o.status === 'refunded'
            ? 'refunded'
            : 'pending';
  return {
    id: o.id,
    templateId: normalizeTemplateId(o.templateId),
    invitationId: o.invitationId || '',
    invitationTitle: o.invitationTitle || o.invitationSlug || 'Lisensi Template (Siap Digunakan)',
    amount: Number(o.amount) || 0,
    currency: 'IDR',
    status,
    createdAt: o.createdAt,
    paidAt: o.paidAt ?? undefined,
    method: o.paymentMethod === 'bank-transfer' || o.paymentMethod === 'ewallet' ? o.paymentMethod : 'qris',
    reference: o.orderNumber || o.id,
  };
}

function mapRemoteLicence(l: RemoteLicenceResponse): TemplateLicence {
  return {
    id: l.id,
    invitationId: l.invitationId || '',
    invitationSlug: l.invitationSlug ?? null,
    invitationTitle: l.invitationTitle ?? null,
    templateId: normalizeTemplateId(l.templateId),
    orderId: l.orderId || l.id,
    kind: 'perpetual',
    issuedAt: l.issuedAt,
  };
}

function mergeRemoteTemplates(remoteList?: RemoteTemplate[] | null): TemplateMeta[] {
  if (!Array.isArray(remoteList) || remoteList.length === 0) return TEMPLATES;
  const byId = new Map<string, RemoteTemplate>();
  remoteList.forEach((rt) => {
    const cid = normalizeTemplateId(rt.id || rt.code);
    byId.set(cid, rt);
  });
  return TEMPLATES.map((local) => {
    const rt = byId.get(local.id);
    if (!rt) return local;
    return {
      ...local,
      name: rt.name || local.name,
      tagline: rt.tagline || local.tagline,
      price: typeof rt.price === 'number' ? rt.price : local.price,
      compareAt: typeof rt.compareAt === 'number' ? rt.compareAt : local.compareAt,
      isHighlighted: typeof rt.isHighlighted === 'boolean' ? rt.isHighlighted : local.isHighlighted,
      badge: rt.badge !== undefined ? rt.badge : local.badge,
      previewImage: rt.previewImage || local.previewImage,
      demoSlug: rt.demoSlug !== undefined ? rt.demoSlug : local.demoSlug,
      status: rt.status === 'coming-soon' ? 'coming-soon' : 'available',
    };
  });
}

function editablePayload(inv: InvitationData) {
  return {
    title: inv.title, slug: inv.slug, templateId: inv.templateId,
    groom: inv.groom, bride: inv.bride, quote: inv.quote, events: inv.events,
    countdownDate: inv.countdownDate, stories: inv.stories, gallery: inv.gallery,
    music: inv.music, bankAccounts: inv.bankAccounts, giftAddress: inv.giftAddress,
    waTemplates: inv.waTemplates, streaming: inv.streaming,
  };
}

/** Placeholder so a signed-in account with no invitations never sees demo content. */
const EMPTY_INVITATION: InvitationData = {
  ...DEMO_INVITATION,
  id: '',
  slug: '',
  title: '',
  templateId: '',
  isPublished: false,
  events: [],
  stories: [],
  gallery: [],
  bankAccounts: [],
  rsvpList: [],
  guests: [],
  waTemplates: [],
};

export function InvitationProvider({ children }: { children: React.ReactNode }) {
  const [templates, setTemplates] = useState<TemplateMeta[]>(TEMPLATES);
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [activeId, setActiveId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [licences, setLicences] = useState<TemplateLicence[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveStates, setSaveStates] = useState<Record<string, { status: 'saving' | 'saved' | 'error'; message?: string }>>({});
  const saved = useRef(new Map<string, string>());
  const latest = useRef<InvitationData[]>([]);
  const saving = useRef(new Map<string, Promise<void>>());
  const generation = useRef(0);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      const version = ++generation.current;
      const session = getAuthSession();
      const current = () => mounted && version === generation.current && session === getAuthSession();
      setIsLoaded(false);
      setInvitations([]);
      setActiveId('');
      setOrders([]);
      setLicences([]);
      setSaveStates({});
      setLoadError('');
      saved.current.clear();
      latest.current = [];
      saving.current.clear();

      // Hydrate catalog templates from backend in parallel (non-blocking fallback to TEMPLATES)
      templatesApi
        .getAll()
        .then((remoteTemplates) => {
          if (mounted && remoteTemplates) {
            setTemplates(mergeRemoteTemplates(remoteTemplates));
          }
        })
        .catch(() => {
          /* keep local TEMPLATES fallback */
        });

      try {
        if (hasServerSession()) {
          const [list, remoteOrders, remoteLicences] = await Promise.all([
            invitationsApi.getAll(), ordersApi.getAll(), ordersApi.getLicences(),
          ]);
          const full = await Promise.all(list.map((item) => invitationsApi.getById(item.id)));
          if (!current()) return;
          full.forEach((inv) => saved.current.set(inv.id, JSON.stringify(editablePayload(inv))));
          latest.current = full;
          setInvitations(full);
          setActiveId(full[0]?.id ?? '');
          setOrders(remoteOrders.map(mapRemoteOrder));
          setLicences(remoteLicences.map(mapRemoteLicence));
        } else if (getToken() === 'demo-token') {
          let local = [DEMO_INVITATION];
          try {
            const parsed = JSON.parse(localStorage.getItem(INVITATIONS_KEY) || 'null');
            if (Array.isArray(parsed)) local = parsed;
          } catch { /* Ignore corrupted demo storage. */ }
          latest.current = local;
          setInvitations(local);
          setActiveId(local.find((i) => i.id === localStorage.getItem(ACTIVE_ID_KEY))?.id ?? local[0]?.id ?? '');
          setOrders(loadOrders());
          setLicences(loadLicences());
        } else {
          latest.current = [];
          setInvitations([]);
          setActiveId('');
          setOrders([]);
          setLicences([]);
        }
      } catch (error) {
        if (current()) setLoadError(error instanceof Error ? error.message : 'Data akun gagal dimuat.');
      } finally {
        if (current()) setIsLoaded(true);
      }
    };
    const onAuthChange = () => { void hydrate(); };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'infomase_token' || event.key === 'infomase_user') onAuthChange();
    };
    void Promise.resolve().then(() => { if (mounted) return hydrate(); });
    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    window.addEventListener('storage', onStorage);
    return () => {
      mounted = false;
      generation.current += 1;
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  /* ----------------------------------------------------------------- persist */
  useEffect(() => {
    if (!isLoaded || getToken() !== 'demo-token') return;
    try {
      localStorage.setItem(INVITATIONS_KEY, JSON.stringify(invitations));
      localStorage.setItem(ACTIVE_ID_KEY, activeId);
    } catch {
      /* ignore quota errors */
    }
  }, [invitations, activeId, isLoaded]);

  useEffect(() => {
    if (isLoaded && getToken() === 'demo-token') saveOrders(orders);
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded && getToken() === 'demo-token') saveLicences(licences);
  }, [licences, isLoaded]);

  const data = useMemo(
    () =>
      invitations.find((i) => i.id === activeId) ??
      invitations[0] ??
      (hasServerSession() ? EMPTY_INVITATION : DEMO_INVITATION),
    [invitations, activeId]
  );

  const saveNow = useCallback(async (id: string): Promise<void> => {
    if (!hasServerSession()) return;
    const inFlight = saving.current.get(id);
    if (inFlight) return inFlight;
    const session = getAuthSession();
    const version = generation.current;
    const current = () => version === generation.current && session === getAuthSession();
    const promise = (async () => {
      try {
        while (current()) {
          const inv = latest.current.find((item) => item.id === id);
          if (!inv) return;
          const payload = editablePayload(inv);
          const signature = JSON.stringify(payload);
          if (saved.current.get(id) === signature) return;
          setSaveStates((prev) => ({ ...prev, [id]: { status: 'saving' } }));
          await invitationsApi.update(id, payload);
          if (!current()) return;
          saved.current.set(id, signature);
          setSaveStates((prev) => ({ ...prev, [id]: { status: 'saved' } }));
        }
      } catch (error) {
        if (current()) setSaveStates((prev) => ({ ...prev, [id]: {
          status: 'error', message: error instanceof Error ? error.message : 'Gagal menyimpan perubahan.',
        } }));
        throw error;
      }
    })();
    saving.current.set(id, promise);
    try { await promise; } finally {
      if (saving.current.get(id) === promise) saving.current.delete(id);
    }
  }, []);

  useEffect(() => {
    latest.current = invitations;
    if (!isLoaded || !hasServerSession() || loadError) return;
    const dirty = invitations.filter((inv) => saved.current.get(inv.id) !== JSON.stringify(editablePayload(inv)));
    const timer = setTimeout(() => {
      dirty.forEach((inv) => { void saveNow(inv.id).catch(() => undefined); });
    }, 1000);
    const warnUnsaved = (event: BeforeUnloadEvent) => {
      if (latest.current.some((inv) => saved.current.get(inv.id) !== JSON.stringify(editablePayload(inv)))) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warnUnsaved);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', warnUnsaved);
    };
  }, [invitations, isLoaded, loadError, saveNow]);

  const updateActive = useCallback(
    (updater: (prev: InvitationData) => InvitationData) => {
      setInvitations((prev) => replaceInvitation(prev, data.id, updater));
    },
    [data.id]
  );

  /* ------------------------------------------------------------- entitlements */

  const needsPurchase = useCallback(
    (id: string) => {
      const inv = invitations.find((i) => i.id === id);
      if (!inv) return false;
      const tpl = getTemplate(inv.templateId);
      if (!tpl || tpl.price === 0) return false;
      return !hasLicence(licences, id, inv.templateId);
    },
    [invitations, licences]
  );

  const isPublishable = useCallback((id: string) => !needsPurchase(id), [needsPurchase]);

  const licenceOf = useCallback((id: string) => licenceFor(licences, id), [licences]);

  /* ------------------------------------------------------------------- CRUD */

  const setActiveInvitation = useCallback((id: string) => setActiveId(id), []);

  const refreshOrdersAndLicences = useCallback(async () => {
    if (!hasServerSession()) return [];
    const session = getAuthSession();
    const [remoteOrders, remoteLicences] = await Promise.all([ordersApi.getAll(), ordersApi.getLicences()]);
    if (session !== getAuthSession()) throw new Error('Akun aktif telah berubah.');
    const mapped = remoteOrders.map(mapRemoteOrder);
    setOrders(mapped);
    setLicences(remoteLicences.map(mapRemoteLicence));
    return mapped;
  }, []);

  const markOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const createInvitation = useCallback<InvitationStoreValue['createInvitation']>(
    async (input) => {
      const session = getAuthSession();
      const now = new Date().toISOString();
      const baseDate = input.eventDate || '2027-06-12';
      const slugBase = slugify(input.slug || `${input.groomName}-${input.brideName}`) || 'undangan';
      let slug = slugBase;
      let n = 2;
      while (invitations.some((i) => i.slug === slug)) {
        slug = `${slugBase}-${n}`;
        n += 1;
      }

      const created: InvitationData = {
        ...DEMO_INVITATION,
        id: clientId('inv'),
        slug,
        title: input.title || `${input.groomName} & ${input.brideName}`,
        templateId: input.templateId,
        isPublished: false,
        createdAt: now,
        updatedAt: now,
        groom: {
          ...DEMO_INVITATION.groom,
          name: input.groomName,
          fullName: input.groomName,
          instagram: '',
        },
        bride: {
          ...DEMO_INVITATION.bride,
          name: input.brideName,
          fullName: input.brideName,
          instagram: '',
        },
        countdownDate: `${baseDate}T08:00:00`,
        events: DEMO_INVITATION.events.map((ev) => ({ ...ev, date: baseDate })),
        rsvpList: [],
        guests: [],
      };

      const result = hasServerSession() ? await invitationsApi.create(editablePayload(created)) : created;
      if (session !== getAuthSession()) throw new Error('Akun aktif telah berubah.');
      saved.current.set(result.id, JSON.stringify(editablePayload(result)));
      setInvitations((prev) => [result, ...prev]);
      setActiveId(result.id);
      if (hasServerSession()) {
        await refreshOrdersAndLicences().catch(() => undefined);
      } else if (getToken() === 'demo-token') {
        setLicences((prev) => {
          const avail = prev.find((l) => l.templateId === input.templateId && !l.invitationId);
          if (!avail) return prev;
          return prev.map((l) => (l.id === avail.id ? { ...l, invitationId: result.id, invitationSlug: result.slug, invitationTitle: result.title } : l));
        });
      }
      return result;
    },
    [invitations, refreshOrdersAndLicences]
  );

  const duplicateInvitation = useCallback(
    async (id: string) => {
      const session = getAuthSession();
      const source = invitations.find((i) => i.id === id);
      if (!source) throw new Error('Undangan tidak ditemukan.');
      await saveNow(id);
      const now = new Date().toISOString();
      const copy: InvitationData = {
        ...source,
        id: clientId('inv'),
        slug: `${source.slug}-${Math.floor(Math.random() * 900 + 100)}`,
        title: `${source.title} (salinan)`,
        isPublished: false,
        createdAt: now,
        updatedAt: now,
        rsvpList: [],
        guests: [],
      };
      const result = hasServerSession() ? await invitationsApi.create(editablePayload(copy)) : copy;
      if (session !== getAuthSession()) throw new Error('Akun aktif telah berubah.');
      saved.current.set(result.id, JSON.stringify(editablePayload(result)));
      setInvitations((prev) => [result, ...prev]);
      setActiveId(result.id);
      return result;
    },
    [invitations, saveNow]
  );

  const deleteInvitation = useCallback(async (id: string) => {
    const session = getAuthSession();
    await saveNow(id);
    if (hasServerSession()) await invitationsApi.delete(id);
    if (session !== getAuthSession()) return;
    saved.current.delete(id);
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    setActiveId((current) => current === id ? '' : current);
  }, [saveNow]);

  const togglePublish = useCallback(async (id: string): Promise<PublishResult> => {
    const target = invitations.find((i) => i.id === id);
    if (!target) return { ok: false, reason: 'not-found' };
    const willPublish = !target.isPublished;
    if (willPublish && needsPurchase(id)) return { ok: false, reason: 'licence-required', templateId: target.templateId };
    const session = getAuthSession();
    try {
      await saveNow(id);
      if (hasServerSession()) await invitationsApi.update(id, { isPublished: willPublish });
      if (session !== getAuthSession()) throw new Error('Akun aktif telah berubah.');
      setInvitations((prev) => prev.map((item) => item.id === id ? { ...item, isPublished: willPublish } : item));
      return { ok: true, isPublished: willPublish };
    } catch (error) {
      return { ok: false, reason: 'server-error', error: error instanceof Error ? error.message : 'Publikasi gagal.' };
    }
  }, [invitations, needsPurchase, saveNow]);

  const purchase = useCallback<InvitationStoreValue['purchase']>(
    async ({ templateId, invitationId, method }) => {
      const tpl = templates.find((t) => t.id === normalizeTemplateId(templateId)) || getTemplate(templateId);
      if (!tpl) return { ok: false, error: 'Template tidak ditemukan.' };
      const invitation = invitationId ? invitations.find((i) => i.id === invitationId) : undefined;
      if (invitationId && !invitation) {
        return { ok: false, error: 'Undangan yang dipilih tidak ditemukan.' };
      }

      // Demo mode: fully local simulation, nothing reaches the backend.
      if (!getToken()) return { ok: false, error: 'Masuk terlebih dahulu untuk membeli lisensi.' };
      if (getToken() === 'demo-token') {
        const result = completeCheckout({
          templateId: tpl.id,
          amount: tpl.price,
          invitationId: invitation?.id || '',
          invitationTitle: invitation?.title || `Lisensi ${tpl.name}`,
          method,
        });
        setOrders((prev) => [result.order, ...prev]);
        setLicences((prev) => [result.licence, ...prev]);
        return { ok: true, status: 'paid', order: result.order };
      }

      try {
        if (invitation?.id) {
          await saveNow(invitation.id);
        }
        const res = await ordersApi.checkout({
          ...(invitation?.id ? { invitationId: invitation.id } : {}),
          templateId: tpl.id,
          paymentMethod: method || 'qris',
        });
        if (!res?.id) return { ok: false, error: 'Server tidak mengembalikan data pesanan.' };

        const order = mapRemoteOrder(res);
        setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);

        if (order.status === 'paid') {
          await refreshOrdersAndLicences();
          return { ok: true, status: 'paid', order };
        }
        // Paid templates stay pending until the proof is uploaded and an
        // admin verifies it — never grant a licence optimistically here.
        return {
          ok: true,
          status: order.status === 'payment_submitted' ? 'verifying' : 'pending',
          order,
        };
      } catch (err: unknown) {
        // Already licensed on the server (e.g. bought in another session).
        await refreshOrdersAndLicences().catch(() => undefined);
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Pesanan belum berhasil dibuat. Coba lagi.',
        };
      }
    },
    [invitations, refreshOrdersAndLicences, saveNow, templates]
  );

  const getInvitationBySlug = useCallback(
    (slug: string) => {
      // 1. Direct match on slug
      const found = invitations.find((i) => i.slug === slug);
      if (found) return found;

      // 2. Direct match on invitation ID
      const foundById = invitations.find((i) => i.id === slug);
      if (foundById) return foundById;

      // 3. Match by suffix pattern (e.g. slug-xxxx)
      const foundBySuffix = invitations.find((i) => slug.startsWith(`${i.slug}-`));
      if (foundBySuffix) return foundBySuffix;

      const tpl = TEMPLATES.find((t) => t.demoSlug === slug);
      if (tpl) {
        return getDemoInvitation(tpl.id, tpl.demoSlug || slug);
      }
      return undefined;
    },
    [invitations]
  );

  /* ---------------------------------------------------------- editor actions */

  const updateInvitation = useCallback(
    (id: string, updater: (prev: InvitationData) => InvitationData) => {
      setInvitations((prev) => replaceInvitation(prev, id, updater));
    },
    []
  );

  const setTemplateId = (templateId: TemplateId, targetId?: string) =>
    (targetId || data.id)
      ? updateInvitation(targetId || data.id, (prev) => ({ ...prev, templateId }))
      : undefined;

  const updateGroom = (updates: Partial<InvitationData['groom']>) =>
    updateActive((prev) => ({ ...prev, groom: { ...prev.groom, ...updates } }));

  const updateBride = (updates: Partial<InvitationData['bride']>) =>
    updateActive((prev) => ({ ...prev, bride: { ...prev.bride, ...updates } }));

  const updateGeneral = (title: string, slug: string) =>
    updateActive((prev) => ({ ...prev, title, slug: slugify(slug) || prev.slug }));

  const updateQuote = (quote: InvitationData['quote']) => updateActive((prev) => ({ ...prev, quote }));

  const updateEvents = (events: EventDetail[]) =>
    updateActive((prev) => ({
      ...prev,
      events,
      countdownDate: events[0] ? `${events[0].date}T${events[0].startTime}:00` : prev.countdownDate,
    }));

  const updateEvent = (id: string, updates: Partial<EventDetail>) =>
    updateActive((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
    }));

  const addEvent = (event: EventDetail) =>
    updateActive((prev) => ({ ...prev, events: [...prev.events, event] }));

  const deleteEvent = (id: string) =>
    updateActive((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));

  const updateStories = (stories: LoveStory[]) => updateActive((prev) => ({ ...prev, stories }));

  const updateGallery = (gallery: GalleryPhoto[]) => updateActive((prev) => ({ ...prev, gallery }));

  const updateMusic = (music: InvitationData['music']) => updateActive((prev) => ({ ...prev, music }));

  const updateBankAccounts = (accounts: BankAccount[]) =>
    updateActive((prev) => ({ ...prev, bankAccounts: accounts }));

  const updateGiftAddress = (address: InvitationData['giftAddress']) =>
    updateActive((prev) => ({ ...prev, giftAddress: address }));

  const addRSVP = (item: Omit<RSVPItem, 'id' | 'createdAt'>) =>
    updateActive((prev) => ({
      ...prev,
      rsvpList: [
        { ...item, id: clientId('rsvp'), createdAt: new Date().toISOString() },
        ...prev.rsvpList,
      ],
    }));

  const deleteRSVP = (id: string) => {
    updateActive((prev) => ({ ...prev, rsvpList: prev.rsvpList.filter((r) => r.id !== id) }));
    if (getToken() && activeId && activeId !== DEMO_INVITATION.id) {
      rsvpsApi.delete(activeId, id).catch(() => {});
    }
  };

  const addGuest = (guest: Omit<GuestItem, 'id'>) => {
    const tempId = clientId('gst');
    updateActive((prev) => ({
      ...prev,
      guests: [{ ...guest, id: tempId }, ...prev.guests],
    }));

    if (getToken() && activeId && activeId !== DEMO_INVITATION.id) {
      guestsApi
        .add(activeId, {
          name: guest.name,
          category: guest.category,
          phone: guest.phone,
          maxPax: 1,
        })
        .then((serverGuest) => {
          if (serverGuest?.id) {
            updateActive((prev) => ({
              ...prev,
              guests: prev.guests.map((g) => (g.id === tempId ? { ...g, id: serverGuest.id } : g)),
            }));
          }
        })
        .catch(() => {});
    }
  };

  const deleteGuest = (id: string) => {
    updateActive((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== id) }));
    if (getToken() && activeId && activeId !== DEMO_INVITATION.id) {
      guestsApi.delete(activeId, id).catch(() => {});
    }
  };

  const checkInGuest = (guestId: string, isCheckedIn: boolean) => {
    const nowIso = isCheckedIn ? new Date().toISOString() : null;
    updateActive((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === guestId ? { ...g, isCheckedIn, checkedInAt: nowIso } : g
      ),
    }));
    if (hasServerSession() && activeId && activeId !== DEMO_INVITATION.id) {
      guestsApi.checkIn(activeId, guestId, isCheckedIn).catch(() => {});
    }
  };

  const updateWaTemplates = (templates: WhatsAppMessageTemplate[]) =>
    updateActive((prev) => ({ ...prev, waTemplates: templates }));

  const resetToDefault = () =>
    updateActive((prev) => ({
      ...DEMO_INVITATION,
      id: prev.id,
      slug: prev.slug,
      title: prev.title,
      templateId: prev.templateId,
      isPublished: prev.isPublished,
    }));

  const value: InvitationStoreValue = {
    templates,
    invitations,
    activeId,
    data,
    isLoaded,
    loadError,
    saveStates,
    saveNow,
    orders,
    licences,
    setActiveInvitation,
    createInvitation,
    duplicateInvitation,
    deleteInvitation,
    togglePublish,
    isPublishable,
    needsPurchase,
    licenceOf,
    purchase,
    refreshOrdersAndLicences,
    markOrderStatus,
    getInvitationBySlug,
    setTemplateId,
    updateGroom,
    updateBride,
    updateGeneral,
    updateQuote,
    updateEvents,
    updateEvent,
    addEvent,
    deleteEvent,
    updateStories,
    updateGallery,
    updateMusic,
    updateBankAccounts,
    updateGiftAddress,
    addRSVP,
    deleteRSVP,
    addGuest,
    deleteGuest,
    checkInGuest,
    updateWaTemplates,
    resetToDefault,
  };

  return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>;
}

export function useInvitationStore(): InvitationStoreValue {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error('useInvitationStore must be used inside <InvitationProvider>');
  return ctx;
}

export { formatOrderDate, DEMO_SLUG };
