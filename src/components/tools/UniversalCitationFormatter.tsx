import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  Quote, 
  Layers, 
  Bookmark, 
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface CitationFormatterProps {
  onBackToGrid?: () => void;
}

type CitationStyle = 'apa7' | 'mla9' | 'harvard' | 'chicago';
type SourceType = 'book' | 'journal' | 'website';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
}

interface CitationPreset {
  name: string;
  sourceType: SourceType;
  authors: { firstName: string; lastName: string }[];
  title: string;
  containerTitle: string;
  publisher: string;
  year: string;
  volume?: string;
  issue?: string;
  pages?: string;
  urlOrDoi?: string;
  accessDate?: string;
}

const CITATION_PRESETS: CitationPreset[] = [
  {
    name: 'Classic Science Book (Hawking)',
    sourceType: 'book',
    authors: [{ firstName: 'Stephen', lastName: 'Hawking' }],
    title: 'A Brief History of Time: From the Big Bang to Black Holes',
    containerTitle: '',
    publisher: 'Bantam Books',
    year: '1988'
  },
  {
    name: 'Nature Journal Article (Quantum)',
    sourceType: 'journal',
    authors: [
      { firstName: 'Frank', lastName: 'Arute' },
      { firstName: 'Kunal', lastName: 'Arya' }
    ],
    title: 'Quantum supremacy using a programmable superconducting processor',
    containerTitle: 'Nature',
    publisher: 'Nature Publishing Group',
    year: '2019',
    volume: '574',
    issue: '7779',
    pages: '505-510',
    urlOrDoi: 'https://doi.org/10.1038/s41586-019-1666-5'
  },
  {
    name: 'Web Documentation (MDN)',
    sourceType: 'website',
    authors: [{ firstName: 'Mozilla', lastName: 'Contributors' }],
    title: 'JavaScript Reference Guide & ECMAScript Specifications',
    containerTitle: 'MDN Web Docs',
    publisher: 'Mozilla Corporation',
    year: '2026',
    urlOrDoi: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    accessDate: '2026-09-03'
  }
];

export const UniversalCitationFormatter: React.FC<CitationFormatterProps> = ({ onBackToGrid }) => {
  const [style, setStyle] = useState<CitationStyle>('apa7');
  const [sourceType, setSourceType] = useState<SourceType>('book');

  // Form state
  const [authors, setAuthors] = useState<Author[]>([
    { id: '1', firstName: 'Stephen', lastName: 'Hawking' }
  ]);
  const [title, setTitle] = useState<string>('A Brief History of Time: From the Big Bang to Black Holes');
  const [containerTitle, setContainerTitle] = useState<string>(''); // Journal or Website name
  const [publisher, setPublisher] = useState<string>('Bantam Books');
  const [year, setYear] = useState<string>('1988');
  const [volume, setVolume] = useState<string>('');
  const [issue, setIssue] = useState<string>('');
  const [pages, setPages] = useState<string>('');
  const [urlOrDoi, setUrlOrDoi] = useState<string>('');
  const [accessDate, setAccessDate] = useState<string>('2026-09-03');

  const [copiedType, setCopiedType] = useState<'plain' | 'rich' | 'intext' | 'bibtex' | null>(null);

  // Author manipulation helpers
  const addAuthor = () => {
    playSound('click');
    setAuthors(prev => [...prev, { id: String(Date.now()), firstName: '', lastName: '' }]);
  };

  const updateAuthor = (id: string, field: 'firstName' | 'lastName', val: string) => {
    setAuthors(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const removeAuthor = (id: string) => {
    playSound('click');
    if (authors.length > 1) {
      setAuthors(prev => prev.filter(a => a.id !== id));
    }
  };

  // Helper to format author names according to international protocols
  const formatAuthors = (citationStyle: CitationStyle): string => {
    const validAuthors = authors.filter(a => a.lastName.trim() || a.firstName.trim());
    if (validAuthors.length === 0) return 'Anonymous';

    if (citationStyle === 'apa7') {
      // APA 7: Lastname, F. M., & Lastname, F.
      return validAuthors.map((a, idx) => {
        const last = a.lastName.trim();
        const firstInitial = a.firstName.trim() ? `${a.firstName.trim()[0]}.` : '';
        const formatted = `${last}${firstInitial ? `, ${firstInitial}` : ''}`;
        if (idx === validAuthors.length - 1 && validAuthors.length > 1) {
          return `& ${formatted}`;
        }
        return formatted;
      }).join(', ');
    }

    if (citationStyle === 'mla9') {
      // MLA 9: First author is "Lastname, Firstname", subsequent are "Firstname Lastname"
      if (validAuthors.length === 1) {
        const a = validAuthors[0];
        return `${a.lastName.trim()}, ${a.firstName.trim()}`;
      } else if (validAuthors.length === 2) {
        const a1 = validAuthors[0];
        const a2 = validAuthors[1];
        return `${a1.lastName.trim()}, ${a1.firstName.trim()}, and ${a2.firstName.trim()} ${a2.lastName.trim()}`;
      } else {
        const a1 = validAuthors[0];
        return `${a1.lastName.trim()}, ${a1.firstName.trim()}, et al.`;
      }
    }

    if (citationStyle === 'harvard') {
      // Harvard: Lastname, Initial(s).
      return validAuthors.map((a, idx) => {
        const last = a.lastName.trim();
        const initial = a.firstName.trim() ? `${a.firstName.trim()[0]}.` : '';
        const formatted = `${last}, ${initial}`;
        if (idx === validAuthors.length - 1 && validAuthors.length > 1) {
          return `and ${formatted}`;
        }
        return formatted;
      }).join(', ');
    }

    // Chicago 17
    if (validAuthors.length === 1) {
      return `${validAuthors[0].lastName.trim()}, ${validAuthors[0].firstName.trim()}`;
    } else {
      return validAuthors.map((a, idx) => {
        if (idx === 0) return `${a.lastName.trim()}, ${a.firstName.trim()}`;
        if (idx === validAuthors.length - 1) return `and ${a.firstName.trim()} ${a.lastName.trim()}`;
        return `${a.firstName.trim()} ${a.lastName.trim()}`;
      }).join(', ');
    }
  };

  // Compile formatted citation (Returns plain text, HTML formatted, in-text citation, BibTeX)
  const compiledCitation = useMemo(() => {
    const authorStr = formatAuthors(style);
    const yr = year.trim() || 'n.d.';
    const cleanTitle = title.trim();
    const cleanContainer = containerTitle.trim();
    const cleanPub = publisher.trim();
    const cleanDoi = urlOrDoi.trim();

    let plainText = '';
    let htmlText = '';
    let inTextParenthetical = '';
    let inTextNarrative = '';

    // Primary author last name for in-text
    const firstAuthorLast = authors[0]?.lastName.trim() || 'Author';
    const secondAuthorLast = authors[1]?.lastName.trim();

    // 1. APA 7th Edition
    if (style === 'apa7') {
      if (sourceType === 'book') {
        plainText = `${authorStr} (${yr}). ${cleanTitle}. ${cleanPub}.`;
        htmlText = `${authorStr} (${yr}). <i>${cleanTitle}</i>. ${cleanPub}.`;
      } else if (sourceType === 'journal') {
        const volStr = volume ? `, ${volume}` : '';
        const issStr = issue ? `(${issue})` : '';
        const pgStr = pages ? `, ${pages}` : '';
        plainText = `${authorStr} (${yr}). ${cleanTitle}. ${cleanContainer}${volStr}${issStr}${pgStr}.${cleanDoi ? ` ${cleanDoi}` : ''}`;
        htmlText = `${authorStr} (${yr}). ${cleanTitle}. <i>${cleanContainer}</i>${volStr ? `<i>${volStr}</i>` : ''}${issStr}${pgStr}.${cleanDoi ? ` <a href="${cleanDoi}" target="_blank" class="text-blue-500 underline">${cleanDoi}</a>` : ''}`;
      } else {
        plainText = `${authorStr} (${yr}). ${cleanTitle}. ${cleanContainer || cleanPub}.${cleanDoi ? ` ${cleanDoi}` : ''}`;
        htmlText = `${authorStr} (${yr}). <i>${cleanTitle}</i>. ${cleanContainer || cleanPub}.${cleanDoi ? ` <a href="${cleanDoi}" target="_blank" class="text-blue-500 underline">${cleanDoi}</a>` : ''}`;
      }

      if (authors.length === 1) {
        inTextParenthetical = `(${firstAuthorLast}, ${yr})`;
        inTextNarrative = `${firstAuthorLast} (${yr})`;
      } else if (authors.length === 2) {
        inTextParenthetical = `(${firstAuthorLast} & ${secondAuthorLast}, ${yr})`;
        inTextNarrative = `${firstAuthorLast} and ${secondAuthorLast} (${yr})`;
      } else {
        inTextParenthetical = `(${firstAuthorLast} et al., ${yr})`;
        inTextNarrative = `${firstAuthorLast} et al. (${yr})`;
      }
    }

    // 2. MLA 9th Edition
    else if (style === 'mla9') {
      if (sourceType === 'book') {
        plainText = `${authorStr}. ${cleanTitle}. ${cleanPub}, ${yr}.`;
        htmlText = `${authorStr}. <i>${cleanTitle}</i>. ${cleanPub}, ${yr}.`;
      } else if (sourceType === 'journal') {
        const volPart = volume ? `, vol. ${volume}` : '';
        const issPart = issue ? `, no. ${issue}` : '';
        const pgPart = pages ? `, pp. ${pages}` : '';
        plainText = `${authorStr}. "${cleanTitle}." ${cleanContainer}${volPart}${issPart}, ${yr}${pgPart}.${cleanDoi ? ` ${cleanDoi}` : ''}`;
        htmlText = `${authorStr}. "${cleanTitle}." <i>${cleanContainer}</i>${volPart}${issPart}, ${yr}${pgPart}.${cleanDoi ? ` <a href="${cleanDoi}" target="_blank" class="text-blue-500 underline">${cleanDoi}</a>` : ''}`;
      } else {
        const accessStr = accessDate ? ` Accessed ${accessDate}.` : '';
        plainText = `${authorStr}. "${cleanTitle}." ${cleanContainer || cleanPub}, ${yr}, ${cleanDoi}.${accessStr}`;
        htmlText = `${authorStr}. "${cleanTitle}." <i>${cleanContainer || cleanPub}</i>, ${yr}, <a href="${cleanDoi}" target="_blank" class="text-blue-500 underline">${cleanDoi}</a>.${accessStr}`;
      }

      const pageRef = pages ? ` ${pages.split('-')[0].trim()}` : '';
      inTextParenthetical = `(${firstAuthorLast}${pageRef})`;
      inTextNarrative = `${firstAuthorLast}${pageRef ? ` (p. ${pageRef.trim()})` : ''}`;
    }

    // 3. Harvard System
    else if (style === 'harvard') {
      if (sourceType === 'book') {
        plainText = `${authorStr} (${yr}) ${cleanTitle}. ${cleanPub}.`;
        htmlText = `${authorStr} (${yr}) <i>${cleanTitle}</i>. ${cleanPub}.`;
      } else if (sourceType === 'journal') {
        const volIssue = volume ? `${volume}${issue ? `(${issue})` : ''}` : '';
        const pgPart = pages ? `, pp. ${pages}` : '';
        plainText = `${authorStr} (${yr}) '${cleanTitle}', ${cleanContainer}, ${volIssue}${pgPart}.${cleanDoi ? ` Available at: ${cleanDoi}` : ''}`;
        htmlText = `${authorStr} (${yr}) '${cleanTitle}', <i>${cleanContainer}</i>, ${volIssue}${pgPart}.${cleanDoi ? ` Available at: <a href="${cleanDoi}" class="text-blue-500 underline">${cleanDoi}</a>` : ''}`;
      } else {
        const accessStr = accessDate ? ` [Accessed ${accessDate}].` : '';
        plainText = `${authorStr} (${yr}) ${cleanTitle}. Available at: ${cleanDoi}${accessStr}`;
        htmlText = `${authorStr} (${yr}) <i>${cleanTitle}</i>. Available at: <a href="${cleanDoi}" class="text-blue-500 underline">${cleanDoi}</a>${accessStr}`;
      }

      inTextParenthetical = `(${firstAuthorLast}, ${yr})`;
      inTextNarrative = `${firstAuthorLast} (${yr})`;
    }

    // 4. Chicago 17th Edition (Author-Date)
    else {
      if (sourceType === 'book') {
        plainText = `${authorStr}. ${yr}. ${cleanTitle}. ${cleanPub}.`;
        htmlText = `${authorStr}. ${yr}. <i>${cleanTitle}</i>. ${cleanPub}.`;
      } else if (sourceType === 'journal') {
        const volIss = volume ? ` ${volume}${issue ? `, no. ${issue}` : ''}` : '';
        const pgPart = pages ? `: ${pages}` : '';
        plainText = `${authorStr}. ${yr}. "${cleanTitle}." ${cleanContainer}${volIss}${pgPart}.${cleanDoi ? ` ${cleanDoi}` : ''}`;
        htmlText = `${authorStr}. ${yr}. "${cleanTitle}." <i>${cleanContainer}</i>${volIss}${pgPart}.${cleanDoi ? ` ${cleanDoi}` : ''}`;
      } else {
        plainText = `${authorStr}. ${yr}. "${cleanTitle}." ${cleanContainer || cleanPub}. ${cleanDoi}.`;
        htmlText = `${authorStr}. ${yr}. "${cleanTitle}." ${cleanContainer || cleanPub}. ${cleanDoi}.`;
      }

      inTextParenthetical = `(${firstAuthorLast} ${yr})`;
      inTextNarrative = `${firstAuthorLast} (${yr})`;
    }

    // BibTeX generator
    const bibKey = `${firstAuthorLast.toLowerCase().replace(/[^a-z]/g, '')}${yr}`;
    const bibType = sourceType === 'book' ? 'book' : sourceType === 'journal' ? 'article' : 'misc';
    const bibtex = `@${bibType}{${bibKey},
  author = {${authors.map(a => `${a.lastName}, ${a.firstName}`).join(' and ')}},
  title = {${cleanTitle}},
  ${sourceType === 'journal' ? `journal = {${cleanContainer}},` : ''}
  ${sourceType === 'book' ? `publisher = {${cleanPub}},` : ''}
  year = {${yr}}${volume ? `,\n  volume = {${volume}}` : ''}${issue ? `,\n  number = {${issue}}` : ''}${pages ? `,\n  pages = {${pages}}` : ''}${cleanDoi ? `,\n  doi = {${cleanDoi}}` : ''}
}`;

    return {
      plainText,
      htmlText,
      inTextParenthetical,
      inTextNarrative,
      bibtex
    };
  }, [style, sourceType, authors, title, containerTitle, publisher, year, volume, issue, pages, urlOrDoi, accessDate]);

  const handleCopy = (content: string, type: 'plain' | 'rich' | 'intext' | 'bibtex') => {
    playSound('calcChime');
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1800);
  };

  const applyPreset = (preset: CitationPreset) => {
    playSound('click');
    setSourceType(preset.sourceType);
    setAuthors(preset.authors.map((a, i) => ({ id: String(i + 1), firstName: a.firstName, lastName: a.lastName })));
    setTitle(preset.title);
    setContainerTitle(preset.containerTitle);
    setPublisher(preset.publisher);
    setYear(preset.year);
    setVolume(preset.volume || '');
    setIssue(preset.issue || '');
    setPages(preset.pages || '');
    setUrlOrDoi(preset.urlOrDoi || '');
    setAccessDate(preset.accessDate || '2026-09-03');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="citation-formatter-root">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Academic Bibliography & Citation Formatter
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Official Protocols
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Format citations and in-text references compliant with APA 7th, MLA 9th, Harvard, and Chicago 17th standards.
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-slate-300 dark:border-white/10"
          >
            ← Back to Tools
          </button>
        )}
      </div>

      {/* Style & Source Type Selector Tabs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Format Tabs */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Citation Standard Guide
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'apa7', label: 'APA 7th Edition' },
                { id: 'mla9', label: 'MLA 9th Edition' },
                { id: 'harvard', label: 'Harvard Referencing' },
                { id: 'chicago', label: 'Chicago 17th (Author-Date)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { playSound('click'); setStyle(tab.id as CitationStyle); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    style === tab.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source Type */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Source Medium
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'book', label: 'Book' },
                { id: 'journal', label: 'Journal Article' },
                { id: 'website', label: 'Website' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => { playSound('click'); setSourceType(st.id as SourceType); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    sourceType === st.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pre-fill Sample:</span>
          {CITATION_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form & Real-Time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Authors List */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Author(s) or Corporate Creator
              </label>
              <button
                onClick={addAuthor}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Author</span>
              </button>
            </div>

            <div className="space-y-2">
              {authors.map((author, idx) => (
                <div key={author.id} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={author.firstName}
                    onChange={(e) => updateAuthor(author.id, 'firstName', e.target.value)}
                    placeholder="First Name / Initials"
                    className="flex-1 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                  <input
                    type="text"
                    value={author.lastName}
                    onChange={(e) => updateAuthor(author.id, 'lastName', e.target.value)}
                    placeholder="Last Name or Organization"
                    className="flex-1 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-semibold"
                  />
                  {authors.length > 1 && (
                    <button
                      onClick={() => removeAuthor(author.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove author"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Title & Publication Details */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {sourceType === 'book' ? 'Book Title *' : sourceType === 'journal' ? 'Article Title *' : 'Webpage Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter complete title..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 font-semibold"
              />
            </div>

            {sourceType !== 'book' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {sourceType === 'journal' ? 'Journal / Periodical Name *' : 'Website Name'}
                </label>
                <input
                  type="text"
                  value={containerTitle}
                  onChange={(e) => setContainerTitle(e.target.value)}
                  placeholder={sourceType === 'journal' ? 'e.g., Nature, IEEE Transactions' : 'e.g., MDN Web Docs'}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sourceType === 'book' ? (
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Publisher Name *
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g., Bantam Books, Oxford University Press"
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              ) : null}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Year *
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g., 2026"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {sourceType === 'journal' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Volume
                    </label>
                    <input
                      type="text"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="e.g., 574"
                      className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Issue / No.
                    </label>
                    <input
                      type="text"
                      value={issue}
                      onChange={(e) => setIssue(e.target.value)}
                      placeholder="e.g., 7779"
                      className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pages
                    </label>
                    <input
                      type="text"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      placeholder="e.g., 505-510"
                      className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                </>
              )}
            </div>

            {/* URL or DOI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  DOI or URL
                </label>
                <input
                  type="text"
                  value={urlOrDoi}
                  onChange={(e) => setUrlOrDoi(e.target.value)}
                  placeholder="https://doi.org/... or https://..."
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {sourceType === 'website' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Date Accessed
                  </label>
                  <input
                    type="date"
                    value={accessDate}
                    onChange={(e) => setAccessDate(e.target.value)}
                    className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Output Card & In-Text Reference (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Formatted Bibliography Output */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-blue-500/10 border border-purple-500/30 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{style.toUpperCase()} Bibliography Entry</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                Hanging Indent Standard
              </span>
            </div>

            {/* Visual Hanging Indent Bibliography Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-xs">
              <p 
                className="font-serif text-sm sm:text-base leading-relaxed pl-8 -indent-8 text-slate-900 dark:text-slate-100"
                dangerouslySetInnerHTML={{ __html: compiledCitation.htmlText }}
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleCopy(compiledCitation.plainText, 'plain')}
                className="w-full py-3 rounded-2xl text-xs font-black bg-purple-600 hover:bg-purple-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                id="copy-citation-plain-btn"
              >
                {copiedType === 'plain' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'plain' ? 'Copied Bibliography Text!' : 'Copy Formatted Citation'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopy(compiledCitation.bibtex, 'bibtex')}
                  className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-white/80 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  {copiedType === 'bibtex' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <FileText className="w-3.5 h-3.5 text-purple-500" />}
                  <span>Copy BibTeX</span>
                </button>

                <button
                  onClick={() => handleCopy(compiledCitation.htmlText, 'rich')}
                  className="py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-white/80 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  {copiedType === 'rich' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Quote className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>HTML Format</span>
                </button>
              </div>
            </div>
          </div>

          {/* In-Text Citation Formats */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Quote className="w-4 h-4 text-purple-500" />
              <span>In-Text Citation Previews</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Parenthetical */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Parenthetical Citation:</span>
                  <span className="font-serif font-bold text-slate-900 dark:text-white text-sm">
                    {compiledCitation.inTextParenthetical}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(compiledCitation.inTextParenthetical, 'intext')}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-white hover:bg-slate-300 transition-all cursor-pointer"
                >
                  Copy
                </button>
              </div>

              {/* Narrative */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Narrative Citation:</span>
                  <span className="font-serif font-bold text-slate-900 dark:text-white text-sm">
                    {compiledCitation.inTextNarrative}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(compiledCitation.inTextNarrative, 'intext')}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 text-[11px] font-bold text-slate-700 dark:text-white hover:bg-slate-300 transition-all cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
