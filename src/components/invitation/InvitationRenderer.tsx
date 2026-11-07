'use client';

import React from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';
import { getTemplateComponent } from './templates';

export interface InvitationRendererProps {
  data: InvitationData;
  guestName?: string;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  defaultOpened?: boolean;
}

/**
 * Scalable Invitation Renderer
 * Dispatches to individual template components based on `data.templateId`.
 * Each template owns its styling, layouts, animations, and typography independently.
 */
export const InvitationRenderer: React.FC<InvitationRendererProps> = ({
  data,
  guestName,
  onAddRSVP,
  defaultOpened = false,
}) => {
  const Component = React.useMemo(() => getTemplateComponent(data?.templateId), [data?.templateId]);

  return React.createElement(Component, { data, guestName, onAddRSVP, defaultOpened });
};
