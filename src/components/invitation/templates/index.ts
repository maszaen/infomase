'use client';

import React from 'react';
import { TemplateProps, TemplateBohoBotanical } from './TemplateBohoBotanical';
import { TemplateModernMinimalist } from './TemplateModernMinimalist';
import { TemplateTropicalBeach } from './TemplateTropicalBeach';
import { TemplateLuxuryIslamic } from './TemplateLuxuryIslamic';
import { TemplateMistyMountain } from './TemplateMistyMountain';
import { TemplateRoyalMaroon } from './TemplateRoyalMaroon';
import { TemplatePawiwahanAgung } from './TemplatePawiwahanAgung';
import { TemplatePawiwahanPethak } from './TemplatePawiwahanPethak';
import { normalizeTemplateId } from '@/lib/templates';

export type { TemplateProps };
export {
  TemplateBohoBotanical,
  TemplateModernMinimalist,
  TemplateTropicalBeach,
  TemplateLuxuryIslamic,
  TemplateMistyMountain,
  TemplateRoyalMaroon,
  TemplatePawiwahanAgung,
  TemplatePawiwahanPethak,
};

/**
 * Scalable Template Component Registry
 * Adding a new template only requires adding a component to this map!
 */
export const TEMPLATE_COMPONENTS: Record<string, React.FC<TemplateProps>> = {
  'boho-botanical': TemplateBohoBotanical,
  'modern-minimalist': TemplateModernMinimalist,
  'tropical-beach': TemplateTropicalBeach,
  'luxury-islamic': TemplateLuxuryIslamic,
  'misty-mountain': TemplateMistyMountain,
  'royal-maroon': TemplateRoyalMaroon,
  'pawiwahan-agung': TemplatePawiwahanAgung,
  'pawiwahan-pethak': TemplatePawiwahanPethak,
};

export function getTemplateComponent(templateId: string | undefined | null): React.FC<TemplateProps> {
  const canonicalId = normalizeTemplateId(templateId);
  return TEMPLATE_COMPONENTS[canonicalId] || TemplateBohoBotanical;
}
