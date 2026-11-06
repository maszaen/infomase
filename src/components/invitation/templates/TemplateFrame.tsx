'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InvitationData, RSVPItem } from '@/types/invitation';

export interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  onAddRSVP?: (item: Omit<RSVPItem, 'id' | 'createdAt'>) => void;
  defaultOpened?: boolean;
}

interface TemplateFrameProps extends TemplateProps {
  folderId: string;
}

/**
 * TemplateFrame renders an isolated, pixel-perfect 1:1 reproduction of the
 * standalone extracted HTML5/CSS3/Vanilla JS template while injecting dynamic
 * InvitationData via the universal template bridge.
 */
export const TemplateFrame: React.FC<TemplateFrameProps> = ({
  folderId,
  data,
  guestName,
  onAddRSVP,
  defaultOpened = false,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const postData = useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const targetOrigin =
          typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
            ? window.location.origin
            : '*';
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'INIT_INVITATION_DATA',
            data,
            guestName,
            defaultOpened,
          },
          targetOrigin
        );
      } catch (err) {
        console.warn('Failed to postMessage to template iframe:', err);
      }
    }
  }, [data, guestName, defaultOpened]);

  const handleIframeLoad = () => {
    setIsLoaded(true);
    postData();
    setTimeout(postData, 200);
    setTimeout(postData, 600);
  };

  useEffect(() => {
    if (isLoaded) {
      postData();
    }
  }, [isLoaded, postData]);

  // Listen for RSVP submissions dispatched by the template's universal bridge
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
        if (event.origin !== window.location.origin) return;
      }
      if (event.data && event.data.type === 'RSVP_SUBMIT' && onAddRSVP) {
        onAddRSVP(event.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAddRSVP]);

  const guestParam = guestName ? `&to=${encodeURIComponent(guestName)}` : '';
  const openedParam = defaultOpened ? '&opened=1' : '';
  const iframeSrc = `/template/${folderId}/index.html?v=1${guestParam}${openedParam}`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        onLoad={handleIframeLoad}
        title={data?.title || 'Undangan Pernikahan'}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '100%',
          border: 'none',
          display: 'block',
          backgroundColor: 'transparent',
        }}
        allow="autoplay; clipboard-write; encrypted-media"
      />
    </div>
  );
};
