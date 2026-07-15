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
        content: 'https://github.com/yunxinx/hunea-docs',
      },
      {
        // LINUX DO 友情链接：自定义站点 logo，放在 GitHub 图标旁
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 90 90" width="100%" height="100%" role="img" aria-label="LINUX DO"><circle fill="#efefef" cx="50" cy="50" r="45"/><path fill="#feb005" d="M50,92.3c16.64,0,31.03-9.61,37.94-23.57H12.06c6.91,13.97,21.3,23.57,37.94,23.57Z"/><path fill="#1e1e20" d="M50,7.7c-16.64,0-31.03,9.61-37.94,23.57h75.88c-6.91-13.97-21.3-23.57-37.94-23.57Z"/></svg>',
        },
        mode: 'link',
        content: 'https://linux.do',
      },
    ],
  },
});
