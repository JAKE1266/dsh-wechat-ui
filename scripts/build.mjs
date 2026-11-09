#!/usr/bin/env node
/**
 * 把 src/tokens.mjs + src/client.mjs 打包成 client/client.js。
 *
 * 为什么自己写一个 60 行的打包器，而不是 tsdown / esbuild：
 *   - 本包**零依赖**，`npm install` 都不需要；发到 GitHub 上 clone 下来
 *     直接 `node scripts/build.mjs` 就能产出可安装的产物。
 *   - 源码只有两个 ESM 文件、无 JSX、无外部 import，内联足够。
 *   - 产物必须是 DSH 客户端约定的「工厂式 CJS 模块」：
 *     `window.__ModuleLoader__.load({ id, factory(require){ ... } })`。
 *
 * 产物随仓库提交（client/client.js），因此 `dsh plugin add` / GitHub 安装
 * 都不需要触发任何构建或 prepare 脚本。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const outFile = join(root, 'client', 'client.js')

const tokensSrc = readFileSync(join(root, 'src', 'tokens.mjs'), 'utf8')
const clientSrc = readFileSync(join(root, 'src', 'client.mjs'), 'utf8')

// ── 1. 把 tokens.mjs 的 ESM 导出转成 CJS 内部的局部声明 ──────────────────
const exportNames = []
let tokensBody = tokensSrc
  // export const NAME = ...  /  export function NAME(
  .replace(/^export\s+(const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)/gm, (_m, kind, name) => {
    exportNames.push(name)
    return `${kind} ${name}`
  })
  // export { a, b } —— 本仓库未使用，遇到就显式报错，避免静默丢失导出
if (/^export\s*\{/m.test(tokensBody)) {
  throw new Error('build: tokens.mjs 使用了 `export { ... }`，打包器暂不支持，请改成具名导出')
}
if (exportNames.length === 0) {
  throw new Error('build: 没有从 tokens.mjs 解析到任何导出')
}

const tokensModule = `const __TOKENS__ = (() => {
${tokensBody}
return { ${exportNames.join(', ')} };
})();`

// ── 2. 把 client.mjs 的 require('./tokens.mjs') 换成上面那个模块对象 ──────
const requirePattern = /require\(\s*['"]\.\/tokens\.mjs['"]\s*\)/g
const requireCount = (clientSrc.match(requirePattern) ?? []).length
if (requireCount === 0) {
  throw new Error("build: client.mjs 里找不到 require('./tokens.mjs')，源码与打包器已不同步")
}
let clientBody = clientSrc.replace(requirePattern, '__TOKENS__')

// 确保 client.mjs 没有别的 require（有就说明引入了外部依赖，必须显式处理）
const leftover = [...clientBody.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1])
if (leftover.length > 0) {
  throw new Error(`build: client.mjs 存在未处理的外部 require: ${leftover.join(', ')}`)
}

// ── 3. 组装工厂式 CJS 模块 ────────────────────────────────────────────────
const banner = `/* dsh-wechat-ui — 自动生成，请勿直接编辑。
 * 源码：src/tokens.mjs + src/client.mjs
 * 生成：node scripts/build.mjs
 */`

const output = `${banner}
window.__ModuleLoader__.load({
\tid: 'dsh-wechat-ui',
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

${indent(tokensModule, 2)}

${indent(clientBody, 2)}

\t\treturn module.exports;
\t}
});
`

function indent(text, tabs) {
  const pad = '\t'.repeat(tabs)
  return text
    .split('\n')
    .map((line) => (line.length > 0 ? pad + line : line))
    .join('\n')
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, output, 'utf8')
console.log(`build: wrote ${outFile} (${output.length} bytes, ${exportNames.length} token exports)`)
