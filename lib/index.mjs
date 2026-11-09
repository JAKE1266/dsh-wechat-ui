/**
 * dsh-wechat-ui — 微信风格皮肤 · Host 半（Loader 占位）
 *
 * 本包只贡献浏览器表现层，不注册任何工具、服务、路由或 slash 命令，
 * 也不读写任何文件、不发起任何网络请求。Host 半因此是一个空的 Loader
 * 座位：它给 Cordis 一个可以挂载的行，而实际的皮肤代码全部在 ./client。
 */

/** Host 插件体：浏览器半拥有全部贡献。 */
export function apply() {}

/** 无硬依赖：没有 webServer / commands 等必需 service，缺失时不会挂起 fiber。 */
export const inject = []