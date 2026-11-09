#!/usr/bin/env node
/**
 * dsh-wechat-ui — 自包含验证套件（零依赖）
 *
 * 覆盖：
 *   1. 产物存在且是有效的 JS（用 vm 在沙箱里真实执行一遍）
 *   2. 工厂注册了正确的 id，导出了 apply / inject
 *   3. 生成的 CSS 含亮/暗两套令牌块、特异性前缀、结构令牌、关键品牌色
 *   4. 亮/暗令牌键集合完全一致（避免暗色漏改某个变量）
 *   5. 样式注入幂等、卸载可完整回收（用最小 DOM 桩）
 *   6. apply 在任何宿主异常下都不抛错（降级为哑模块，不白屏）
 *   7. manifest 字段自洽（exports 指向真实文件、patch 存在）
 */
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

let passed = 0
const ok = (name) => {
  passed += 1
  console.log(`  ✓ ${name}`)
}

// ── 1. 产物语法 + 工厂注册 ────────────────────────────────────────────────
const clientCode = read('client/client.js')
let registration = null
const sandbox = {
  window: {
    __ModuleLoader__: {
      load: (reg) => {
        registration = reg
      },
    },
  },
  console,
  Symbol,
  Object,
  Array,
  String,
  Number,
  JSON,
  Math,
  MutationObserver: undefined,
  requestAnimationFrame: (fn) => fn(),
}
vm.createContext(sandbox)
vm.runInContext(clientCode, sandbox, { filename: 'client/client.js' })
assert.ok(registration, 'client.js 必须调用 __ModuleLoader__.load')
assert.equal(registration.id, 'dsh-wechat-ui')
assert.equal(typeof registration.factory, 'function')
ok('产物是有效 JS 且正确注册了工厂式 CJS 模块')

// ── 2. 工厂导出契约 ────────────────────────────────────────────────────────
const mod = registration.factory(() => ({}))
assert.equal(typeof mod.apply, 'function', '必须导出 apply')
// 注意：mod 来自 vm 沙箱，其数组原型与外界不同，不能用 deepStrictEqual 比较。
assert.ok(Array.isArray(mod.inject), '必须导出 inject 数组')
assert.equal(mod.inject.length, 0, '纯皮肤插件不应声明硬依赖 service')
assert.equal(typeof mod.installSkin, 'function')
assert.equal(typeof mod.markHostSurfaces, 'function')
ok('工厂导出 apply / inject / installSkin / markHostSurfaces，且无硬依赖')

// ── 3. CSS 产物内容 ────────────────────────────────────────────────────────
const css = (() => {
  // 从工厂内部拿 renderSkinCss：通过一个带钩子的 require 重新执行
  let captured = null
  const instrumented = clientCode.replace(
    'return module.exports;',
    'module.exports.__renderSkinCss = __TOKENS__.renderSkinCss; module.exports.__tokens = { LIGHT: __TOKENS__.LIGHT, DARK: __TOKENS__.DARK, STRUCTURAL: __TOKENS__.STRUCTURAL, WIN_LIGHT: __TOKENS__.WIN_LIGHT, WIN_DARK: __TOKENS__.WIN_DARK, MAC_LIGHT: __TOKENS__.MAC_LIGHT, MAC_DARK: __TOKENS__.MAC_DARK }; return module.exports;',
  )
  const sb = { ...sandbox, window: { __ModuleLoader__: { load: (r) => { captured = r } } } }
  vm.createContext(sb)
  vm.runInContext(instrumented, sb)
  const m = captured.factory(() => ({}))
  return { text: m.__renderSkinCss(), tokens: m.__tokens }
})()

assert.ok(css.text.includes(':root:root body{'), '缺少亮色令牌块')
assert.ok(css.text.includes(':root:root body[data-ds-dark-theme]{'), '缺少暗色令牌块')
assert.ok(css.text.includes('color-scheme:light') && css.text.includes('color-scheme:dark'))
assert.ok(css.text.includes('--dsw-radius-full:4px'), '缺少微信式小圆角令牌')
assert.ok(css.text.includes('--dsw-font-size-base'), '缺少字号令牌')
assert.ok(css.text.includes('[data-composer-card]'), '缺少输入框结构规则')
assert.ok(css.text.includes('prefers-reduced-motion'), '缺少减少动效适配')
assert.ok(css.text.includes('[data-chat-flow-kind="assistant"]'), '缺少微信对话布局层')
assert.ok(css.text.includes('[data-message-bubble]'), '缺少用户气泡锚点')
assert.ok(!/.[A-Za-z0-9]{6}_[A-Za-z]/.test(css.text), '布局层不得依赖 CSS Module 哈希类名')
ok('CSS 含亮/暗双主题块、结构令牌、输入框规则与 reduced-motion 适配')

// ── 4. 亮/暗键集合一致 ─────────────────────────────────────────────────────
const lightKeys = Object.keys(css.tokens.LIGHT).sort()
const darkKeys = Object.keys(css.tokens.DARK).sort()
assert.equal(
  darkKeys.join('\n'),
  lightKeys.join('\n'),
  `亮/暗令牌键不一致：\n仅在 LIGHT: ${lightKeys.filter((k) => !darkKeys.includes(k))}\n仅在 DARK: ${darkKeys.filter((k) => !lightKeys.includes(k))}`,
)
assert.ok(lightKeys.length >= 150, `令牌数量偏少 (${lightKeys.length})，可能漏改了大量官方区域`)
ok(`亮/暗令牌键集合完全一致（${lightKeys.length} 个语义令牌）`)

// 品牌色必须是实测的微信蓝，不是推测的蓝紫
assert.ok(css.tokens.LIGHT['--dsw-alias-brand-primary'].startsWith('#'), '品牌主色必须是具体色值')
ok(`亮色品牌主色 = ${css.tokens.LIGHT['--dsw-alias-brand-primary']}，暗色 = ${css.tokens.DARK['--dsw-alias-brand-primary']}`)

// 所有值都必须是合法的 CSS 声明值（不为空、不含换行/分号注入）
for (const [paletteName, palette] of [['LIGHT', css.tokens.LIGHT], ['DARK', css.tokens.DARK], ['STRUCTURAL', css.tokens.STRUCTURAL], ['WIN_LIGHT', css.tokens.WIN_LIGHT], ['WIN_DARK', css.tokens.WIN_DARK], ['MAC_LIGHT', css.tokens.MAC_LIGHT], ['MAC_DARK', css.tokens.MAC_DARK]]) {
  for (const [key, value] of Object.entries(palette)) {
    assert.match(key, /^--[a-z0-9-]+$/, `${paletteName} 非法变量名 ${key}`)
    assert.equal(typeof value, 'string', `${paletteName}.${key} 必须是字符串`)
    assert.ok(value.length > 0 && !/[\n;{}]/.test(value), `${paletteName}.${key} 非法值: ${value}`)
  }
}
ok('全部令牌名合法、值无注入风险')

// 平台变体：Windows / macOS 四张表键集一致，选择器互斥且特异性足够
{
  const t = css.tokens
  const keySets = ['WIN_LIGHT', 'WIN_DARK', 'MAC_LIGHT', 'MAC_DARK'].map((n) => Object.keys(t[n]).sort().join('\n'))
  assert.ok(keySets.every((k) => k === keySets[0]), '平台变体键集合不一致')
  assert.ok(css.text.includes(':root[data-platform="win32"]:root body:not([data-ds-dark-theme])'), '缺少 Windows 亮色块')
  assert.ok(css.text.includes(':root[data-platform="darwin"]:root body[data-ds-dark-theme]'), '缺少 macOS 暗色块')
  ok(`Windows/macOS 平台变体键集一致（${Object.keys(t.WIN_LIGHT).length} 个差异键 × 4 表）`)
}

// ── 5. 样式注入幂等 + 卸载回收 ─────────────────────────────────────────────
function makeDomStub() {
  const head = { children: [], appendChild(n) { this.children.push(n) } }
  const rootAttrs = new Map()
  const doc = {
    head,
    body: { querySelectorAll: () => [] },
    documentElement: {
      getAttribute: (k) => (rootAttrs.has(k) ? rootAttrs.get(k) : null),
      setAttribute: (k, v) => rootAttrs.set(k, v),
      removeAttribute: (k) => rootAttrs.delete(k),
    },
    createElement: () => ({ dataset: {}, textContent: '', remove() { this.__removed = true } }),
    querySelector: (sel) => head.children.find((n) => n.dataset.pluginCss === 'dsh-wechat-ui/skin.css') ?? null,
  }
  return { doc, head, rootAttrs }
}

{
  const { doc, head, rootAttrs } = makeDomStub()
  const dispose = mod.installSkin(doc)
  assert.equal(head.children.length, 1, '第一次安装应插入一个 style')
  assert.equal(head.children[0].dataset.plugin, 'dsh-wechat-ui')
  assert.equal(head.children[0].dataset.pluginCss, 'dsh-wechat-ui/skin.css')
  assert.equal(rootAttrs.get('data-dsh-wechat-skin'), '1.3.0')
  const first = head.children[0]
  const dispose2 = mod.installSkin(doc)
  assert.equal(head.children.length, 1, '重复安装不得重复插入 style')
  assert.equal(head.children[0], first, '重复安装应复用同一个 style 标签')
  dispose2()
  dispose()
  assert.equal(first.__removed, true, '卸载必须移除 style')
  assert.equal(rootAttrs.has('data-dsh-wechat-skin'), false, '卸载必须还原 <html> 标记')
  ok('样式注入幂等，ctx.effect 卸载可完整回收')

  const noDoc = mod.installSkin(undefined)
  assert.equal(typeof noDoc, 'function')
  noDoc()
  ok('无 document 环境（SSR / 测试）安全降级为空操作')
}

// ── 6. apply 的容错（不能带崩宿主） ────────────────────────────────────────
{
  const dom = makeDomStub()
  globalThis.document = dom.doc
  const contexts = [
    {},
    { effect: null },
    { effect: () => { throw new Error('effect 不可用') } },
    { effect: (fn) => { fn() } },
    { effect: (fn, label) => { assert.equal(typeof label, 'string'); fn() } },
  ]
  for (const ctx of contexts) {
    assert.doesNotThrow(() => mod.apply(ctx), 'apply 在任何宿主形态下都不得抛异常')
  }
  delete globalThis.document
  ok('apply 在 effect 缺失/抛错/无 document 时均安全降级，绝不白屏')
}

// ── 7. manifest 自洽 ─────────────────────────────────────────────────────
{
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.dsh.client.platform, 'web')
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.ok(existsSync(join(root, pkg.exports['.'].default)), 'exports["."] 指向的文件不存在')
  assert.ok(existsSync(join(root, pkg.exports['./client'].default)), 'exports["./client"] 指向的文件不存在')
  assert.ok(existsSync(join(root, 'cordis.patch.yml')))
  assert.ok(existsSync(join(root, 'LICENSE')))
  assert.ok(existsSync(join(root, 'README.md')))
  assert.ok(read('cordis.patch.yml').includes('dsh-wechat-ui'), 'patch 必须挂载本插件行')
  ok('package.json / exports / patch / LICENSE / README 自洽')
}

console.log(`\n✅ ${passed} 项检查全部通过`)
