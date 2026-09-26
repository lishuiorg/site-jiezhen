/* 站点构建配置
 *
 * 纯静态输出：内容库的 Markdown 在构建时渲染成 HTML，产物不依赖数据库与客户端框架。
 * 页面路径由 src/pages/ 的目录结构决定，中文在根路径、英文在 /en/ 下，两者一一对应。
 *
 * lishui-kit 以 file: 依赖装在 node_modules 下，是符号链接；
 * preserveSymlinks 让 Vite 按链接路径解析，避免把 node_modules 之外的真实路径
 * 当成项目外文件处理。
 */

import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jiezhen.lishui.org',
  output: 'static',
  build: { format: 'directory' },
  vite: {
    resolve: { preserveSymlinks: true },
    server: { fs: { allow: ['..'] } },
  },
});
