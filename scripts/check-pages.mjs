#!/usr/bin/env node
/* 溧水街镇 · 页面自检
 *
 * 检查构建产物的语言互指、canonical 与 hreflang、主题脚本与切换按钮、
 * 英文页界面文字是否残留中文。实现由共享底座 lishui-kit 提供。
 *
 * 用法：npm run build && node scripts/check-pages.mjs
 */

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkPages } from 'lishui-kit/validate/pages.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { pages, problems } = checkPages(resolve(REPO, 'dist'));

console.log(`页面 ${pages} 个，问题 ${problems.length} 项`);
for (const p of problems) console.log(`  ${p.file}  ${p.msg}`);
process.exit(problems.length ? 1 : 0);
