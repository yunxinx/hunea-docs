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
const GITHUB = 'https://github.com/yunxinx/hunea';

export const homeContent = {
  en: {
    titleBefore: 'A terminal AI assistant,',
    titleAccent: 'your',
    titleAfter: 'workflow.',
    description:
      'A terminal-based AI assistant client built with Rust and Ratatui. Official documentation for Hunea.',
    tryCommand: 'npm install --global hunea',
    tryCopy: 'Copy',
    tryCopied: 'Copied',
    primaryCta: {
      text: 'Getting Started',
      href: GUIDE_START,
    },
    secondaryCta: {
      text: 'Open GitHub',
      href: GITHUB,
    },
  },
  zh: {
    titleBefore: '终端 AI 助手，',
    titleAccent: '贴合你的',
    titleAfter: '工作流。',
    description:
      '基于 Rust + Ratatui 构建的终端 AI 助手客户端。Hunea 官方文档。',
    tryCommand: 'npm install --global hunea',
    tryCopy: '复制',
    tryCopied: '已复制',
    primaryCta: {
      text: '快速开始',
      href: GUIDE_START,
    },
    secondaryCta: {
      text: '打开 GitHub',
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
