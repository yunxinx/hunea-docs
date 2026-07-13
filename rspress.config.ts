import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Hunea',
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
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/yunxinx/hunea',
      },
    ],
  },
});
