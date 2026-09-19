import React, { useState } from 'react';
import { API_BASE } from '../api.js';

function CodeBlock({ label, code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — button just won't confirm, no big deal
    }
  };

  return (
    <div className="rounded-[16px] overflow-hidden border border-outline-variant/20 dark:border-night-border bg-[#1B1626] dark:bg-night-bg">
      <div className="flex items-center justify-between px-md py-sm border-b border-white/10">
        <span className="font-label-sm text-label-sm text-white/60 uppercase tracking-wide">{label}</span>
        <button
          onClick={copy}
          className="font-label-sm text-label-sm text-white/70 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-md py-md overflow-x-auto text-[13px] leading-relaxed text-white/90 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ParamRow({ name, type, required, desc }) {
  return (
    <tr className="border-b border-outline-variant/15 dark:border-night-border last:border-0">
      <td className="py-3 pr-md font-mono text-sm text-primary dark:text-night-primary whitespace-nowrap">{name}</td>
      <td className="py-3 pr-md text-sm text-on-surface-variant dark:text-night-muted whitespace-nowrap">{type}</td>
      <td className="py-3 pr-md text-sm whitespace-nowrap">
        {required ? (
          <span className="text-error dark:text-error font-medium">required</span>
        ) : (
          <span className="text-on-surface-variant dark:text-night-muted">optional</span>
        )}
      </td>
      <td className="py-3 text-sm text-on-surface-variant dark:text-night-muted">{desc}</td>
    </tr>
  );
}

const SAMPLE_RESPONSE = `{
  "query": "radha krishna",
  "count": 25,
  "total": 25,
  "requested": 25,
  "results": [
    {
      "id": "1119144576271839341",
      "title": "Radha Rani \u2764\ufe0f",
      "description": "Radhe Radhe",
      "thumb": "https://i.pinimg.com/474x/....jpg",
      "large": "https://i.pinimg.com/originals/....jpg",
      "width": 1224,
      "height": 1632,
      "author": "Crunchyroll",
      "likes": 20,
      "mediaType": "image",
      "sourceUrl": "https://www.pinterest.com/pin/1119144576271839341/"
    }
    // ...more results
  ]
}`;

export default function ApiPage() {
  const [tryQuery, setTryQuery] = useState('radha krishna');
  const [tryCount, setTryCount] = useState(6);
  const [tryLoading, setTryLoading] = useState(false);
  const [tryError, setTryError] = useState('');
  const [tryResult, setTryResult] = useState(null);

  const endpoint = `${API_BASE}/api/v1/search`;

  const curl = `curl "${endpoint}?q=radha%20krishna&count=25"`;
  const js = `const res = await fetch(
  "${endpoint}?q=radha+krishna&count=25"
);
const data = await res.json();
console.log(data.results);`;
  const python = `import requests

r = requests.get(
    "${endpoint}",
    params={"q": "radha krishna", "count": 25},
)
data = r.json()
print(data["results"])`;

  const runTry = async (e) => {
    e.preventDefault();
    const term = tryQuery.trim();
    if (!term) return;
    setTryLoading(true);
    setTryError('');
    setTryResult(null);
    try {
      const params = new URLSearchParams({ q: term, count: String(tryCount) });
      const res = await fetch(`${API_BASE}/api/v1/search?${params.toString()}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Request failed');
      setTryResult(body);
    } catch (err) {
      setTryError(err.message || 'Request failed');
    } finally {
      setTryLoading(false);
    }
  };

  return (
    <section className="pb-3xl">
      {/* Header */}
      <header className="max-w-3xl mx-auto text-center mb-2xl pt-xl animate-rise-in">
        <span className="font-label-md text-label-sm text-primary dark:text-night-primary bg-primary-container/50 dark:bg-night-primary/10 rounded-full px-4 py-1.5 inline-block mb-md">
          Free · public · no signup
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-[44px] text-on-background dark:text-night-text mb-md">
          The ShreeVibe search API
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant dark:text-night-muted">
          The same image search that powers this site, open for anyone to call.
          No API key, no account, no cost — just a generous rate limit so it
          stays fast for everyone.
        </p>
      </header>

      {/* Quick facts */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-md max-w-4xl mx-auto mb-2xl animate-rise-in"
        style={{ animationDelay: '80ms' }}
      >
        {[
          { icon: 'key_off', label: 'No API key required' },
          { icon: 'bolt', label: '30 requests / minute / IP' },
          { icon: 'public', label: 'Open CORS — call it from any app' },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-sm rounded-[16px] border border-outline-variant/20 dark:border-night-border bg-surface-container-low dark:bg-night-surface px-md py-md"
          >
            <span className="material-symbols-outlined text-primary dark:text-night-primary">{f.icon}</span>
            <span className="font-label-md text-label-md text-on-surface dark:text-night-text">{f.label}</span>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-2xl">
        {/* Endpoint + params */}
        <div className="animate-rise-in" style={{ animationDelay: '120ms' }}>
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-md">
            Endpoint
          </h2>
          <div className="flex items-center gap-sm bg-surface-container dark:bg-night-surface rounded-full px-md py-2.5 mb-lg font-mono text-sm text-on-surface dark:text-night-text overflow-x-auto">
            <span className="text-primary dark:text-night-primary font-semibold shrink-0">GET</span>
            <span className="whitespace-nowrap">{endpoint}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30 dark:border-night-border">
                  <th className="py-2 pr-md font-label-sm text-label-sm text-on-surface-variant dark:text-night-muted uppercase">Param</th>
                  <th className="py-2 pr-md font-label-sm text-label-sm text-on-surface-variant dark:text-night-muted uppercase">Type</th>
                  <th className="py-2 pr-md font-label-sm text-label-sm text-on-surface-variant dark:text-night-muted uppercase"></th>
                  <th className="py-2 font-label-sm text-label-sm text-on-surface-variant dark:text-night-muted uppercase">Description</th>
                </tr>
              </thead>
              <tbody>
                <ParamRow name="q" type="string" required desc="Search term, e.g. 'radha krishna' or 'mountain wallpaper'." />
                <ParamRow name="count" type="integer" desc="How many images to return. Default 25, max 150." />
              </tbody>
            </table>
          </div>
        </div>

        {/* Code samples */}
        <div className="animate-rise-in" style={{ animationDelay: '160ms' }}>
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-md">
            Try it from your code
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
            <CodeBlock label="curl" code={curl} />
            <CodeBlock label="JavaScript" code={js} />
            <CodeBlock label="Python" code={python} />
          </div>
        </div>

        {/* Sample response */}
        <div className="animate-rise-in" style={{ animationDelay: '200ms' }}>
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-md">
            Sample response
          </h2>
          <CodeBlock label="200 OK" code={SAMPLE_RESPONSE} />
        </div>

        {/* Live try-it */}
        <div className="animate-rise-in" style={{ animationDelay: '240ms' }}>
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary dark:text-night-primary">play_circle</span>
            Try it right here
          </h2>
          <form onSubmit={runTry} className="flex flex-col sm:flex-row gap-sm mb-lg">
            <input
              className="flex-1 bg-surface-container-low dark:bg-night-surface border border-outline-variant dark:border-night-border rounded-full py-3 px-5 text-on-background dark:text-night-text placeholder:text-outline dark:placeholder:text-night-muted focus:border-primary dark:focus:border-night-primary outline-none transition-colors"
              placeholder="Search term..."
              value={tryQuery}
              onChange={(e) => setTryQuery(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="24"
              className="sm:w-28 bg-surface-container-low dark:bg-night-surface border border-outline-variant dark:border-night-border rounded-full py-3 px-5 text-on-background dark:text-night-text outline-none focus:border-primary dark:focus:border-night-primary transition-colors"
              value={tryCount}
              onChange={(e) => setTryCount(e.target.value)}
              aria-label="Count"
            />
            <button
              type="submit"
              disabled={tryLoading}
              className="bg-primary dark:bg-night-primary text-on-primary dark:text-night-on-primary rounded-full px-6 py-3 font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 shrink-0"
            >
              {tryLoading ? 'Searching…' : 'Run request'}
            </button>
          </form>

          {tryError && (
            <div className="bg-error-container dark:bg-night-surface-2 text-on-error-container dark:text-night-text rounded-xl px-md py-sm text-sm mb-md">
              {tryError}
            </div>
          )}

          {tryResult && (
            <>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-night-muted mb-md">
                {tryResult.count} results for &ldquo;{tryResult.query}&rdquo;
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-sm">
                {tryResult.results.slice(0, 12).map((img) => (
                  <a
                    key={img.id}
                    href={img.sourceUrl || img.large}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-square rounded-xl overflow-hidden bg-surface-container dark:bg-night-surface animate-pop-in"
                  >
                    <img src={img.thumb} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fair use */}
        <div
          className="rounded-[18px] bg-surface-container-low dark:bg-night-surface border border-outline-variant/20 dark:border-night-border p-lg animate-rise-in"
          style={{ animationDelay: '280ms' }}
        >
          <h2 className="font-headline-md text-headline-md text-on-background dark:text-night-text mb-sm">
            Fair use
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-night-muted">
            This API is free because we'd rather people build with it than
            work around it. Keep requests within the published rate limit,
            cache results where it makes sense, and attribute images back to
            their original source when you display them. If you need a
            higher limit for a real project, reach out and we'll work
            something out.
          </p>
        </div>
      </div>
    </section>
  );
}
