#!/usr/bin/env node
/**
 * 生成皮肤预览页 test/_preview/{index,dark}.html。
 *
 * 用与宿主一致的 data-* 锚点搭一个最小 DSH 转录区骨架（结构来自
 * dsh-client-ui-chat 的实际 DOM：flowItem[data-chat-flow-kind] >
 * div[data-slot="conversation.chat.node"] > 内容），注入 renderSkinCss()
 * 的完整产物。暗色页把 data-dsh-dark-theme 放在 body 上，与宿主一致。
 * 用于浏览器里肉眼验证布局，以及产出 README 预览图。
 *
 * 用法：node scripts/render-preview.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const { renderSkinCss, SKIN_VERSION } = await import(pathToFileURL(join(root, 'src', 'tokens.mjs')))

const conversation = `
<div data-conversation-content data-conversation-region="chat" class="mock-body">
  <div data-conversation-scroll class="mock-scroll">
    <div class="mock-column">
      <div data-slot="conversation.chat.flow" style="display:contents">
        <div class="mock-flow-item" data-chat-flow-kind="user" data-chat-turn>
          <div data-slot="conversation.chat.node" style="display:contents">
            <div class="mock-user-row">
              <div class="mock-user-stack">
                <div data-message-bubble>帮我把这个报告整理成三段式摘要，明天开会要用。</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mock-flow-item" data-chat-flow-kind="assistant" data-chat-group-part="response" data-chat-turn>
          <div data-slot="conversation.chat.node" style="display:contents">
            <div class="mock-assistant-root">
              <p>好的，已按「背景 — 结论 — 下一步」整理完成：</p>
              <p><strong>背景</strong>：本季度渠道成本上升 12%。<br>
              <strong>结论</strong>：切换到免费路由后预计节省 30%。<br>
              <strong>下一步</strong>：周五前完成灰度验证。</p>
            </div>
          </div>
        </div>
        <div class="mock-flow-item" data-chat-flow-kind="user" data-chat-turn>
          <div data-slot="conversation.chat.node" style="display:contents">
            <div class="mock-user-row">
              <div class="mock-user-stack">
                <div data-message-bubble>不错，再加一句风险提示</div>
              </div>
            </div>
          </div>
        </div>
        <div class="mock-flow-item" data-chat-flow-kind="assistant" data-chat-group-part="response" data-chat-turn>
          <div data-slot="conversation.chat.node" style="display:contents">
            <div class="mock-assistant-root">
              <p>已补充：免费渠道存在配额波动风险，建议保留付费兜底渠道并开启自动故障转移。</p>
            </div>
          </div>
        </div>
      </div>
      <div data-composer-card class="mock-composer">
        <div class="mock-composer-input">输入消息…</div>
        <div class="mock-composer-actions">
          <span data-composer-chip>深度思考</span>
          <span data-composer-chip>联网搜索</span>
          <button data-send-button class="primary">发送</button>
        </div>
      </div>
    </div>
  </div>
</div>`

function page(dark, platform) {
  return `<!doctype html>
<html lang="zh-CN" data-platform="${platform}">
<head>
<meta charset="utf-8">
<title>dsh-wechat-ui preview v${SKIN_VERSION} (${platform} ${dark ? 'dark' : 'light'})</title>
<style>
/* ── 模拟宿主基线（非皮肤部分）：仅搭骨架 ── */
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{font-size:14px}
.mock-body{height:100%;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,#fff)}
.mock-scroll{flex:1;overflow:auto;padding:24px 16px}
.mock-column{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:18px}
.mock-flow-item{width:100%}
.mock-user-row{display:flex;flex-direction:column;align-items:flex-end}
.mock-user-stack{max-width:82%}
[data-message-bubble]{background:var(--dsw-specific-bubble,#e7e7e7);border-radius:12px;padding:10px 16px;line-height:1.6}
.mock-assistant-root{display:flex;flex-direction:column;gap:8px;line-height:1.7;color:var(--dsw-alias-label-primary,#111)}
.mock-composer{border:1px solid #ddd;border-radius:12px;background:var(--dsw-specific-input-major,#fff);padding:12px}
.mock-composer-input{min-height:40px;color:var(--dsw-alias-label-tertiary,#999)}
.mock-composer-actions{display:flex;gap:8px;align-items:center;margin-top:8px}
[data-composer-chip]{border:1px solid #ddd;border-radius:8px;padding:4px 10px;font-size:12px;color:var(--dsw-alias-label-secondary,#666);background:var(--dsw-alias-bg-layer-1,#fff)}
[data-send-button]{margin-left:auto;border:0;border-radius:8px;padding:6px 18px;background:#4d6bfe;color:#fff;cursor:pointer}
/* ── 皮肤产物 ── */
${renderSkinCss()}
</style>
</head>
<body${dark ? ' data-ds-dark-theme' : ''}>
${conversation}
</body>
</html>
`
}

const outDir = join(root, 'test', '_preview')
mkdirSync(outDir, { recursive: true })
for (const [name, dark, platform] of [
  ['index.html', false, 'win32'],
  ['dark.html', true, 'win32'],
  ['mac.html', false, 'darwin'],
  ['mac-dark.html', true, 'darwin'],
]) {
  const outFile = join(outDir, name)
  writeFileSync(outFile, page(dark, platform), 'utf8')
  console.log(`preview: wrote ${outFile}`)
}