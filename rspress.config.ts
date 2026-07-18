import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig } from '@rspress/core';
import { transformerNotationHighlight } from '@shikijs/transformers';

const linuxdoSvg = fs.readFileSync(
  path.join(__dirname, 'docs/public/linuxdo.svg'),
  'utf-8',
);

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Hunea',
  // 默认语言（zh）站点描述；英文见 locales.en.description
  description: 'Hunea 的官方文档',
  lang: 'zh',
  icon: '/notesites.ico',
  logoText: 'Hunea',
  llms: true,
  locales: [
    {
      lang: 'zh',
      label: '简体中文',
      title: 'Hunea',
      description: 'Hunea 的官方文档',
    },
    {
      lang: 'en',
      label: 'English',
      title: 'Hunea',
      description: 'Official documentation for Hunea',
    },
  ],
  markdown: {
    shiki: {
      transformers: [transformerNotationHighlight()],
    },
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/yunxinx/hunea-docs',
      },
      {
        // LINUX DO 友情链接：SVG 源文件在 docs/public/linuxdo.svg
        icon: {
          svg: linuxdoSvg,
        },
        mode: 'link',
        content: 'https://linux.do',
      },
    ],
  },
});
