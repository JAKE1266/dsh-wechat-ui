/**
 * dsh-wechat-ui — 微信风格皮肤 · 浏览器半（源码）
 *
 * 构建产物是 client/client.js：一个由 window.__ModuleLoader__.load 注册的
 * 工厂式 CJS 模块（与官方 ui-* 包、以及 dsh-zcode-ui 等第三方皮肤完全同一套
 * 机制）。构建脚本 scripts/build.mjs 把本文件与 src/tokens.mjs 内联打包，
 * 因此本包**没有运行时依赖、没有构建期框架依赖、不需要 pnpm install**。
 *
 * 设计原则（刻意保守，避免把宿主带崩）：
 *   1. 皮肤只做「CSS 变量覆盖 + 少量与类名无关的结构规则」，不替换任何
 *      React 组件、不注册工具、不碰会话数据、不发起网络请求。
 *   2. 所有平台能力探测与样式注入都包在 try 里；任何一步失败都退化成
 *      一个「隐形的哑模块」——绝不让 loader 的 entry 工厂抛异常
 *      （loader 不隔离工厂：一个工厂抛异常会聚合成 "entries did not
 *      activate"，把整个 Web 壳带崩，这是社区插件最常见的白屏原因）。
 *   3. 不依赖宿主的 CSS Module 哈希类名。所有选择器走 :root / body /
 *      data-* 稳定锚点；找不到锚点时什么都不发生，皮肤其余部分不受影响。
 *   4. 样式标签带 data-plugin / data-plugin-css，遵循 DSH 客户端插件约定，
 *      让 HMR 驱动与卸载流程能正确回收它。
 */

const {
  SKIN_VERSION,
  SKIN_ATTRIBUTE,
  STYLE_TAG_ID,
  renderSkinCss,
} = require('./tokens.mjs')

const PLUGIN_ID = 'dsh-wechat-ui'

/**
 * 安装皮肤样式表。
 *
 * 幂等：同名标签已存在时只替换内容，不重复插入。
 * 返回卸载函数，供 ctx.effect 在插件停用时回收（同时还原 <html> 标记）。
 *
 * @param {Document} doc
 * @returns {() => void}
 */
function installSkin(doc) {
  if (typeof doc === 'undefined' || doc === null || doc.head == null) return () => {}
  let tag = doc.querySelector(`style[data-plugin-css="${STYLE_TAG_ID}"]`)
  if (tag === null) {
    tag = doc.createElement('style')
    tag.dataset.plugin = PLUGIN_ID
    tag.dataset.pluginCss = STYLE_TAG_ID
    doc.head.appendChild(tag)
  }
  tag.textContent = renderSkinCss()

  const root = doc.documentElement
  const previous = root.getAttribute(SKIN_ATTRIBUTE)
  root.setAttribute(SKIN_ATTRIBUTE, SKIN_VERSION)

  return () => {
    try {
      tag?.remove()
      if (previous === null) root.removeAttribute(SKIN_ATTRIBUTE)
      else root.setAttribute(SKIN_ATTRIBUTE, previous)
    } catch {
      /* 卸载时 DOM 可能已经不在了，忽略 */
    }
  }
}

/**
 * 在宿主侧栏/会话区打上 `data-wechat-*` 标记，供样式表作为稳定锚点。
 *
 * 为什么需要：DSH 的组件类名是 CSS Module 内容哈希（形如 `._8HJdBW_group`），
 * 上游每次构建都会变。已有的 dsh-theme-wechat 插件也采用了同一策略：
 * 「主题只能用 data-* 属性选择器，不能依赖宿主类名」。
 *
 * 这里用 MutationObserver 只做「加属性」这一件事，且带短路与节流，
 * 不改动任何元素结构、不注入任何 DOM 节点、不监听业务事件。
 * 观察失败（老浏览器、权限受限）时静默降级：皮肤的变量层依然完整生效。
 */
function markHostSurfaces(doc) {
  if (typeof doc === 'undefined' || doc === null || doc.body == null) return () => {}

  // 这些属性是宿主公开的、跨构建稳定的锚点；我们只是给它们再加一层别名，
  // 以便样式表用统一前缀书写，也便于用户在 DevTools 里排查。
  const ALIASES = [
    ['[data-conversation-scroll]', 'data-wechat-conversation'],
    ['[data-composer-card]', 'data-wechat-composer'],
    ['[data-phase="hero"]', 'data-wechat-hero-phase'],
  ]

  const mark = (root) => {
    try {
      for (const [selector, attr] of ALIASES) {
        const nodes = root.querySelectorAll?.(selector) ?? []
        for (const node of nodes) {
          if (!node.hasAttribute(attr)) node.setAttribute(attr, '')
        }
      }
    } catch {
      /* 单个节点失败不影响其余 */
    }
  }

  mark(doc.body)

  let observer = null
  try {
    if (typeof MutationObserver !== 'undefined') {
      let frame = 0
      observer = new MutationObserver(() => {
        if (frame !== 0) return
        frame = requestAnimationFrame(() => {
          frame = 0
          mark(doc.body)
        })
      })
      observer.observe(doc.body, { childList: true, subtree: true })
    }
  } catch {
    observer = null
  }

  return () => {
    try {
      observer?.disconnect()
    } catch {
      /* ignore */
    }
  }
}

/** 必需服务：无。皮肤不依赖任何宿主 service，因此 inject 为空数组。 */
const inject = []

/**
 * 插件接线。
 *
 * ctx.effect(fn, label) 是 DSH 客户端 Loader 的标准生命周期注册：fn 的返回值
 * 会在插件被卸载 / 热替换时调用。这里把「样式表安装」与「标记观察」都交给它
 * 管理，保证停用插件后官方界面能完整恢复。
 */
function apply(ctx) {
  let undo = []
  try {
    const effect = typeof ctx?.effect === 'function' ? ctx.effect.bind(ctx) : null
    const register = (fn, label) => {
      if (effect !== null) {
        try {
          effect(fn, label)
          return
        } catch {
          /* 某些宿主版本 effect 签名不同，退回直接调用 */
        }
      }
      undo.push(fn())
    }
    register(() => installSkin(globalThis.document), `${PLUGIN_ID}: skin stylesheet`)
    register(() => markHostSurfaces(globalThis.document), `${PLUGIN_ID}: surface markers`)
  } catch (error) {
    try {
      console.warn(`[${PLUGIN_ID}] 皮肤初始化失败，已安全降级：`, error && error.message)
    } catch {
      /* console 不可用时彻底静默 */
    }
    for (const dispose of undo) {
      try {
        dispose?.()
      } catch {
        /* ignore */
      }
    }
  }
}

module.exports = { apply, inject, installSkin, markHostSurfaces, PLUGIN_ID }
