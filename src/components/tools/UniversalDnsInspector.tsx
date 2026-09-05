import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ArrowLeft, 
  Search, 
  Check, 
  Copy, 
  Server, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalDnsInspectorProps {
  onBackToGrid?: () => void;
}

type RecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'CAA';

interface DnsRecord {
  name: string;
  type: number;
  typeName: string;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: { name: string; type: number }[];
  Answer?: { name: string; type: number; TTL: number; data: string }[];
  Authority?: { name: string; type: number; TTL: number; data: string }[];
  Comment?: string;
}

const TYPE_NAME_MAP: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  257: 'CAA'
};

const DNS_STATUS_MAP: Record<number, { text: string; color: string; desc: string }> = {
  0: { text: 'NOERROR', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'DNS query resolved successfully without error.' },
  1: { text: 'FORMERR', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Format Error: The name server was unable to interpret the query.' },
  2: { text: 'SERVFAIL', color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Server Failure: Name server was unable to process this query.' },
  3: { text: 'NXDOMAIN', color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Non-Existent Domain: The domain name does not exist.' },
  4: { text: 'NOTIMP', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Not Implemented: The name server does not support requested query.' },
  5: { text: 'REFUSED', color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Query Refused: The name server refused to perform the operation.' }
};

const SAMPLE_DOMAINS = [
  'cloudflare.com',
  'google.com',
  'github.com',
  'wikipedia.org',
  'mozilla.org'
];

export const UniversalDnsInspector: React.FC<UniversalDnsInspectorProps> = ({ onBackToGrid }) => {
  const [domainInput, setDomainInput] = useState<string>('cloudflare.com');
  const [recordType, setRecordType] = useState<RecordType>('A');
  const [provider, setProvider] = useState<'cloudflare' | 'google'>('cloudflare');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawJson, setRawJson] = useState<DnsResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copiedRecordIdx, setCopiedRecordIdx] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const executeLookup = async (targetDomain = domainInput, targetType = recordType) => {
    let clean = targetDomain.trim().toLowerCase();
    // Strip protocol if user pasted http/https
    clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0];

    if (!clean) {
      setError('Please provide a valid hostname or domain name (e.g. example.com).');
      return;
    }

    setIsLoading(true);
    setError(null);
    const start = performance.now();

    try {
      let endpoint = '';
      if (provider === 'cloudflare') {
        endpoint = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(clean)}&type=${targetType}`;
      } else {
        endpoint = `https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=${targetType}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/dns-json'
        }
      });

      if (!response.ok) {
        throw new Error(`DNS Provider returned HTTP status: ${response.status}`);
      }

      const data: DnsResponse = await response.json();
      const elapsed = Math.round(performance.now() - start);

      setLatencyMs(elapsed);
      setRawJson(data);
      playSound('success');
    } catch (err: any) {
      console.error('DNS Lookup Error:', err);
      // Try fallback to Google DNS if Cloudflare failed
      if (provider === 'cloudflare') {
        try {
          const fallbackResp = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=${targetType}`, {
            headers: { Accept: 'application/dns-json' }
          });
          const fallbackData = await fallbackResp.json();
          setLatencyMs(Math.round(performance.now() - start));
          setRawJson(fallbackData);
          playSound('success');
          setIsLoading(false);
          return;
        } catch {
          // Both failed
        }
      }

      setError(err?.message || 'Network lookup error. Ensure client has network connectivity.');
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeLookup(domainInput, recordType);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup();
  };

  const handleTypeSelect = (t: RecordType) => {
    setRecordType(t);
    playSound('click');
    executeLookup(domainInput, t);
  };

  const copyRecord = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedRecordIdx(idx);
    playSound('soft');
    setTimeout(() => setCopiedRecordIdx(null), 2000);
  };

  const copyJson = () => {
    if (!rawJson) return;
    navigator.clipboard.writeText(JSON.stringify(rawJson, null, 2));
    setCopiedJson(true);
    playSound('soft');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // Extract answer records
  const answers: DnsRecord[] = (rawJson?.Answer || []).map(a => ({
    name: a.name,
    type: a.type,
    typeName: TYPE_NAME_MAP[a.type] || `TYPE-${a.type}`,
    TTL: a.TTL,
    data: a.data
  }));

  const authorities: DnsRecord[] = (rawJson?.Authority || []).map(a => ({
    name: a.name,
    type: a.type,
    typeName: TYPE_NAME_MAP[a.type] || `TYPE-${a.type}`,
    TTL: a.TTL,
    data: a.data
  }));

  const statusInfo = rawJson !== null ? DNS_STATUS_MAP[rawJson.Status] || {
    text: `CODE ${rawJson.Status}`,
    color: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
    desc: 'Unknown DNS response code'
  } : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
              title="Return to Grid"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              Client-Side DNS Field & Domain Attribute Inspector
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                DNS-over-HTTPS (DoH)
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Live native browser DoH resolver querying Cloudflare & Google public DNS JSON endpoints
            </p>
          </div>
        </div>

        {/* Provider Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400">DoH Resolver:</span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => { setProvider('cloudflare'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                provider === 'cloudflare' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 dark:text-white/60'
              }`}
            >
              Cloudflare (1.1.1.1)
            </button>
            <button
              onClick={() => { setProvider('google'); playSound('click'); }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                provider === 'google' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-600 dark:text-white/60'
              }`}
            >
              Google (8.8.8.8)
            </button>
          </div>
        </div>
      </div>

      {/* Input Form & Record Type Pills */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter domain or hostname (e.g., github.com)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Inspect DNS</span>
          </button>
        </form>

        {/* Record Type Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'CAA'] as RecordType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                recordType === type
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs">
          <span className="font-bold text-slate-400 dark:text-white/40 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Presets:
          </span>
          {SAMPLE_DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setDomainInput(domain);
                executeLookup(domain, recordType);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-blue-500/10 text-slate-700 dark:text-white/70 hover:text-blue-500 transition-colors cursor-pointer"
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Error View */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Lookup Failed</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Status Bar & Latency Indicator */}
      {rawJson && statusInfo && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Response Code</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Round-Trip Latency</span>
            <span className="text-base font-black text-slate-800 dark:text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-4 h-4 text-blue-500" />
              {latencyMs !== null ? `${latencyMs} ms` : '—'}
            </span>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">DNSSEC Validation</span>
            <span className={`text-base font-black flex items-center gap-1 mt-0.5 ${rawJson.AD ? 'text-emerald-500' : 'text-slate-400'}`}>
              <ShieldCheck className="w-4 h-4" />
              {rawJson.AD ? 'Authenticated' : 'Standard'}
            </span>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Answers Found</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
              {answers.length} records
            </span>
          </div>
        </div>
      )}

      {/* Answers Record Table */}
      {rawJson && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden space-y-0">
          <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                Resolved DNS Records for &quot;{domainInput}&quot; ({recordType})
              </h3>
            </div>
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-xs font-semibold text-blue-500 hover:underline cursor-pointer"
            >
              {showRawJson ? 'Hide Raw JSON' : 'View Raw JSON'}
            </button>
          </div>

          {answers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-white/40 space-y-1">
              <p className="text-sm font-semibold">No {recordType} records found for this domain.</p>
              <p className="text-xs">The server returned status {statusInfo?.text}. Try querying &quot;A&quot;, &quot;NS&quot;, or &quot;TXT&quot; records.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="bg-slate-100/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/40 border-b border-slate-200/60 dark:border-white/5">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Host / Name</th>
                    <th className="py-2.5 px-4 font-semibold">Type</th>
                    <th className="py-2.5 px-4 font-semibold">TTL</th>
                    <th className="py-2.5 px-4 font-semibold">Data / IP Target</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {answers.map((rec, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                        {rec.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {rec.typeName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-white/60">
                        {rec.TTL}s
                      </td>
                      <td className="py-3 px-4 text-blue-600 dark:text-blue-300 font-bold break-all">
                        {rec.data}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => copyRecord(rec.data, index)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 hover:bg-blue-500 hover:text-white transition-all text-[11px] font-bold cursor-pointer"
                        >
                          {copiedRecordIdx === index ? 'Copied' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Authority Records (if any) */}
          {authorities.length > 0 && (
            <div className="border-t border-slate-200/80 dark:border-white/10 p-4 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                Authority Records (SOA / NS)
              </span>
              <div className="space-y-1">
                {authorities.map((auth, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] font-mono text-xs text-slate-700 dark:text-white/80 break-all">
                    <span className="font-bold text-indigo-500 mr-2">{auth.typeName}</span>
                    {auth.data}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Accordion */}
          {showRawJson && (
            <div className="p-4 bg-slate-950 border-t border-white/10">
              <div className="flex items-center justify-between pb-2 text-xs text-slate-400 border-b border-white/10">
                <span>DNS-over-HTTPS Raw Payload</span>
                <button
                  onClick={copyJson}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied Payload!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="pt-3 text-[11px] font-mono text-blue-300 overflow-x-auto max-h-60 leading-relaxed">
                {JSON.stringify(rawJson, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 text-xs text-slate-600 dark:text-blue-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p>
          <strong>RFC 8484 DNS-over-HTTPS:</strong> Encrypted DNS queries are executed directly from your browser to public DoH resolvers without routing through any intermediate proxies. Zero logging, 100% private.
        </p>
      </div>
    </div>
  );
};
