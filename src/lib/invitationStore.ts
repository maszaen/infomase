'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvitationData, TemplateId, RSVPItem, GuestItem, EventDetail, LoveStory, GalleryPhoto, BankAccount } from '@/types/invitation';
import { INITIAL_INVITATION_DATA } from './defaultData';

const STORAGE_KEY = 'infomase_invitation_data_v1';

export function useInvitationStore() {
  const [data, setData] = useState<InvitationData>(INITIAL_INVITATION_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
      }
    } catch (e) {
      console.warn('Failed to load invitation data from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const saveToStorage = useCallback((newData: InvitationData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn('Failed to save invitation data to localStorage', e);
    }
  }, []);

  const setTemplateId = (templateId: TemplateId) => {
    saveToStorage({ ...data, templateId });
  };

  const updateGroom = (updates: Partial<InvitationData['groom']>) => {
    saveToStorage({
      ...data,
      groom: { ...data.groom, ...updates },
    });
  };

  const updateBride = (updates: Partial<InvitationData['bride']>) => {
    saveToStorage({
      ...data,
      bride: { ...data.bride, ...updates },
    });
  };

  const updateGeneral = (title: string, slug: string) => {
    saveToStorage({
      ...data,
      title,
      slug,
    });
  };

  const updateQuote = (quote: InvitationData['quote']) => {
    saveToStorage({
      ...data,
      quote,
    });
  };

  const updateCountdownDate = (countdownDate: string) => {
    saveToStorage({
      ...data,
      countdownDate,
    });
  };

  const updateEvent = (id: string, updates: Partial<EventDetail>) => {
    const updated = data.events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
    saveToStorage({ ...data, events: updated });
  };

  const addEvent = (event: EventDetail) => {
    saveToStorage({ ...data, events: [...data.events, event] });
  };

  const deleteEvent = (id: string) => {
    saveToStorage({ ...data, events: data.events.filter((e) => e.id !== id) });
  };

  const updateStories = (stories: LoveStory[]) => {
    saveToStorage({ ...data, stories });
  };

  const updateGallery = (gallery: GalleryPhoto[]) => {
    saveToStorage({ ...data, gallery });
  };

  const updateMusic = (music: InvitationData['music']) => {
    saveToStorage({ ...data, music });
  };

  const updateBankAccounts = (bankAccounts: BankAccount[]) => {
    saveToStorage({ ...data, bankAccounts });
  };

  const updateGiftAddress = (giftAddress: InvitationData['giftAddress']) => {
    saveToStorage({ ...data, giftAddress });
  };

  const addRSVP = (item: Omit<RSVPItem, 'id' | 'createdAt'>) => {
    const newItem: RSVPItem = {
      ...item,
      id: 'rsvp-' + Date.now(),
      createdAt: 'Baru saja',
    };
    saveToStorage({
      ...data,
      rsvpList: [newItem, ...data.rsvpList],
    });
  };

  const deleteRSVP = (id: string) => {
    saveToStorage({
      ...data,
      rsvpList: data.rsvpList.filter((r) => r.id !== id),
    });
  };

  const addGuest = (guest: Omit<GuestItem, 'id'>) => {
    const newGuest: GuestItem = {
      ...guest,
      id: 'gst-' + Date.now(),
    };
    saveToStorage({
      ...data,
      guests: [newGuest, ...data.guests],
    });
  };

  const deleteGuest = (id: string) => {
    saveToStorage({
      ...data,
      guests: data.guests.filter((g) => g.id !== id),
    });
  };

  const resetToDefault = () => {
    saveToStorage(INITIAL_INVITATION_DATA);
  };

  return {
    data,
    isLoaded,
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
