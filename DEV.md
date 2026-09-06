# 开发者文档 / DEV

面向想改代码、加功能或适配新版 dsh 的人。

## 文件结构

```
package.json        插件清单 (dsh.bundle.patch + dsh.client)
cordis.patch.yml    bundle 挂载声明
dsh/index.js        服务端: /dsh-glass-theme/wallpaper (GET/POST/DELETE, Range)
client.js           客户端入口 (由 build-client.mjs 生成, 勿手改)
soft-glass.css      样式源文件 (改这里)
build-client.mjs    把 CSS 与客户端模板合成 client.js
```

## 安全原则 (务必遵守, v1 就是死在这上面)

- **禁止** `[class*="..."]` 通配匹配 —— v1 的通配规则误伤了模型切换弹层
  与设置弹窗, 造成 fixed 定位塌陷;
- **禁止**改写任何 position / display / inset / 宽高 / z-index ——
  弹窗定位完全属于应用自身;
- `backdrop-filter` 只允许加在确认不含 fixed 弹层后代的内容卡片上
  (输入框卡片 / 消息气泡 / 启动卡);
- 菜单、弹层一律用高不透明底色, 不加滤镜;
- 全文不允许 `!important`。

## 日常改样式

1. 编辑 `soft-glass.css`;
2. `node build-client.mjs`;
3. 重新部署进 profile 并重启:

   ```bat
   cd /d %USERPROFILE%\.dsh\profiles\web
   rmdir /s /q node_modules\dsh-glass-theme
   corepack pnpm install
   cd /d <你的工作区>
   npx @deepseek-ai/dsh web
   ```

   注意: 必须先删除 `node_modules\dsh-glass-theme` 再 install ——
   pnpm 认为 file: 依赖未变化时不会重新拷贝文件。

## dsh 版本更新 / hash 漂移适配

皮肤里的 `VOzbGW_panel`、`uV2eYG_card`、`pI_x6G_centerCol` 等类名是当前
dsh 构建的 CSS-module hash。dsh 更新后 hash 大概率改变, 主题会**静默失效**
(界面回到原生, 但不会坏布局)。官方 `--dsw-*` 令牌层与壁纸功能不依赖这些
hash, 通常仍会生效。

适配流程:

1. 浏览器 F12 选中目标元素, 直接抄新 class; 或从 dsh-web-app 的构建产物
   里 grep;
2. 对照旧选择器逐个替换 `soft-glass.css` 与 `build-client.mjs` 里的锚点
   (`pI_x6G_centerCol` 在客户端模板的 `findChatHost()`,
   `wSkVaW_root` 在 wallpaperCss 的透明化规则里);
3. `node build-client.mjs` → 重新部署 → 重启;
4. 回归验证: 模型切换、设置弹窗居中、壁纸挂载、深色模式。

## 新增一个主题美化功能

在 build-client.mjs 模板的 `ThemeSection` 里找到 `rows` 数组,
追加一行即可 (开关用现成的 `Switch`, 也可放任意 React 控件):

```js
{ key: "your-feature", title: "功能名", hint: "…",
  control: react.createElement(Switch, { on: on, onToggle: toggle, label: "功能名" }) },
```

每行自带分隔线; 新功能配自己的 localStorage key, 互不影响。

## 聊天区背景壁纸实现说明

- **服务端** (`dsh/index.js`): 文件存 `~/.dsh/dsh-glass-theme/`
  (wallpaper.bin + meta.json), 路由 `/dsh-glass-theme/wallpaper`
  提供 meta 查询、二进制流 (含 Range)、上传 (1GB 上限)、删除;
- **挂载**: 聊天列加 `dsh-glass-theme-wp-host` 类 (relative + isolate),
  内部追加 `z-index:-1` 的壁纸层; `object-fit: cover` 自动裁剪,
  尺寸全为百分比 (缩放零修正);
- `wSkVaW_root` 是聊天视图自带的不透明白底、`wSkVaW_composerSeat`
  是输入框底座的"透明→白"渐变; 壁纸激活时在宿主范围内均置为透明
  (composerSeat 由 JS 清内联 background-image, React 重绘后看门狗会
  补清); 规则限定在 host 类之下, hash 漂移只会失效不会误伤;
- **视频播放兜底**: 每 1s 重试 play() 共 30 次, 防个别环境静音自动
  播放未生效;
- scrim 自动明暗 (浅色 0.30 白 / 深色 0.38 黑) 保证文字可读;
- **视频播放策略**: 静音起播 (浏览器永远允许) → playing 后若页面有过
  用户交互则放开声音, 被拦自动回退静音 → pointerdown/keydown 兜底放开;
  ended 事件兜底重播 (防个别视频时长元数据损坏导致 loop 失效);
- **音量**: localStorage `dsh-glass-theme.volume` (默认 0.5), 滑条即时生效;
- MutationObserver 看护: 框架重渲染丢层时自动补挂 (以 dataset.src 幂等);
- `window.__dshGlassTheme`: setWallpaper(file, name) / clearWallpaper() /
  setVolume(v) / getVolume(), 与设置页同一条代码路径。
