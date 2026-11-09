/**
 * dsh-wechat-ui — 微信风格主题令牌
 *
 * 这一层是皮肤的全部「设计值」。DSH Web 的所有官方区域（标题栏、侧栏、会话列、
 * 按钮、菜单、输入框、气泡、代码块）都只消费 `--dsw-alias-*` / `--dsw-static-*`
 * 变量。在变量层替换，等于在不触碰任何业务组件的前提下换掉全站外观 ——
 * 这也是本插件零依赖、不碰会话数据、不注册任何工具的原因。
 *
 * 明暗判定：DSH 用 body[data-ds-dark-theme] 表达暗色（宿主自身的主题设置）。
 * 选择器优先级：统一用 `:root:root` 前缀把亮/暗分别抬到 (0,2,1)/(0,3,1)，
 * 确定性胜出，不依赖样式表加载顺序。
 *
 * ── 色值来源与免责声明 ──────────────────────────────────────────────────
 * 本表是「微信风格」的**再设计**（inspired-by），不是腾讯官方微信设计资产的
 * 逐像素复刻：色值来自对微信桌面版公开界面观感的归纳（微信绿 #07C160、
 * 聊天底 #EDEDED、发送气泡 #95EC69 等广为人知的公开观感值）+ 面向 WCAG
 * 对比度与 DSH 令牌语义的适配，全部为「推导」而非「实测」。
 * 商标、名称归各自所有者所有；本插件与腾讯、微信无任何隶属或背书关系。
 *
 * 关键设计决定（微信辨识度）：
 *   - 品牌主色用「微信绿」#07C160，发送按钮同色；
 *   - 中性色是微信的冷调浅灰（#EDEDED / #F7F7F7），侧栏白面；
 *   - 小圆角、扁平：气泡 8px、卡片 8px、输入框 8px，几乎无阴影；
 *   - 用户气泡是经典的「微信绿」#95EC69（深色文字），AI 回答是白色气泡 ——
 *     通过 --dsw-specific-bubble 实现；
 *   - 深色主题参考微信深色模式：底 #111111、层 #191919、气泡深绿。
 */

/** 皮肤版本：改动令牌口径时递增，便于排查浏览器里挂着的旧样式。 */
export const SKIN_VERSION = '1.3.0'

/** 标记属性，注入到 <html> 上，便于在 DevTools 里确认皮肤已激活。 */
export const SKIN_ATTRIBUTE = 'data-dsh-wechat-skin'

/** 样式标签的稳定标识（去重 + 卸载时回收）。 */
export const STYLE_TAG_ID = 'dsh-wechat-ui/skin.css'

/** 亮色令牌选择器：特异性 (0,2,1)。 */
export const LIGHT_SELECTOR = ':root:root body'

/** 暗色令牌选择器：特异性 (0,3,1)。 */
export const DARK_SELECTOR = ':root:root body[data-ds-dark-theme]'

/**
 * 与主题无关的几何/排版令牌。
 *
 * 微信观感的结构性差异：小圆角（4~8px）、扁平无浮起阴影、14px 字号基线。
 * 字体栈把 CJK 无衬线族前置，贴近微信的中文渲染观感。
 */
export const STRUCTURAL = Object.freeze({
  '--dsw-radius-xs': '2px',
  '--dsw-radius-sm': '4px',
  '--dsw-radius-md': '6px',
  '--dsw-radius-lg': '8px',
  '--dsw-radius-xl': '8px',
  '--dsw-radius-panel': '8px',
  '--dsw-radius-2xl': '12px',
  '--dsw-radius-full': '4px',
  '--dsw-shadow-lv1': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  '--dsw-shadow-lv1-blur': '0 1px 4px 0 rgba(0, 0, 0, 0.04)',
  '--dsw-shadow-lv2': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
  '--dsw-shadow-lv3': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
  '--dsw-font-family':
    '"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei UI", "Microsoft YaHei", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif',
  '--dsh-font-family-code-default':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", "Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", monospace',
  '--dsw-font-size-base': '14px',
  '--dsw-font-size-display': 'calc(var(--dsw-font-size-base) + 20px)',
  '--dsw-font-size-headline': 'calc(var(--dsw-font-size-base) + 8px)',
  '--dsw-font-size-title': 'calc(var(--dsw-font-size-base) + 6px)',
  '--dsw-font-size-xl': 'calc(var(--dsw-font-size-base) + 4px)',
  '--dsw-font-size-lg': 'calc(var(--dsw-font-size-base) + 2px)',
  '--dsw-font-size-caption': 'calc(var(--dsw-font-size-base) - 1px)',
  '--dsw-font-size-sm': 'calc(var(--dsw-font-size-base) - 2px)',
  '--dsw-font-size-xs': 'calc(var(--dsw-font-size-base) - 4px)',
  '--dsw-font-size-2xs': 'calc(var(--dsw-font-size-base) - 5px)',
  '--dsh-scrollbar-width': '8px',
  '--dsh-scrollbar-thumb-border': '2px',
  // 微信私有语义变量：供下面的气泡/输入框规则消费，也方便用户在设置里二次调色。
  '--wx-primary': '#07C160',
  '--wx-primary-hover': '#06AD56',
  '--wx-primary-soft': 'rgba(7, 193, 96, 0.10)',
  '--wx-user-bubble': '#95EC69',
  '--wx-user-bubble-label': '#191919',
  '--wx-composer-radius': '8px',
  '--wx-composer-shadow': 'none',
})

/** 亮色（微信默认）色板。 */
export const LIGHT = Object.freeze({
  // ── 静态中性阶梯（微信冷灰） ──
  '--dsw-static-neutral-bluish-950': '#FFFFFF',
  '--dsw-static-neutral-bluish-875': '#FAFAFA',
  '--dsw-static-neutral-bluish-850': '#F7F7F7',
  '--dsw-static-neutral-bluish-800': '#EDEDED',
  '--dsw-static-neutral-bluish-750': '#E5E5E5',
  '--dsw-static-neutral-bluish-700': '#D9D9D9',
  '--dsw-static-neutral-bluish-600': '#C9C9C9',
  '--dsw-static-neutral-bluish-500': '#B2B2B2',
  '--dsw-static-neutral-bluish-400': '#888888',
  '--dsw-static-neutral-bluish-300': '#666666',
  '--dsw-static-neutral-bluish-200': '#4D4D4D',
  '--dsw-static-neutral-bluish-150': '#E5E5E5',
  '--dsw-static-neutral-bluish-100': '#D9D9D9',
  '--dsw-static-neutral-bluish-75': '#EDEDED',
  '--dsw-static-neutral-bluish-60': '#EDEDED',
  '--dsw-static-neutral-bluish-50': '#F7F7F7',
  '--dsw-static-neutral-bluish-00': '#191919',
  '--dsw-static-neutral-bluish-1000': '#191919',

  // ── 背景 ──
  '--dsw-alias-bg-base': '#EDEDED',
  '--dsw-alias-bg-layer-1': '#FFFFFF',
  '--dsw-alias-bg-layer-2': '#FFFFFF',
  '--dsw-alias-bg-layer-3': '#F7F7F7',
  '--dsw-alias-bg-layer-4': '#EDEDED',
  '--dsw-alias-bg-overlay': '#FFFFFF',
  '--dsw-alias-bg-module-platform': '#F7F7F7',
  '--dsw-alias-bg-multi-select': 'rgba(7, 193, 96, 0.12)',
  '--dsw-alias-bg-l1': '#FFFFFF',
  '--dsw-alias-bg-l2': '#FFFFFF',
  '--dsw-alias-background-secondary': '#F7F7F7',
  '--dsw-alias-bg-document-preview': '#FAFAFA',
  '--dsw-alias-bg-document-selection': 'rgba(7, 193, 96, 0.28)',
  '--dsw-alias-bg-skeleton': 'rgba(0, 0, 0, 0.04)',
  '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.30)',
  '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.12)',
  '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.50)',
  '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.88)',
  '--dsw-alias-bg-mask-drop': 'rgba(255, 255, 255, 0.72)',

  // ── 边框 ──
  '--dsw-alias-border-l1': 'rgba(0, 0, 0, 0.05)',
  '--dsw-alias-border-l2': '#E5E5E5',
  '--dsw-alias-border-subtle': '#E5E5E5',
  '--dsw-alias-border-l2-darkmode-thin': '#E5E5E5',
  '--dsw-alias-border-l3': '#D9D9D9',
  '--dsw-alias-border-l4': '#C9C9C9',
  '--dsw-alias-border-inverted': 'rgba(0, 0, 0, 0.05)',
  '--dsw-alias-border-inverted2': '#E5E5E5',
  '--dsw-alias-separator-primary': '#E5E5E5',

  // ── 文字 ──
  '--dsw-alias-label-primary': '#191919',
  '--dsw-alias-label-primary-foreground': '#FFFFFF',
  '--dsw-alias-label-primary-inverted': '#FFFFFF',
  '--dsw-alias-label-primary-dimmed': 'rgba(25, 25, 25, 0.60)',
  '--dsw-alias-label-primary-bluish': '#191919',
  '--dsw-alias-label-secondary': '#888888',
  '--dsw-alias-label-tertiary': '#B2B2B2',
  '--dsw-alias-label-caption': 'rgba(25, 25, 25, 0.38)',
  '--dsw-alias-label-dimmed': 'rgba(25, 25, 25, 0.32)',
  '--dsw-alias-label-quaternary': 'rgba(25, 25, 25, 0.30)',
  '--dsw-alias-label-error': '#FA5151',
  '--dsw-alias-label-shimmer': 'rgba(0, 0, 0, 0.28)',
  '--dsw-alias-label-document-preview': '#666666',
  '--dsw-alias-menu-icon': '#888888',

  // ── 品牌 / 主色（微信绿） ──
  '--dsw-alias-brand-primary': '#07C160',
  '--dsw-alias-brand-primary-invert': '#FFFFFF',
  '--dsw-alias-brand-text': '#07C160',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': '#07C160',
  '--dsw-alias-state-business-primary': '#07C160',
  '--dsw-alias-state-business-tertiary': 'rgba(7, 193, 96, 0.12)',
  '--dsw-alias-button-primary-fill': '#07C160',
  '--dsw-alias-button-primary-hover': '#06AD56',
  '--dsw-alias-button-primary-dimmed': 'rgba(7, 193, 96, 0.12)',
  '--dsw-alias-button-contrast-fill': '#191919',
  '--dsw-alias-button-elevated-fill': '#FFFFFF',
  '--dsw-alias-button-floating-fill': '#FFFFFF',
  '--dsw-alias-button-floating-hover': '#F7F7F7',
  '--dsw-alias-button-ghost-active-fill': 'rgba(7, 193, 96, 0.12)',
  '--dsw-alias-button-ghost-active-hover': 'rgba(7, 193, 96, 0.18)',
  '--dsw-alias-button-ghost-active-border': 'rgba(7, 193, 96, 0.24)',
  '--dsw-alias-button-info-fill': '#07C160',
  '--dsw-alias-button-info-hover': '#06AD56',
  '--dsw-alias-button-tool-bar-fill': 'rgba(102, 102, 102, 0.45)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(77, 77, 77, 0.32)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(102, 102, 102, 0.60)',

  // ── 交互态 ──
  '--dsw-alias-interactive-bg-hover': 'rgba(0, 0, 0, 0.04)',
  '--dsw-alias-interactive-bg-hover-solid': '#F2F2F2',
  '--dsw-alias-interactive-bg-active': 'rgba(7, 193, 96, 0.10)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(7, 193, 96, 0.10)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(250, 81, 81, 0.06)',
  '--dsw-alias-fill-l1': 'rgba(0, 0, 0, 0.035)',
  '--dsw-alias-fill-l2': 'rgba(0, 0, 0, 0.055)',
  '--dsw-alias-fill-tertiary': 'rgba(0, 0, 0, 0.055)',
  '--dsw-alias-fill-tsp-secondary': 'rgba(0, 0, 0, 0.035)',

  // ── 状态色（微信功能色） ──
  '--dsw-static-green-500': '#07C160',
  '--dsw-static-green-400': '#07C160',
  '--dsw-static-green-100': 'rgba(7, 193, 96, 0.12)',
  '--dsw-static-green-900': 'rgba(7, 193, 96, 0.12)',
  '--dsw-static-green-500-a08': 'rgba(7, 193, 96, 0.08)',
  '--dsw-static-green-500-a12': 'rgba(7, 193, 96, 0.12)',
  '--dsw-static-red-600': '#FA5151',
  '--dsw-static-red-500': '#FA5151',
  '--dsw-static-red-400': '#FA5151',
  '--dsw-static-red-100': 'rgba(250, 81, 81, 0.12)',
  '--dsw-static-red-900': 'rgba(250, 81, 81, 0.12)',
  '--dsw-static-red-400-a12': 'rgba(250, 81, 81, 0.12)',
  '--dsw-static-red-600-a08': 'rgba(250, 81, 81, 0.08)',
  '--dsw-static-amber-500': '#FFC300',
  '--dsw-static-amber-400': '#FFC300',
  '--dsw-static-amber-600': '#E6AF00',
  '--dsw-static-amber-100': 'rgba(255, 195, 0, 0.14)',
  '--dsw-static-amber-900': 'rgba(255, 195, 0, 0.14)',
  '--dsw-alias-state-success-primary': '#07C160',
  '--dsw-alias-state-success-secondary': '#07C160',
  '--dsw-alias-state-success-tertiary': 'rgba(7, 193, 96, 0.12)',
  '--dsw-alias-state-error-primary': '#FA5151',
  '--dsw-alias-state-error-secondary': '#FA5151',
  '--dsw-alias-state-warn-primary': '#E6AF00',
  '--dsw-alias-state-warning-primary': '#E6AF00',
  '--dsw-alias-state-warn-secondary': '#E6AF00',
  '--dsw-alias-state-warn-label': '#E6AF00',
  '--dsw-alias-state-warn-tertiary': 'rgba(255, 195, 0, 0.14)',
  '--dsw-alias-state-idle-primary': '#B2B2B2',

  // ── 蓝 / 链接（统一换成微信绿，消除 DeepSeek 蓝残留；微信链接即绿色） ──
  '--dsw-static-deepseek-500': '#07C160',
  '--dsw-static-deepseek-450': '#07C160',
  '--dsw-static-deepseek-400': '#07C160',
  '--dsw-static-deepseek-600': '#06AD56',
  '--dsw-static-deepseek-800': 'rgba(7, 193, 96, 0.14)',
  '--dsw-static-deepseek-100': 'rgba(7, 193, 96, 0.12)',
  '--dsw-static-deepseek-50': 'rgba(7, 193, 96, 0.06)',
  '--dsw-static-deepseek-200': 'rgba(7, 193, 96, 0.18)',
  '--dsw-static-deepseek-300': 'rgba(7, 193, 96, 0.26)',
  '--dsw-alias-link': '#576B95',
  '--dsw-alias-label-deep-diving': '#07C160',
  '--dsw-alias-label-deep-diving-shimmer': 'rgba(7, 193, 96, 0.30)',
  '--dsw-static-blue-500': '#10AEFF',
  '--dsw-static-blue-450': '#10AEFF',
  '--dsw-static-blue-400': '#10AEFF',
  '--dsw-static-blue-300': '#576B95',
  '--dsw-static-blue-100': 'rgba(16, 174, 255, 0.12)',

  // ── Markdown / 代码 ──
  '--dsw-alias-markdown-code-block': '#F7F7F7',
  '--dsw-alias-markdown-code-block-banner': '#EDEDED',
  '--dsw-alias-markdown-inline-code': 'rgba(0, 0, 0, 0.06)',
  '--dsw-alias-markdown-code-editor-bg': '#191919',
  '--dsw-alias-markdown-code-editor-fg': '#EDEDED',
  '--dsw-alias-markdown-tag': '#EDEDED',
  '--dsw-alias-markdown-citation': '#F7F7F7',
  '--dsw-alias-markdown-placeholder': '#FAFAFA',
  '--dsw-alias-markdown-code-segment-selected': '#FFFFFF',
  '--dsw-alias-markdown-code-segment-unselected': '#F7F7F7',
  '--dsw-alias-turn-trigger-bg': '#F7F7F7',
  '--dsw-alias-turn-trigger-bg-hover': 'rgba(0, 0, 0, 0.04)',
  '--dsw-alias-code-diff-added': 'rgba(7, 193, 96, 0.08)',
  '--dsw-alias-code-diff-deleted': 'rgba(250, 81, 81, 0.08)',
  '--dsw-alias-file-diff-added-bg': '#E8F8EE',
  '--dsw-alias-file-diff-added-gutter': '#F2FBF5',
  '--dsw-alias-file-diff-added-marker': '#07C160',
  '--dsw-alias-file-diff-deleted-bg': '#FDEEEE',
  '--dsw-alias-file-diff-deleted-gutter': '#FEF6F6',
  '--dsw-alias-file-diff-deleted-marker': '#FA5151',

  // ── 滚动条 / 浮层 / 表单 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(0, 0, 0, 0.10)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(0, 0, 0, 0.10)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(77, 77, 77, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': 'rgba(77, 77, 77, 0.28)',
  '--dsw-alias-toast-bg': '#4C4C4C',
  '--dsw-alias-toast-label': '#FFFFFF',
  '--dsw-alias-tooltip-bg': '#4C4C4C',
  '--dsw-alias-tooltip-label': '#FFFFFF',
  '--dsw-alias-tooltip-key-bg': '#666666',
  '--dsw-alias-menu-group-header-fill': 'rgba(247, 247, 247, 0.94)',
  '--dsw-alias-switch-thumb': '#FFFFFF',
  '--dsw-alias-settings-card-fill': '#FFFFFF',
  '--dsw-alias-settings-card-stroke': '#E5E5E5',
  '--dsw-alias-onboarding-accent': '#07C160',
  '--dsw-alias-onboarding-card-fill': '#FFFFFF',
  '--dsw-alias-onboarding-secondary-fill': '#F7F7F7',
  '--dsw-alias-onboarding-checkbox-border': '#C9C9C9',
  '--dsw-focus-ring-color': '#07C160',
  '--dsw-alias-icon-blue': '#07C160',

  // ── 特定表面 ──
  '--dsw-specific-input-major': '#FFFFFF',
  '--dsw-specific-menu-item-hover': '#F2F2F2',
  '--dsw-specific-bubble': '#95EC69',
  '--dsw-specific-menu': '#FFFFFF',
  '--dsw-menu-backdrop-filter': 'blur(18px)',

  // ── 微信私有：亮色覆盖（键集合必须与 DARK 完全一致，test/run-all.mjs 会校验） ──
  '--wx-primary': '#07C160',
  '--wx-primary-hover': '#06AD56',
  '--wx-primary-soft': 'rgba(7, 193, 96, 0.10)',
  '--wx-user-bubble': '#95EC69',
  '--wx-user-bubble-label': '#191919',
  '--wx-composer-shadow': 'none',
})

/** 暗色色板（参考微信深色模式：底 #111111、层 #191919、气泡深绿）。 */
export const DARK = Object.freeze({
  '--dsw-static-neutral-bluish-950': '#111111',
  '--dsw-static-neutral-bluish-875': '#191919',
  '--dsw-static-neutral-bluish-850': '#1E1E1E',
  '--dsw-static-neutral-bluish-800': '#232323',
  '--dsw-static-neutral-bluish-750': '#2C2C2C',
  '--dsw-static-neutral-bluish-700': '#383838',
  '--dsw-static-neutral-bluish-600': '#4A4A4A',
  '--dsw-static-neutral-bluish-500': '#666666',
  '--dsw-static-neutral-bluish-400': '#888888',
  '--dsw-static-neutral-bluish-300': '#A6A6A6',
  '--dsw-static-neutral-bluish-200': '#C9C9C9',
  '--dsw-static-neutral-bluish-150': '#2C2C2C',
  '--dsw-static-neutral-bluish-100': '#383838',
  '--dsw-static-neutral-bluish-75': '#232323',
  '--dsw-static-neutral-bluish-60': '#232323',
  '--dsw-static-neutral-bluish-50': '#D9D9D9',
  '--dsw-static-neutral-bluish-00': '#EDEDED',
  '--dsw-static-neutral-bluish-1000': '#111111',

  '--dsw-alias-bg-base': '#111111',
  '--dsw-alias-bg-layer-1': '#191919',
  '--dsw-alias-bg-layer-2': '#1E1E1E',
  '--dsw-alias-bg-layer-3': '#232323',
  '--dsw-alias-bg-layer-4': '#2C2C2C',
  '--dsw-alias-bg-overlay': '#1E1E1E',
  '--dsw-alias-bg-module-platform': '#232323',
  '--dsw-alias-bg-multi-select': '#1F3A2A',
  '--dsw-alias-bg-l1': '#191919',
  '--dsw-alias-bg-l2': '#1E1E1E',
  '--dsw-alias-background-secondary': '#1E1E1E',
  '--dsw-alias-bg-document-preview': '#191919',
  '--dsw-alias-bg-document-selection': 'rgba(7, 193, 96, 0.36)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-bg-mask-1': 'rgba(0, 0, 0, 0.55)',
  '--dsw-alias-bg-mask-2': 'rgba(0, 0, 0, 0.25)',
  '--dsw-alias-bg-mask-3': 'rgba(0, 0, 0, 0.50)',
  '--dsw-alias-bg-mask-photo': 'rgba(0, 0, 0, 0.88)',
  '--dsw-alias-bg-mask-drop': 'rgba(30, 30, 30, 0.72)',

  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.09)',
  '--dsw-alias-border-subtle': 'rgba(255, 255, 255, 0.09)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.14)',
  '--dsw-alias-border-l4': 'rgba(255, 255, 255, 0.18)',
  '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.09)',
  '--dsw-alias-separator-primary': 'rgba(255, 255, 255, 0.09)',

  '--dsw-alias-label-primary': '#D9D9D9',
  '--dsw-alias-label-primary-foreground': '#111111',
  '--dsw-alias-label-primary-inverted': '#191919',
  '--dsw-alias-label-primary-dimmed': 'rgba(217, 217, 217, 0.60)',
  '--dsw-alias-label-primary-bluish': '#D9D9D9',
  '--dsw-alias-label-secondary': 'rgba(217, 217, 217, 0.62)',
  '--dsw-alias-label-tertiary': 'rgba(217, 217, 217, 0.48)',
  '--dsw-alias-label-caption': 'rgba(217, 217, 217, 0.40)',
  '--dsw-alias-label-dimmed': 'rgba(217, 217, 217, 0.30)',
  '--dsw-alias-label-quaternary': 'rgba(217, 217, 217, 0.34)',
  '--dsw-alias-label-error': '#FA5151',
  '--dsw-alias-label-shimmer': 'rgba(255, 255, 255, 0.42)',
  '--dsw-alias-label-document-preview': '#A6A6A6',
  '--dsw-alias-menu-icon': 'rgba(217, 217, 217, 0.62)',

  '--dsw-alias-brand-primary': '#07C160',
  '--dsw-alias-brand-primary-invert': '#FFFFFF',
  '--dsw-alias-brand-text': '#2AAE67',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': '#07C160',
  '--dsw-alias-state-business-primary': '#07C160',
  '--dsw-alias-state-business-tertiary': '#1F3A2A',
  '--dsw-alias-button-primary-fill': '#07C160',
  '--dsw-alias-button-primary-hover': '#2AAE67',
  '--dsw-alias-button-primary-dimmed': 'rgba(7, 193, 96, 0.20)',
  '--dsw-alias-button-contrast-fill': '#D9D9D9',
  '--dsw-alias-button-elevated-fill': '#1E1E1E',
  '--dsw-alias-button-floating-fill': '#1E1E1E',
  '--dsw-alias-button-floating-hover': '#2C2C2C',
  '--dsw-alias-button-ghost-active-fill': '#1F3A2A',
  '--dsw-alias-button-ghost-active-hover': '#27492F',
  '--dsw-alias-button-ghost-active-border': 'rgba(7, 193, 96, 0.28)',
  '--dsw-alias-button-info-fill': '#07C160',
  '--dsw-alias-button-info-hover': '#2AAE67',
  '--dsw-alias-button-tool-bar-fill': 'rgba(102, 102, 102, 0.50)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(56, 56, 56, 0.36)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(102, 102, 102, 0.62)',

  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-interactive-bg-hover-solid': '#232323',
  '--dsw-alias-interactive-bg-active': 'rgba(7, 193, 96, 0.14)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(7, 193, 96, 0.16)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(250, 81, 81, 0.12)',
  '--dsw-alias-fill-l1': 'rgba(255, 255, 255, 0.045)',
  '--dsw-alias-fill-l2': 'rgba(255, 255, 255, 0.075)',
  '--dsw-alias-fill-tertiary': 'rgba(255, 255, 255, 0.075)',
  '--dsw-alias-fill-tsp-secondary': 'rgba(255, 255, 255, 0.045)',

  '--dsw-static-green-500': '#2AAE67',
  '--dsw-static-green-400': '#2AAE67',
  '--dsw-static-green-100': 'rgba(42, 174, 103, 0.16)',
  '--dsw-static-green-900': 'rgba(42, 174, 103, 0.16)',
  '--dsw-static-green-500-a08': 'rgba(42, 174, 103, 0.08)',
  '--dsw-static-green-500-a12': 'rgba(42, 174, 103, 0.12)',
  '--dsw-static-red-600': '#FA5151',
  '--dsw-static-red-500': '#FA5151',
  '--dsw-static-red-400': '#FA5151',
  '--dsw-static-red-100': 'rgba(250, 81, 81, 0.16)',
  '--dsw-static-red-900': 'rgba(250, 81, 81, 0.16)',
  '--dsw-static-red-400-a12': 'rgba(250, 81, 81, 0.12)',
  '--dsw-static-red-600-a08': 'rgba(250, 81, 81, 0.08)',
  '--dsw-static-amber-500': '#FFC300',
  '--dsw-static-amber-400': '#FFC300',
  '--dsw-static-amber-600': '#FFC300',
  '--dsw-static-amber-100': 'rgba(255, 195, 0, 0.16)',
  '--dsw-static-amber-900': 'rgba(255, 195, 0, 0.16)',
  '--dsw-alias-state-success-primary': '#2AAE67',
  '--dsw-alias-state-success-secondary': '#2AAE67',
  '--dsw-alias-state-success-tertiary': 'rgba(42, 174, 103, 0.16)',
  '--dsw-alias-state-error-primary': '#FA5151',
  '--dsw-alias-state-error-secondary': '#FA5151',
  '--dsw-alias-state-warn-primary': '#FFC300',
  '--dsw-alias-state-warning-primary': '#FFC300',
  '--dsw-alias-state-warn-secondary': '#FFC300',
  '--dsw-alias-state-warn-label': '#FFC300',
  '--dsw-alias-state-warn-tertiary': 'rgba(255, 195, 0, 0.16)',
  '--dsw-alias-state-idle-primary': '#666666',

  '--dsw-static-deepseek-500': '#2AAE67',
  '--dsw-static-deepseek-450': '#2AAE67',
  '--dsw-static-deepseek-400': '#2AAE67',
  '--dsw-static-deepseek-600': '#07C160',
  '--dsw-static-deepseek-800': 'rgba(42, 174, 103, 0.18)',
  '--dsw-static-deepseek-100': 'rgba(42, 174, 103, 0.16)',
  '--dsw-static-deepseek-50': 'rgba(42, 174, 103, 0.08)',
  '--dsw-static-deepseek-200': 'rgba(42, 174, 103, 0.22)',
  '--dsw-static-deepseek-300': 'rgba(42, 174, 103, 0.32)',
  '--dsw-alias-link': '#7D90B8',
  '--dsw-alias-label-deep-diving': '#2AAE67',
  '--dsw-alias-label-deep-diving-shimmer': 'rgba(42, 174, 103, 0.30)',
  '--dsw-static-blue-500': '#10AEFF',
  '--dsw-static-blue-450': '#10AEFF',
  '--dsw-static-blue-400': '#10AEFF',
  '--dsw-static-blue-300': '#7D90B8',
  '--dsw-static-blue-100': 'rgba(16, 174, 255, 0.16)',

  '--dsw-alias-markdown-code-block': '#191919',
  '--dsw-alias-markdown-code-block-banner': '#232323',
  '--dsw-alias-markdown-inline-code': 'rgba(255, 255, 255, 0.10)',
  '--dsw-alias-markdown-code-editor-bg': '#0D0D0D',
  '--dsw-alias-markdown-code-editor-fg': '#D9D9D9',
  '--dsw-alias-markdown-tag': '#2C2C2C',
  '--dsw-alias-markdown-citation': '#232323',
  '--dsw-alias-markdown-placeholder': '#1E1E1E',
  '--dsw-alias-markdown-code-segment-selected': '#1E1E1E',
  '--dsw-alias-markdown-code-segment-unselected': '#191919',
  '--dsw-alias-turn-trigger-bg': '#232323',
  '--dsw-alias-turn-trigger-bg-hover': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-code-diff-added': 'rgba(42, 174, 103, 0.12)',
  '--dsw-alias-code-diff-deleted': 'rgba(250, 81, 81, 0.12)',
  '--dsw-alias-file-diff-added-bg': '#16281D',
  '--dsw-alias-file-diff-added-gutter': '#101F16',
  '--dsw-alias-file-diff-added-marker': '#2AAE67',
  '--dsw-alias-file-diff-deleted-bg': '#2E1A1A',
  '--dsw-alias-file-diff-deleted-gutter': '#221313',
  '--dsw-alias-file-diff-deleted-marker': '#FA5151',

  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.10)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.10)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(217, 217, 217, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': 'rgba(217, 217, 217, 0.28)',
  '--dsw-alias-toast-bg': '#4C4C4C',
  '--dsw-alias-toast-label': '#FFFFFF',
  '--dsw-alias-tooltip-bg': '#4C4C4C',
  '--dsw-alias-tooltip-label': '#FFFFFF',
  '--dsw-alias-tooltip-key-bg': '#666666',
  '--dsw-alias-menu-group-header-fill': 'rgba(25, 25, 25, 0.94)',
  '--dsw-alias-switch-thumb': '#D9D9D9',
  '--dsw-alias-settings-card-fill': '#1E1E1E',
  '--dsw-alias-settings-card-stroke': 'rgba(255, 255, 255, 0.09)',
  '--dsw-alias-onboarding-accent': '#07C160',
  '--dsw-alias-onboarding-card-fill': '#1E1E1E',
  '--dsw-alias-onboarding-secondary-fill': '#232323',
  '--dsw-alias-onboarding-checkbox-border': 'rgba(255, 255, 255, 0.20)',
  '--dsw-focus-ring-color': '#07C160',
  '--dsw-alias-icon-blue': '#2AAE67',

  '--dsw-specific-input-major': '#1E1E1E',
  '--dsw-specific-menu-item-hover': '#2C2C2C',
  '--dsw-specific-bubble': '#2E5C3C',
  '--dsw-specific-menu': '#1E1E1E',
  '--dsw-menu-backdrop-filter': 'blur(18px)',

  '--wx-primary': '#07C160',
  '--wx-primary-hover': '#2AAE67',
  '--wx-primary-soft': 'rgba(7, 193, 96, 0.14)',
  '--wx-user-bubble': '#2E5C3C',
  '--wx-user-bubble-label': '#D9D9D9',
  '--wx-composer-shadow': 'none',
})

/**
 * 平台变体：微信 Windows 版 vs 微信 macOS 版观感。
 *
 * 宿主在 <html data-platform="win32|darwin"> 上暴露平台。基础 LIGHT/DARK
 * 是共享色板；下面四张表只覆盖「平台差异键」。属性必须挂在 :root 伪类自身
 * （html 是根，`:root html` 这类后代写法永远不匹配）。选择器特异性 (0,4,1)，
 * 亮色带 :not([data-ds-dark-theme])、暗色带 [data-ds-dark-theme]，互斥且
 * 确定性压过基础块 (0,2,1)/(0,3,1)，不依赖加载顺序。
 *
 * Windows 版微信：直角扁平、4px 小圆角、雅黑字体、无浮起阴影。
 * macOS 版微信：柔和浅灰、10px 圆角、苹方字体、毛玻璃浮层、软阴影。
 * 四张表的键集合必须一致（test/run-all.mjs 校验）。
 */
export const WIN_LIGHT = Object.freeze({
  '--dsw-alias-bg-base': '#EDEDED',
  '--dsw-alias-bg-layer-3': '#F7F7F7',
  '--dsw-radius-lg': '4px',
  '--dsw-radius-xl': '4px',
  '--dsw-radius-panel': '6px',
  '--dsw-shadow-lv2': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
  '--dsw-font-family':
    '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "HarmonyOS Sans SC", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--dsw-menu-backdrop-filter': 'none',
  '--wx-composer-radius': '4px',
  '--wx-composer-shadow': 'none',
})

export const WIN_DARK = Object.freeze({
  '--dsw-alias-bg-base': '#111111',
  '--dsw-alias-bg-layer-3': '#232323',
  '--dsw-radius-lg': '4px',
  '--dsw-radius-xl': '4px',
  '--dsw-radius-panel': '6px',
  '--dsw-shadow-lv2': '0 2px 8px 0 rgba(0, 0, 0, 0.32)',
  '--dsw-font-family':
    '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "HarmonyOS Sans SC", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--dsw-menu-backdrop-filter': 'none',
  '--wx-composer-radius': '4px',
  '--wx-composer-shadow': 'none',
})

export const MAC_LIGHT = Object.freeze({
  '--dsw-alias-bg-base': '#F0F0F2',
  '--dsw-alias-bg-layer-3': '#F5F5F7',
  '--dsw-radius-lg': '10px',
  '--dsw-radius-xl': '12px',
  '--dsw-radius-panel': '12px',
  '--dsw-shadow-lv2': '0 4px 16px 0 rgba(0, 0, 0, 0.10), 0 1px 3px 0 rgba(0, 0, 0, 0.06)',
  '--dsw-font-family':
    '"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei UI", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--dsw-menu-backdrop-filter': 'blur(24px) saturate(1.4)',
  '--wx-composer-radius': '10px',
  '--wx-composer-shadow': '0 2px 10px 0 rgba(0, 0, 0, 0.06)',
})

export const MAC_DARK = Object.freeze({
  '--dsw-alias-bg-base': '#1C1C1E',
  '--dsw-alias-bg-layer-3': '#2C2C2E',
  '--dsw-radius-lg': '10px',
  '--dsw-radius-xl': '12px',
  '--dsw-radius-panel': '12px',
  '--dsw-shadow-lv2': '0 4px 16px 0 rgba(0, 0, 0, 0.40)',
  '--dsw-font-family':
    '"PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei UI", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  '--dsw-menu-backdrop-filter': 'blur(24px) saturate(1.4)',
  '--wx-composer-radius': '10px',
  '--wx-composer-shadow': '0 2px 10px 0 rgba(0, 0, 0, 0.30)',
})

/** 平台亮色选择器：特异性 (0,4,1)，与暗色互斥。 */
export const WIN_LIGHT_SELECTOR = ':root[data-platform="win32"]:root body:not([data-ds-dark-theme])'
export const WIN_DARK_SELECTOR = ':root[data-platform="win32"]:root body[data-ds-dark-theme]'
export const MAC_LIGHT_SELECTOR = ':root[data-platform="darwin"]:root body:not([data-ds-dark-theme])'
export const MAC_DARK_SELECTOR = ':root[data-platform="darwin"]:root body[data-ds-dark-theme]'

/**
 * 令牌之外的少量结构修正。
 *
 * 纪律：皮肤层**不针对 DSH 的 CSS Module 哈希类名写规则**。这里只做与类名
 * 无关的事：color-scheme 跟随主题、输入框的微信式形态、表单控件字体归一。
 * 用户气泡上色走 --dsw-specific-bubble 令牌；匹配不到锚点时什么都不发生。
 */
export const STRUCTURE_CSS = `
/* 原生控件跟随皮肤而不是跟随操作系统。 */
:root:root body{color-scheme:light}
:root:root body[data-ds-dark-theme]{color-scheme:dark}

/* 字体归一：继承属性在表面设一次；表单控件用零特异性 :where() 压过 UA 默认值。 */
:where(body){font-family:var(--dsw-font-family);font-variant-numeric:tabular-nums}
:where(button,input,select,textarea){font-family:inherit}

/* 输入框外壳：微信的小圆角、扁平、细边框。
   用 [data-composer-card] 这个宿主公开的稳定属性锚点，不依赖哈希类名。 */
[data-conversation-scroll] [data-composer-card]{
  border-radius:var(--wx-composer-radius)!important;
  box-shadow:var(--wx-composer-shadow)!important;
  border-color:var(--dsw-alias-border-l2)!important;
  transition:box-shadow .2s ease,border-color .2s ease;
}
[data-conversation-scroll] [data-composer-card]:focus-within{
  border-color:var(--wx-primary)!important;
  box-shadow:0 0 0 2px var(--wx-primary-soft)!important;
}

/* 快捷胶囊（深度思考 / 联网搜索 等）：微信式小圆角标签。 */
[data-input-trigger],[data-composer-chip]{
  border-radius:var(--dsw-radius-sm)!important;
  border:1px solid var(--dsw-alias-border-l2)!important;
  background:var(--dsw-alias-bg-layer-1)!important;
  transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-input-trigger]:hover,[data-composer-chip]:hover{
  border-color:var(--wx-primary)!important;
  color:var(--wx-primary)!important;
  background:var(--wx-primary-soft)!important;
}
[data-input-trigger][aria-pressed=true],[data-composer-chip][aria-pressed=true]{
  border-color:var(--wx-primary)!important;
  color:var(--wx-primary)!important;
  background:var(--wx-primary-soft)!important;
}

/* 主按钮（发送键等）：微信绿实心、小圆角，微信最有辨识度的一笔。 */
[data-composer-card] button[class*="primary"],[data-composer-card] [data-send-button]{
  background:var(--wx-primary)!important;
  color:#fff!important;
  border:0!important;
  border-radius:var(--dsw-radius-sm)!important;
}
[data-composer-card] button[class*="primary"]:hover,[data-composer-card] [data-send-button]:hover{
  background:var(--wx-primary-hover)!important;
}

/* 代码块与引用块：微信式小圆角。 */
[data-conversation-scroll] pre,[data-conversation-scroll] blockquote{
  border-radius:var(--dsw-radius-lg)!important;
}

/* 尊重系统的减少动效偏好。 */
@media (prefers-reduced-motion: reduce){
  [data-conversation-scroll] [data-composer-card],
  [data-input-trigger],[data-composer-chip]{transition:none!important}
}
`.trim()

/**
 * 微信对话布局：把转录区变成微信聊天窗口。
 *
 * 锚点全部来自宿主公开的稳定属性（跨构建不变）：
 *   - [data-chat-flow-kind]：user / assistant / assistant-step / command ...
 *   - [data-chat-group-part]：AI 侧的 reasoning / response 分组
 *   - [data-slot="conversation.chat.node"]：renderer 统一渲染的结构锚点
 *   - [data-message-bubble]：用户消息气泡（宿主已右对齐）
 * 不碰任何 CSS Module 哈希类名；匹配不到时什么都不发生。
 *
 * 头像用 ::before 伪元素画一个微信式圆角方块（不注入 DOM、不发请求）：
 * 用户侧绿色「我」，AI 侧品牌色「D」。过程行（assistant-step 等）不加头像，
 * 避免折叠态的过程提示也被当成聊天消息。
 */
export const CHAT_LAYOUT_CSS = `
/* 消息行：头像 + 气泡的横向排布。列本身是 flex-column，这里把每条消息
   变成 flex-row；用户行靠右、AI 行靠左，即微信对话的经典布局。
   reasoning 分组是思考过程行，不当作聊天消息处理。 */
[data-conversation-scroll] [data-chat-flow-kind="user"],
[data-conversation-scroll] [data-chat-flow-kind="assistant"]:not([data-chat-group-part="reasoning"]){
  display:flex!important;
  flex-direction:row!important;
  align-items:flex-start!important;
  gap:10px!important;
  width:100%!important;
}
[data-conversation-scroll] [data-chat-flow-kind="user"]{
  justify-content:flex-end!important;
}
[data-conversation-scroll] [data-chat-flow-kind="assistant"]:not([data-chat-group-part="reasoning"]){
  justify-content:flex-start!important;
}

/* 头像：微信式小圆角方块。用户绿色「我」在右，AI 品牌色「D」在左。 */
[data-conversation-scroll] [data-chat-flow-kind="user"]::before,
[data-conversation-scroll] [data-chat-flow-kind="assistant"]:not([data-chat-group-part="reasoning"])::before{
  flex:0 0 auto;
  width:36px;
  height:36px;
  border-radius:var(--dsw-radius-sm);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:15px;
  font-weight:600;
  color:#fff;
  margin-top:2px;
}
[data-conversation-scroll] [data-chat-flow-kind="user"]::before{
  content:"我";
  order:2;
  background:var(--wx-primary);
}
[data-conversation-scroll] [data-chat-flow-kind="assistant"]:not([data-chat-group-part="reasoning"])::before{
  content:"D";
  order:0;
  background:var(--dsw-alias-brand-primary);
}

/* 气泡宽度：微信单条消息不超过会话宽度的八成。
   注意 data-slot 锚点是 display:contents（无盒模型），宽度必须落在
   它的真实子元素上才生效。 */
[data-conversation-scroll] [data-chat-flow-kind="user"] [data-slot="conversation.chat.node"]>div,
[data-conversation-scroll] [data-chat-flow-kind="assistant"]:not([data-chat-group-part="reasoning"]) [data-slot="conversation.chat.node"]>div{
  min-width:0!important;
  max-width:82%!important;
}

/* 用户气泡：宿主已右对齐，这里补微信绿气泡的深色文字与小圆角。 */
[data-conversation-scroll] [data-message-bubble]{
  position:relative;
  background:var(--wx-user-bubble)!important;
  color:var(--wx-user-bubble-label)!important;
  border-radius:var(--dsw-radius-lg)!important;
}

/* 微信式气泡小尾巴：用户气泡朝右、AI 气泡朝左的旋转小方块。 */
[data-conversation-scroll] [data-message-bubble]::after{
  content:"";
  position:absolute;
  top:12px;
  right:-4px;
  width:9px;
  height:9px;
  background:var(--wx-user-bubble);
  border-radius:2px;
  transform:rotate(45deg);
}

/* AI 回复：从全宽文本流变成左对齐的白色气泡（暗色跟随层色）。
   只命中 response 分组，reasoning/过程行保持原样。 */
[data-conversation-scroll] [data-chat-group-part="response"] [data-slot="conversation.chat.node"]>div{
  position:relative;
  background:var(--dsw-alias-bg-layer-1)!important;
  border:1px solid var(--dsw-alias-border-l1)!important;
  border-radius:var(--dsw-radius-lg)!important;
  padding:10px 14px!important;
}
[data-conversation-scroll] [data-chat-group-part="response"] [data-slot="conversation.chat.node"]>div::before{
  content:"";
  position:absolute;
  top:12px;
  left:-5px;
  width:9px;
  height:9px;
  background:var(--dsw-alias-bg-layer-1);
  border-left:1px solid var(--dsw-alias-border-l1);
  border-bottom:1px solid var(--dsw-alias-border-l1);
  border-radius:2px;
  transform:rotate(45deg);
}

/* 气泡内的代码块/引用块不再套大圆角卡片，避免气泡里叠气泡。 */
[data-conversation-scroll] [data-chat-group-part="response"] pre,
[data-conversation-scroll] [data-chat-group-part="response"] blockquote{
  border-radius:var(--dsw-radius-sm)!important;
}

@media (prefers-reduced-motion: reduce){
  [data-conversation-scroll] [data-chat-flow-kind]{transition:none!important}
}
`.trim()

/** 把令牌映射渲染成 `selector{--a:b;--c:d}` 形式的 CSS 文本。 */
export function renderTokenBlock(selector, tokens) {
  return `${selector}{${Object.entries(tokens)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')}}`
}

/** 生成完整皮肤样式表。 */
export function renderSkinCss() {
  const structural = [
    renderTokenBlock(':root:root', STRUCTURAL),
    renderTokenBlock(':root:root body', STRUCTURAL),
  ].join('')
  return [
    `/* dsh-wechat-ui — 微信风格皮肤 v${SKIN_VERSION} · inspired-by, 非官方 · Windows/macOS 双平台变体 */`,
    renderTokenBlock(LIGHT_SELECTOR, LIGHT),
    renderTokenBlock(DARK_SELECTOR, DARK),
    structural,
    renderTokenBlock(WIN_LIGHT_SELECTOR, WIN_LIGHT),
    renderTokenBlock(WIN_DARK_SELECTOR, WIN_DARK),
    renderTokenBlock(MAC_LIGHT_SELECTOR, MAC_LIGHT),
    renderTokenBlock(MAC_DARK_SELECTOR, MAC_DARK),
    STRUCTURE_CSS,
    CHAT_LAYOUT_CSS,
  ].join('\n')
}