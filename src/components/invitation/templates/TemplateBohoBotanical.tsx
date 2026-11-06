'use client';

import React from 'react';
import { TemplateFrame, TemplateProps } from './TemplateFrame';

export type { TemplateProps };

export const TemplateBohoBotanical: React.FC<TemplateProps> = (props) => {
  return <TemplateFrame folderId="undangan_1" {...props} />;
};
