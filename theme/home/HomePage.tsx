import { useLang } from '@rspress/core/runtime';
import { Link } from '@rspress/core/theme';
import { useCallback, useState } from 'react';
import { getHomeContent, type HomeContent, localizeHref } from './content';
import { HeroShaders } from './HeroShaders';
import './HomePage.css';

function useHomeContent(): HomeContent {
  const lang = useLang();
  return getHomeContent(lang);
}

function useLocalizedHref() {
  const lang = useLang();
  return useCallback((href: string) => localizeHref(href, lang, 'zh'), [lang]);
}

function InstallCommand({
  command,
  copyLabel,
  copiedLabel,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in insecure contexts.
    }
  }, [command]);

  return (
    <button
      type="button"
      className={`fd-cmd${copied ? ' fd-cmd--copied' : ''}`}
      onClick={onCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      title={copied ? copiedLabel : copyLabel}
    >
      <code className="fd-cmd__code">
        <span className="fd-cmd__prompt" aria-hidden="true">
          $
        </span>
        <span className="fd-cmd__text">{command}</span>
      </code>
      <span className="fd-cmd__action" aria-hidden="true">
        {copied ? (
          <svg
            className="fd-cmd__icon"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M3.5 8.5 6.5 11.5 12.5 4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="fd-cmd__icon"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              x="5.25"
              y="5.25"
              width="7.5"
              height="7.5"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path
              d="M10.75 5.25V4A1.25 1.25 0 0 0 9.5 2.75H4A1.25 1.25 0 0 0 2.75 4v5.5A1.25 1.25 0 0 0 4 10.75h1.25"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}

export function HomePage() {
  const content = useHomeContent();
  const toHref = useLocalizedHref();

  return (
    <div className="fd-home">
      <section className="fd-hero" aria-labelledby="fd-hero-title">
        <HeroShaders />
        <div className="fd-hero__inner">
          <h1 id="fd-hero-title" className="fd-hero__title">
            {content.titleBefore}
            <br />
            <span className="fd-hero__accent">{content.titleAccent}</span>{' '}
            {content.titleAfter}
          </h1>
          <p className="fd-hero__desc">{content.description}</p>

          <InstallCommand
            command={content.tryCommand}
            copyLabel={content.tryCopy}
            copiedLabel={content.tryCopied}
          />

          <div className="fd-hero__actions">
            <Link
              className="fd-btn fd-btn--primary"
              href={toHref(content.primaryCta.href)}
            >
              {content.primaryCta.text}
            </Link>
            <Link
              className="fd-btn fd-btn--ghost"
              href={content.secondaryCta.href}
            >
              {content.secondaryCta.text}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
