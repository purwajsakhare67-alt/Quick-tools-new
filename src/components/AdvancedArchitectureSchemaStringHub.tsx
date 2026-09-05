import React, { useState } from 'react';
import { 
  Link2, 
  Binary, 
  FileCode, 
  KeyRound, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Layers
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalSlugToTextConverter } from './tools/UniversalSlugToTextConverter';
import { UniversalTextToHexEncoder } from './tools/UniversalTextToHexEncoder';
import { UniversalYamlToJsonEngine } from './tools/UniversalYamlToJsonEngine';
import { UniversalCryptoPasswordMixer } from './tools/UniversalCryptoPasswordMixer';
import { UniversalTorrentBencodeJsonParser } from './tools/UniversalTorrentBencodeJsonParser';

interface AdvancedArchitectureSchemaStringHubProps {
  initialTool?: 'slug_to_text' | 'text_to_hex_encoder' | 'yaml_to_json_engine' | 'crypto_password_mixer' | 'torrent_bencode_json';
  defaultExpanded?: boolean;
}

export const AdvancedArchitectureSchemaStringHub: React.FC<AdvancedArchitectureSchemaStringHubProps> = ({
  initialTool = 'slug_to_text',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'slug_to_text' | 'text_to_hex_encoder' | 'yaml_to_json_engine' | 'crypto_password_mixer' | 'torrent_bencode_json'>(initialTool);

  const tools = [
    {
      id: 'slug_to_text',
      name: 'SEO URL Slug to Plain Text Converter',
      shortName: 'Slug to Text',
      icon: Link2,
      tagline: 'Dynamically replace dashes and underscores with clean spaces and apply capital title-casing parameters natively in browser RAM',
      badge: 'Productivity Utility',
      accent: 'from-teal-600 via-emerald-500 to-cyan-500'
    },
    {
      id: 'text_to_hex_encoder',
      name: 'Real-Time Text String to Hex Encoder',
      shortName: 'Text to Hex',
      icon: Binary,
      tagline: 'Parse character codes natively within browser memory to output calculated raw hexadecimal parameter strings',
      badge: 'Developer Utility',
      accent: 'from-cyan-600 via-blue-600 to-indigo-600'
    },
    {
      id: 'yaml_to_json_engine',
      name: 'Structured YAML to JSON Format Engine',
      shortName: 'YAML to JSON',
      icon: FileCode,
      tagline: 'Run string node analysis routines client-side to convert mapping structures into indented standard JSON strings',
      badge: 'Cloud Analytics',
      accent: 'from-amber-600 via-orange-600 to-yellow-600'
    },
    {
      id: 'crypto_password_mixer',
      name: 'Customizable Cryptographic Random Password Mixer',
      shortName: 'Crypto Password Mixer',
      icon: KeyRound,
      tagline: 'Process mathematical randomization loops utilizing window.crypto.getRandomValues to output collision-free data keys',
      badge: 'Security Utility',
      accent: 'from-emerald-600 via-teal-600 to-indigo-600'
    },
    {
      id: 'torrent_bencode_json',
      name: 'Torrent Bencode to Structured JSON Parser',
      shortName: 'Torrent Bencode Parser',
      icon: Database,
      tagline: 'Decode programmatic bencode types mapping dictionary variables arrays recursively using client browser script scopes',
      badge: 'Data Infrastructure',
      accent: 'from-blue-600 via-indigo-600 to-violet-600'
    }
  ] as const;

  return (
    <div id="advanced-architecture-schema-string-hub" className="mb-10 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden transition-all duration-300">
      {/* Banner Header with Expand/Collapse Toggle */}
      <div 
        onClick={() => {
          setIsExpanded(!isExpanded);
          playSound('click');
        }}
        className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-teal-500/5 via-cyan-500/5 to-indigo-500/5 hover:from-teal-500/10 hover:to-indigo-500/10 transition-colors border-b border-slate-200/60 dark:border-white/5"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Advanced Architecture Schema &amp; String Transformers
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                5 High-Utility Tools
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Zero-latency client-side string transformations, cryptographic randomization, and cloud schema parsers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
            <Cpu className="w-3.5 h-3.5" />
            100% Client-Side Engine
          </div>
          <button 
            type="button"
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Workspace */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-6">
          {/* Quick-Nav Tab Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    playSound('tap');
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isActive 
                      ? 'bg-white dark:bg-slate-800 border-teal-500 shadow-md shadow-teal-500/10 scale-[1.02]' 
                      : 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${t.accent} flex items-center justify-center text-white shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      {t.badge.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-xs font-bold truncate ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {t.shortName}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                      {t.tagline}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Utility Demo Host */}
          <div className="pt-2">
            {activeTab === 'slug_to_text' && <UniversalSlugToTextConverter />}
            {activeTab === 'text_to_hex_encoder' && <UniversalTextToHexEncoder />}
            {activeTab === 'yaml_to_json_engine' && <UniversalYamlToJsonEngine />}
            {activeTab === 'crypto_password_mixer' && <UniversalCryptoPasswordMixer />}
            {activeTab === 'torrent_bencode_json' && <UniversalTorrentBencodeJsonParser />}
          </div>
        </div>
      )}
    </div>
  );
};
