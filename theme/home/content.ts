export interface HomeContent {
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  description: string;
  tryCommand: string;
  tryCopy: string;
  tryCopied: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
}

/** Locale-neutral internal paths — language prefix applied at render time. */
const GUIDE_START = '/guide/start/getting-started';
const GITHUB = 'https://github.com/yunxinx/hunea-docs';

export const homeContent = {
  en: {
    titleBefore: 'Hunea',
    titleAccent: 'built for',
    titleAfter: ' your workflow.',
    description:
      'Building a polished, easy-to-use terminal agent experience.',
    tryCommand: 'npm install -g hunea@alpha',
    tryCopy: 'Copy',
    tryCopied: 'Copied',
    primaryCta: {
      text: 'Getting Started',
      href: GUIDE_START,
    },
    secondaryCta: {
      text: 'View on GitHub',
      href: GITHUB,
    },
  },
  zh: {
    titleBefore: 'Hunea',
    titleAccent: '贴合你的',
    titleAfter: '工作流',
    description: '致力于打造美观易用的终端 Agent 体验',
    tryCommand: 'npm install -g hunea@alpha',
    tryCopy: '复制',
    tryCopied: '已复制',
    primaryCta: {
      text: '快速开始',
      href: GUIDE_START,
    },
    secondaryCta: {
      text: '在 GitHub 上查看',
      href: GITHUB,
    },
  },
} as const satisfies Record<string, HomeContent>;

export type HomeLocale = keyof typeof homeContent;

export function getHomeContent(lang: string): HomeContent {
  if (lang in homeContent) {
    return homeContent[lang as HomeLocale];
  }
  return homeContent.zh;
}

/**
 * Prefix internal absolute paths with the active locale when needed.
 * Default lang (zh) has no prefix; other locales become /{lang}/...
 */
export function localizeHref(
  href: string,
  lang: string,
  defaultLang = 'zh',
): string {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href;
  }
  if (!lang || lang === defaultLang) {
    return href;
  }
  if (href === `/${lang}` || href.startsWith(`/${lang}/`)) {
    return href;
  }
  return `/${lang}${href}`;
}
