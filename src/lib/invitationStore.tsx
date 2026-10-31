'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  InvitationData,
  TemplateId,
  RSVPItem,
  GuestItem,
  EventDetail,
  LoveStory,
  GalleryPhoto,
  BankAccount,
} from '@/types/invitation';
import { DEMO_INVITATION, DEMO_SLUG } from './defaultData';
import {
  CheckoutResult,
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
import { getTemplate } from './templates';

const INVITATIONS_KEY = 'infomase_invitations_v3';
const ACTIVE_ID_KEY = 'infomase_active_invitation_v3';

export type PublishResult =
  | { ok: true; isPublished: boolean }
  | { ok: false; reason: 'not-found' | 'licence-required'; templateId?: string };

interface InvitationStoreValue {
  invitations: InvitationData[];
  activeId: string;
  data: InvitationData;
  isLoaded: boolean;

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
  }): InvitationData;
  duplicateInvitation(id: string): InvitationData;
  deleteInvitation(id: string): void;

  /** Requires a licence when the template is paid. */
  togglePublish(id: string): PublishResult;
  /** True when this invitation can be published right now. */
  isPublishable(id: string): boolean;
  /** True when this invitation still needs to be bought. */
  needsPurchase(id: string): boolean;
  licenceOf(id: string): TemplateLicence | undefined;

  /** Simulated checkout for one template × one invitation. */
  purchase(input: {
    templateId: string;
    invitationId: string;
    method: 'qris' | 'bank-transfer' | 'ewallet';
  }): CheckoutResult | null;

  getInvitationBySlug(slug: string): InvitationData | undefined;

  setTemplateId(templateId: TemplateId): void;
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

export function InvitationProvider({ children }: { children: React.ReactNode }) {
  const [invitations, setInvitations] = useState<InvitationData[]>([DEMO_INVITATION]);
  const [activeId, setActiveId] = useState<string>(DEMO_INVITATION.id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [licences, setLicences] = useState<TemplateLicence[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStoredOrders, setHasStoredOrders] = useState(false);

  /* ---------------------------------------------------------------- hydrate */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(INVITATIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setInvitations(parsed);
      }
      const storedActive = localStorage.getItem(ACTIVE_ID_KEY);
      if (storedActive) setActiveId(storedActive);
      const storedOrders = loadOrders();
      const storedLicences = loadLicences();
      setOrders(storedOrders);
      setLicences(storedLicences);
      setHasStoredOrders(storedOrders.length > 0 || storedLicences.length > 0);
    } catch {
      /* corrupted storage: fall back to the seed and keep going */
    } finally {
      setIsLoaded(true);
    }
  }, []);

  /* ----------------------------------------------------------------- persist */
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(INVITATIONS_KEY, JSON.stringify(invitations));
      localStorage.setItem(ACTIVE_ID_KEY, activeId);
    } catch {
      /* ignore quota errors */
    }
  }, [invitations, activeId, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveOrders(orders);
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveLicences(licences);
  }, [licences, isLoaded]);

  const data = useMemo(
    () => invitations.find((i) => i.id === activeId) ?? invitations[0] ?? DEMO_INVITATION,
    [invitations, activeId]
  );

  const updateActive = useCallback(
    (updater: (prev: InvitationData) => InvitationData) => {
      setInvitations((prev) => replaceInvitation(prev, data.id, updater));
    },
    [data.id]
  );

  /**
   * Seed grant: the demo invitation ships with a free template, which is
   * modelled as a real Rp 0 order so the receipt/order surfaces aren't empty
   * and so paid templates are never silently unlocked.
   */
  useEffect(() => {
    if (!isLoaded || hasStoredOrders) return;
    const demo = invitations.find((i) => i.id === DEMO_INVITATION.id);
    if (!demo) return;
    const tpl = getTemplate(demo.templateId);
    if (!tpl || tpl.price !== 0) return;
    if (licences.some((l) => l.invitationId === demo.id && l.templateId === tpl.id)) return;

    const seeded = completeCheckout({
      templateId: tpl.id,
      amount: 0,
      invitationId: demo.id,
      invitationTitle: demo.title,
      method: 'qris',
    });
    setOrders((prev) => [seeded.order, ...prev]);
    setLicences((prev) => [seeded.licence, ...prev]);
    setHasStoredOrders(true);
  }, [isLoaded, hasStoredOrders, invitations, licences]);

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

  const createInvitation = useCallback<InvitationStoreValue['createInvitation']>(
    (input) => {
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

      setInvitations((prev) => [created, ...prev]);
      setActiveId(created.id);
      return created;
    },
    [invitations]
  );

  const duplicateInvitation = useCallback(
    (id: string) => {
      const source = invitations.find((i) => i.id === id) ?? data;
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
      setInvitations((prev) => [copy, ...prev]);
      setActiveId(copy.id);
      return copy;
    },
    [invitations, data]
  );

  const deleteInvitation = useCallback(
    (id: string) => {
      setInvitations((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((i) => i.id !== id);
        setActiveId((current) => (current === id ? next[0].id : current));
        return next;
      });
    },
    []
  );

  const togglePublish = useCallback(
    (id: string): PublishResult => {
      const target = invitations.find((i) => i.id === id);
      if (!target) return { ok: false, reason: 'not-found' };

      const willPublish = !target.isPublished;
      if (willPublish && needsPurchase(id)) {
        return { ok: false, reason: 'licence-required', templateId: target.templateId };
      }

      setInvitations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, isPublished: willPublish, updatedAt: new Date().toISOString() }
            : item
        )
      );
      return { ok: true, isPublished: willPublish };
    },
    [invitations, needsPurchase]
  );

  const purchase = useCallback<InvitationStoreValue['purchase']>(
    ({ templateId, invitationId, method }) => {
      const tpl = getTemplate(templateId);
      const invitation = invitations.find((i) => i.id === invitationId);
      if (!tpl || !invitation) return null;

      const result = completeCheckout({
        templateId,
        amount: tpl.price,
        invitationId,
        invitationTitle: invitation.title,
        method,
      });

      setOrders((prev) => [result.order, ...prev]);
      setLicences((prev) =>
        prev.some((l) => l.invitationId === invitationId && l.templateId === templateId)
          ? prev
          : [result.licence, ...prev]
      );
      return result;
    },
    [invitations]
  );

  const getInvitationBySlug = useCallback(
    (slug: string) => invitations.find((i) => i.slug === slug),
    [invitations]
  );

  /* ---------------------------------------------------------- editor actions */

  const setTemplateId = (templateId: TemplateId) =>
    updateActive((prev) => ({ ...prev, templateId }));

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

  const deleteRSVP = (id: string) =>
    updateActive((prev) => ({ ...prev, rsvpList: prev.rsvpList.filter((r) => r.id !== id) }));

  const addGuest = (guest: Omit<GuestItem, 'id'>) =>
    updateActive((prev) => ({
      ...prev,
      guests: [{ ...guest, id: clientId('gst') }, ...prev.guests],
    }));

  const deleteGuest = (id: string) =>
    updateActive((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== id) }));

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
    invitations,
    activeId,
    data,
    isLoaded,
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
