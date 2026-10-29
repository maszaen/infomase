'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { INITIAL_INVITATION_DATA, INITIAL_INVITATIONS_COLLECTION } from './defaultData';

const SINGLE_STORAGE_KEY = 'infomase_invitation_data_v1';
const MULTI_STORAGE_KEY = 'infomase_invitations_collection_v2';
const ACTIVE_ID_KEY = 'infomase_active_invitation_id';

export function useInvitationStore() {
  const [invitations, setInvitations] = useState<InvitationData[]>(INITIAL_INVITATIONS_COLLECTION);
  const [activeId, setActiveIdState] = useState<string>(INITIAL_INVITATIONS_COLLECTION[0].id);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      let loadedList: InvitationData[] | null = null;
      const storedMulti = localStorage.getItem(MULTI_STORAGE_KEY);

      if (storedMulti) {
        const parsed = JSON.parse(storedMulti);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedList = parsed;
        }
      }

      // Fallback: check legacy single storage key
      if (!loadedList) {
        const storedSingle = localStorage.getItem(SINGLE_STORAGE_KEY);
        if (storedSingle) {
          const singleParsed = JSON.parse(storedSingle);
          if (singleParsed && singleParsed.id) {
            loadedList = [
              { ...singleParsed, isPublished: singleParsed.isPublished ?? true },
              ...INITIAL_INVITATIONS_COLLECTION.filter((i) => i.id !== singleParsed.id),
            ];
          }
        }
      }

      if (loadedList && loadedList.length > 0) {
        setInvitations(loadedList);
        const storedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
        if (storedActiveId && loadedList.some((i) => i.id === storedActiveId)) {
          setActiveIdState(storedActiveId);
        } else {
          setActiveIdState(loadedList[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to load invitations from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(invitations));
      localStorage.setItem(ACTIVE_ID_KEY, activeId);
      const currentActive = invitations.find((item) => item.id === activeId) || invitations[0];
      if (currentActive) {
        localStorage.setItem(SINGLE_STORAGE_KEY, JSON.stringify(currentActive));
      }
    } catch (e) {
      console.warn('Failed to save invitations to localStorage', e);
    }
  }, [invitations, activeId, isLoaded]);

  const saveInvitationsList = useCallback((newList: InvitationData[], newActiveId?: string) => {
    setInvitations(newList);
    if (newActiveId) setActiveIdState(newActiveId);
  }, []);

  const setActiveInvitationId = useCallback((id: string) => {
    setActiveIdState(id);
  }, []);

  // Currently active invitation data
  const data: InvitationData =
    invitations.find((i) => i.id === activeId) || invitations[0] || INITIAL_INVITATION_DATA;

  // Helper to update active invitation
  const updateActiveInvitation = useCallback(
    (updater: (prev: InvitationData) => InvitationData) => {
      setInvitations((prevList) => {
        const nextList = prevList.map((item) => {
          if (item.id === activeId) {
            return updater(item);
          }
          return item;
        });

        return nextList;
      });
    },
    [activeId]
  );

  // Create new invitation
  const createInvitation = useCallback(
    (payload: {
      title: string;
      slug: string;
      templateId: TemplateId;
      groomName: string;
      brideName: string;
      eventDate?: string;
    }): InvitationData => {
      const newId = `inv-${Date.now()}`;
      const baseDate = payload.eventDate || '2026-12-25';

      const newInv: InvitationData = {
        ...INITIAL_INVITATION_DATA,
        id: newId,
        title: payload.title || `Pernikahan ${payload.groomName} & ${payload.brideName}`,
        slug: (payload.slug || `${payload.groomName}-${payload.brideName}`).toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        templateId: payload.templateId,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        groom: {
          ...INITIAL_INVITATION_DATA.groom,
          name: payload.groomName || 'Pengantin Pria',
          fullName: payload.groomName || 'Pengantin Pria, S.T.',
        },
        bride: {
          ...INITIAL_INVITATION_DATA.bride,
          name: payload.brideName || 'Pengantin Wanita',
          fullName: payload.brideName || 'Pengantin Wanita, S.Ked.',
        },
        countdownDate: `${baseDate}T08:00:00`,
        events: [
          {
            ...INITIAL_INVITATION_DATA.events[0],
            date: baseDate,
          },
          {
            ...INITIAL_INVITATION_DATA.events[1],
            date: baseDate,
          },
        ],
        rsvpList: [],
        guests: [],
      };

      const updatedList = [newInv, ...invitations];
      saveInvitationsList(updatedList, newId);
      return newInv;
    },
    [invitations, saveInvitationsList]
  );

  // Duplicate existing invitation
  const duplicateInvitation = useCallback(
    (id: string): InvitationData => {
      const source = invitations.find((i) => i.id === id) || data;
      const copyId = `inv-${Date.now()}`;
      const copySlug = `${source.slug}-copy-${Math.floor(Math.random() * 900 + 100)}`;

      const duplicated: InvitationData = {
        ...source,
        id: copyId,
        slug: copySlug,
        title: `${source.title} (Salinan)`,
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rsvpList: [],
      };

      const updatedList = [duplicated, ...invitations];
      saveInvitationsList(updatedList, copyId);
      return duplicated;
    },
    [invitations, data, saveInvitationsList]
  );

  // Delete invitation
  const deleteInvitation = useCallback(
    (id: string) => {
      if (invitations.length <= 1) {
        alert('Minimal harus ada 1 undangan di akun Anda.');
        return;
      }
      const updatedList = invitations.filter((i) => i.id !== id);
      const nextActiveId = id === activeId ? updatedList[0].id : activeId;
      saveInvitationsList(updatedList, nextActiveId);
    },
    [invitations, activeId, saveInvitationsList]
  );

  // Toggle publish status with subscription enforcement
  const togglePublish = useCallback(
    (id: string, canPublish: boolean): { success: boolean; isPublished?: boolean; error?: string } => {
      const target = invitations.find((i) => i.id === id);
      if (!target) return { success: false, error: 'Undangan tidak ditemukan' };

      const willPublish = !target.isPublished;

      // RULE ENFORCEMENT: If subscription is expired, user CANNOT publish!
      if (willPublish && !canPublish) {
        return {
          success: false,
          error: 'SUBSCRIPTION_EXPIRED',
        };
      }

      const updatedList = invitations.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPublished: willPublish,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      saveInvitationsList(updatedList);
      return { success: true, isPublished: willPublish };
    },
    [invitations, saveInvitationsList]
  );

  // Find invitation by slug (for public invite page)
  const getInvitationBySlug = useCallback(
    (slug: string): InvitationData | undefined => {
      return invitations.find((i) => i.slug === slug);
    },
    [invitations]
  );

  // Standard editor update actions (updates active invitation)
  const setTemplateId = (templateId: TemplateId) => {
    updateActiveInvitation((prev) => ({ ...prev, templateId, updatedAt: new Date().toISOString() }));
  };

  const updateGroom = (updates: Partial<InvitationData['groom']>) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      groom: { ...prev.groom, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateBride = (updates: Partial<InvitationData['bride']>) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      bride: { ...prev.bride, ...updates },
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateGeneral = (title: string, slug: string) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      title,
      slug,
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateQuote = (quote: InvitationData['quote']) => {
    updateActiveInvitation((prev) => ({ ...prev, quote, updatedAt: new Date().toISOString() }));
  };

  const updateCountdownDate = (countdownDate: string) => {
    updateActiveInvitation((prev) => ({ ...prev, countdownDate, updatedAt: new Date().toISOString() }));
  };

  const updateEvent = (id: string, updates: Partial<EventDetail>) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      events: prev.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addEvent = (event: EventDetail) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      events: [...prev.events, event],
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteEvent = (id: string) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateStories = (stories: LoveStory[]) => {
    updateActiveInvitation((prev) => ({ ...prev, stories, updatedAt: new Date().toISOString() }));
  };

  const updateGallery = (gallery: GalleryPhoto[]) => {
    updateActiveInvitation((prev) => ({ ...prev, gallery, updatedAt: new Date().toISOString() }));
  };

  const updateMusic = (music: InvitationData['music']) => {
    updateActiveInvitation((prev) => ({ ...prev, music, updatedAt: new Date().toISOString() }));
  };

  const updateBankAccounts = (bankAccounts: BankAccount[]) => {
    updateActiveInvitation((prev) => ({ ...prev, bankAccounts, updatedAt: new Date().toISOString() }));
  };

  const updateGiftAddress = (giftAddress: InvitationData['giftAddress']) => {
    updateActiveInvitation((prev) => ({ ...prev, giftAddress, updatedAt: new Date().toISOString() }));
  };

  const addRSVP = (item: Omit<RSVPItem, 'id' | 'createdAt'>) => {
    const newItem: RSVPItem = {
      ...item,
      id: 'rsvp-' + Date.now(),
      createdAt: 'Baru saja',
    };
    updateActiveInvitation((prev) => ({
      ...prev,
      rsvpList: [newItem, ...prev.rsvpList],
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteRSVP = (id: string) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      rsvpList: prev.rsvpList.filter((r) => r.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const addGuest = (guest: Omit<GuestItem, 'id'>) => {
    const newGuest: GuestItem = {
      ...guest,
      id: 'gst-' + crypto.randomUUID(),
    };
    updateActiveInvitation((prev) => ({
      ...prev,
      guests: [newGuest, ...prev.guests],
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteGuest = (id: string) => {
    updateActiveInvitation((prev) => ({
      ...prev,
      guests: prev.guests.filter((g) => g.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const resetToDefault = () => {
    updateActiveInvitation(() => ({
      ...INITIAL_INVITATION_DATA,
      id: activeId,
      updatedAt: new Date().toISOString(),
    }));
  };

  return {
    invitations,
    activeId,
    activeInvitation: data,
    data,
    isLoaded,
    setActiveInvitationId,
    createInvitation,
    duplicateInvitation,
    deleteInvitation,
    togglePublish,
    getInvitationBySlug,
    setTemplateId,
    updateGroom,
    updateBride,
    updateGeneral,
    updateQuote,
    updateCountdownDate,
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
}
