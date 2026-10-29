'use client';

import React, { useState } from 'react';
import { AVAILABLE_TEMPLATES, TemplateMeta } from '@/lib/defaultData';
import { TemplateId } from '@/types/invitation';
import { Check, Sparkles, Search, X } from 'lucide-react';

interface TemplatePickerProps {
  selectedTemplateId: TemplateId;
  onSelect: (id: TemplateId) => void;
  onPreviewClick?: (id: TemplateId) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedTemplateId,
  onSelect,
}) => {
  const templateList: TemplateMeta[] = AVAILABLE_TEMPLATES;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Categories list
  const categories = [
    { id: 'all', label: 'Semua Desain' },
    { id: 'Botanical & Rustic', label: 'Botanical & Rustic' },
  ];

  const filteredTemplates = templateList.filter((tmpl) => {
    const matchesCategory = activeCategory === 'all' || tmpl.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      tmpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase()) ||
      (tmpl.styleTag && tmpl.styleTag.toLowerCase().includes(search.toLowerCase())) ||
      (tmpl.ornament && tmpl.ornament.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="studio-stack">
      <div className="studio-section-toolbar">
        <span className="studio-result-count">{filteredTemplates.length} desain tersedia</span>
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input type="search" aria-label="Cari template" placeholder="Cari desain template..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" />
          {search && <button type="button" className="search-clear" onClick={() => setSearch('')} aria-label="Hapus pencarian"><X size={13} /></button>}
        </div>
      </div>
      <div className="studio-filters" aria-label="Kategori template">
        {categories.map((cat) => (
          <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)} aria-pressed={activeCategory === cat.id} className={`chip${activeCategory === cat.id ? ' active' : ''}`}>
            {cat.label}
          </button>
        ))}
      </div>
      {filteredTemplates.length === 0 ? (
        <div className="empty-state studio-empty">
          <Search size={24} />
          <span>Tidak ada desain yang cocok dengan pencarian Anda.</span>
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => { setSearch(''); setActiveCategory('all'); }}>Reset Pencarian</button>
        </div>
      ) : (
        <div className="template-catalog">
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <article key={tmpl.id} className={`template-design${isSelected ? ' is-selected' : ''}`}>
                <div className="template-design-image">
                  <img src={tmpl.previewImage} alt={tmpl.name} />
                  {tmpl.badge && <span className="badge"><Sparkles size={11} color="var(--brand)" />{tmpl.badge}</span>}
                </div>
                <div className="template-design-body">
                  <span className="template-design-meta">{tmpl.category}</span>
                  <h3>{tmpl.name}</h3>
                  <p>{tmpl.description}</p>
                  <div className="template-design-footer">
                    <div className="template-swatches" aria-label="Palet warna">
                      <span style={{ background: tmpl.themeColor }} title="Warna utama" />
                      <span style={{ background: tmpl.accentColor }} title="Warna aksen" />
                    </div>
                    <button type="button" onClick={() => onSelect(tmpl.id)} aria-pressed={isSelected} aria-label={`${isSelected ? 'Template aktif' : 'Pilih template'}: ${tmpl.name}`} className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}>
                      {isSelected && <Check size={14} />}{isSelected ? 'Terpilih' : 'Pilih Template'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
