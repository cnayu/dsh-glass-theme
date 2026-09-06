window.__ModuleLoader__.load({
  id: "dsh-glass-theme",
  factory: (require) => {
    var react = require("react");
    // Complete stylesheets are embedded because browser clients cannot read workspace files.
    var css = "/* ============================================================\n   柔光玻璃 UI — DeepSeek Harness Web 皮肤 (v2 安全版)\n   参照小米澎湃 OS 4 Soft Light Glass 材质规范\n   三要素: 磨砂底层(blur+半透明) + 边缘高光 + 内部渐变\n\n   安全原则 (v1 教训):\n   - 全文不使用 [class*=...] 通配匹配 —— v1 的通配规则误伤了\n     模型切换弹层与设置弹窗, 造成 fixed 定位塌陷、界面错乱;\n   - 不改写任何 position / display / inset / 尺寸 / z-index,\n     弹窗定位完全交还应用自身;\n   - backdrop-filter 只用于确认不含 fixed 弹层后代的内容卡片\n     (输入框卡片/消息气泡/启动卡); 菜单与弹层一律用高不透明\n     底色保证可读, 不加滤镜;\n   - 不使用 !important; 全部选择器为精确 CSS-module 类名,\n     若未来 dsh 构建更换 hash, 皮肤只是失效, 不会破坏布局。\n   ============================================================ */\n\n/* ---------- 1. 背景: 渐变流体壁纸 (玻璃靠它显形) ---------- */\nbody {\n  background:\n    radial-gradient(ellipse 80% 60% at 12% 18%, rgba(147,183,255,0.55), transparent 60%),\n    radial-gradient(ellipse 70% 55% at 88% 22%, rgba(255,196,224,0.50), transparent 60%),\n    radial-gradient(ellipse 80% 60% at 52% 92%, rgba(150,222,255,0.45), transparent 60%),\n    radial-gradient(ellipse 55% 45% at 82% 78%, rgba(205,176,255,0.40), transparent 60%),\n    linear-gradient(135deg, #eef4ff 0%, #f8f3ff 48%, #effcff 100%);\n  background-attachment: fixed;\n}\nbody[data-ds-dark-theme] {\n  background:\n    radial-gradient(ellipse 80% 60% at 12% 18%, rgba(74,104,224,0.40), transparent 60%),\n    radial-gradient(ellipse 70% 55% at 88% 22%, rgba(168,74,190,0.34), transparent 60%),\n    radial-gradient(ellipse 80% 60% at 52% 92%, rgba(40,150,210,0.32), transparent 60%),\n    radial-gradient(ellipse 55% 45% at 82% 78%, rgba(124,84,208,0.34), transparent 60%),\n    linear-gradient(135deg, #0e1530 0%, #1a1230 48%, #0b2130 100%);\n  background-attachment: fixed;\n}\n\n/* ---------- 2. 设计令牌覆盖 (浅色) ----------\n   官方 --dsw-* 令牌, 应用自身消费; 只调透明度与配色,\n   这是玻璃感的主要来源, 也是最安全的层。 */\nbody {\n  --dsw-alias-bg-base: rgba(255,255,255,0.52);\n  --dsw-alias-bg-layer-1: rgba(255,255,255,0.46);\n  --dsw-alias-bg-layer-2: rgba(255,255,255,0.38);\n  --dsw-alias-bg-layer-3: rgba(255,255,255,0.32);\n  --dsw-alias-bg-mask-1: rgba(30,40,80,0.28);\n  --dsw-alias-bg-overlay: rgba(255,255,255,0.62);\n  --dsw-alias-border-l1: rgba(255,255,255,0.55);\n  --dsw-alias-border-l2: rgba(255,255,255,0.45);\n  --dsw-alias-border-l3: rgba(255,255,255,0.40);\n  --dsw-alias-border-l4: rgba(255,255,255,0.50);\n  --dsw-alias-border-inverted: rgba(255,255,255,0.55);\n  --dsw-alias-border-inverted2: rgba(255,255,255,0.5);\n  --dsw-alias-markdown-code-block: rgba(246,249,255,0.72);\n  --dsw-alias-markdown-inline-code: rgba(226,236,255,0.72);\n  --dsw-alias-scrollbar-bg-l1: rgba(140,160,220,0.22);\n  --dsw-alias-scrollbar-bg-l2: rgba(140,160,220,0.28);\n  --dsw-alias-scrollbar-hover-l1: rgba(120,140,220,0.40);\n  --dsw-alias-scrollbar-hover-l2: rgba(120,140,220,0.45);\n  --dsw-specific-sidebar-fill: rgba(255,255,255,0.30);\n  --dsw-specific-sidebar-nav-item-active: rgba(255,255,255,0.60);\n  --dsw-specific-sidebar-nav-item-active-accent: rgba(212,226,255,0.78);\n  --dsw-specific-sidebar-nav-item-hover: rgba(255,255,255,0.45);\n  --dsw-specific-input-major: rgba(255,255,255,0.66);\n  --dsw-specific-bubble: rgba(255,255,255,0.55);\n  --dsw-specific-bubble-highlight: rgba(255,255,255,0.78);\n  --dsw-specific-menu: rgba(255,255,255,0.74);\n  --dsw-specific-selector: rgba(255,255,255,0.46);\n  --dsw-alias-button-floating-fill: rgba(255,255,255,0.60);\n  --dsw-alias-button-elevated-fill: rgba(255,255,255,0.60);\n}\n\n/* ---------- 2b. 设计令牌覆盖 (深色) ---------- */\nbody[data-ds-dark-theme] {\n  --dsw-alias-bg-base: rgba(24,30,52,0.5);\n  --dsw-alias-bg-layer-1: rgba(30,36,62,0.46);\n  --dsw-alias-bg-layer-2: rgba(34,40,68,0.42);\n  --dsw-alias-bg-layer-3: rgba(38,44,74,0.38);\n  --dsw-alias-bg-mask-1: rgba(0,0,10,0.42);\n  --dsw-alias-bg-overlay: rgba(26,32,56,0.74);\n  --dsw-alias-border-l1: rgba(255,255,255,0.12);\n  --dsw-alias-border-l2: rgba(255,255,255,0.16);\n  --dsw-alias-border-l3: rgba(255,255,255,0.20);\n  --dsw-alias-border-l4: rgba(255,255,255,0.24);\n  --dsw-alias-border-inverted: rgba(255,255,255,0.14);\n  --dsw-alias-border-inverted2: rgba(255,255,255,0.12);\n  --dsw-alias-markdown-code-block: rgba(16,22,42,0.68);\n  --dsw-alias-markdown-inline-code: rgba(32,38,68,0.72);\n  --dsw-specific-sidebar-fill: rgba(26,32,54,0.35);\n  --dsw-specific-sidebar-nav-item-active: rgba(62,72,122,0.52);\n  --dsw-specific-sidebar-nav-item-active-accent: rgba(74,92,164,0.48);\n  --dsw-specific-sidebar-nav-item-hover: rgba(255,255,255,0.08);\n  --dsw-specific-input-major: rgba(34,40,70,0.62);\n  --dsw-specific-bubble: rgba(48,56,96,0.58);\n  --dsw-specific-bubble-highlight: rgba(72,82,132,0.62);\n  --dsw-specific-menu: rgba(38,44,78,0.86);\n  --dsw-specific-selector: rgba(46,54,92,0.5);\n  --dsw-alias-button-floating-fill: rgba(40,46,80,0.62);\n  --dsw-alias-button-elevated-fill: rgba(40,46,80,0.62);\n}\n\n/* ---------- 3. 应用主框架: 半透明衬底 ----------\n   注意: 框架容器不加 backdrop-filter / filter / transform /\n   contain, 否则会成为 fixed 弹窗(设置/模型切换)的包含块。 */\nbody .pI_x6G_frame {\n  background: linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10));\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.30);\n}\nbody[data-ds-dark-theme] .pI_x6G_frame {\n  background: linear-gradient(135deg, rgba(22,30,56,0.28), rgba(12,18,38,0.20));\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.10);\n}\n\n/* ---------- 4. 侧边栏 ---------- */\nbody .pI_x6G_sidebarCol {\n  background: linear-gradient(160deg, rgba(255,255,255,0.34), rgba(255,255,255,0.20));\n  border-right: 1px solid rgba(255,255,255,0.55);\n  box-shadow: inset -1px 0 0 rgba(255,255,255,0.35), 1px 0 16px rgba(120,140,220,0.08);\n}\nbody[data-ds-dark-theme] .pI_x6G_sidebarCol {\n  background: linear-gradient(160deg, rgba(34,42,72,0.38), rgba(24,30,54,0.30));\n  border-right: 1px solid rgba(255,255,255,0.12);\n  box-shadow: inset -1px 0 0 rgba(255,255,255,0.08), 1px 0 16px rgba(0,0,10,0.18);\n}\n/* 侧边栏内部根容器: 透明, 避免双重着色 */\nbody .hHd-Xa_root { background: transparent; }\n\n/* ---------- 5. 输入框(Composer)玻璃卡片 ----------\n   内容卡片, 不含 fixed 弹层后代, 可安全加磨砂。 */\nbody .uV2eYG_card {\n  background: linear-gradient(135deg, rgba(255,255,255,0.86), rgba(248,250,255,0.58));\n  backdrop-filter: blur(22px) saturate(1.4);\n  -webkit-backdrop-filter: blur(22px) saturate(1.4);\n  border-color: rgba(255,255,255,0.62);\n  box-shadow:\n    0 8px 32px rgba(80,100,180,0.14),\n    inset 0 1px 0 rgba(255,255,255,0.95),\n    inset 0 -1px 0 rgba(0,0,0,0.03);\n  transition: box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s;\n}\nbody[data-ds-dark-theme] .uV2eYG_card {\n  background: linear-gradient(135deg, rgba(46,54,94,0.85), rgba(30,36,64,0.60));\n  border-color: rgba(255,255,255,0.16);\n  box-shadow:\n    0 8px 32px rgba(0,0,12,0.35),\n    inset 0 1px 0 rgba(255,255,255,0.14),\n    inset 0 -1px 0 rgba(0,0,0,0.2);\n}\nbody .uV2eYG_card:focus-within {\n  box-shadow:\n    0 12px 40px rgba(90,120,220,0.20),\n    0 0 0 3px rgba(120,160,255,0.25),\n    inset 0 1px 0 rgba(255,255,255,0.95),\n    inset 0 -1px 0 rgba(0,0,0,0.03);\n  border-color: rgba(140,170,255,0.7);\n}\nbody[data-ds-dark-theme] .uV2eYG_card:focus-within {\n  box-shadow:\n    0 12px 40px rgba(0,0,16,0.45),\n    0 0 0 3px rgba(100,140,255,0.25),\n    inset 0 1px 0 rgba(255,255,255,0.14);\n  border-color: rgba(120,160,255,0.5);\n}\n\n/* ---------- 6. 用户消息气泡 ---------- */\nbody .gdEzaW_bubble {\n  background: linear-gradient(135deg, rgba(255,255,255,0.78), rgba(228,238,255,0.46));\n  backdrop-filter: blur(14px) saturate(1.35);\n  -webkit-backdrop-filter: blur(14px) saturate(1.35);\n  box-shadow:\n    0 4px 18px rgba(80,100,180,0.10),\n    inset 0 1px 0 rgba(255,255,255,0.9);\n}\nbody[data-ds-dark-theme] .gdEzaW_bubble {\n  background: linear-gradient(135deg, rgba(56,66,110,0.62), rgba(40,48,86,0.50));\n  box-shadow:\n    0 4px 18px rgba(0,0,14,0.30),\n    inset 0 1px 0 rgba(255,255,255,0.12);\n}\n\n/* ---------- 7. 弹出菜单 / 弹层面板: 高不透明底色 ----------\n   不加 backdrop-filter: 菜单/面板是 fixed 弹层本身,\n   底色提高到 0.85+ 保证文字可读, 玻璃感来自令牌层。 */\nbody .mufS8W_card,\nbody ._3e4SsG_menu,\nbody .JObwrW_panel {\n  background: rgba(255,255,255,0.85);\n  border-color: rgba(255,255,255,0.6);\n  box-shadow:\n    0 16px 48px rgba(60,80,150,0.18),\n    inset 0 1px 0 rgba(255,255,255,0.95);\n}\nbody[data-ds-dark-theme] .mufS8W_card,\nbody[data-ds-dark-theme] ._3e4SsG_menu,\nbody[data-ds-dark-theme] .JObwrW_panel {\n  background: rgba(40,46,80,0.90);\n  border-color: rgba(255,255,255,0.14);\n  box-shadow:\n    0 16px 48px rgba(0,0,14,0.40),\n    inset 0 1px 0 rgba(255,255,255,0.10);\n}\n\n/* ---------- 8. 输入控件: 半透明字段 (不加滤镜) ---------- */\nbody .zGbnIq_input,\nbody .qSYn7G_search input,\nbody ._7yHdaG_editor {\n  background: rgba(255,255,255,0.55);\n}\nbody[data-ds-dark-theme] .zGbnIq_input,\nbody[data-ds-dark-theme] .qSYn7G_search input,\nbody[data-ds-dark-theme] ._7yHdaG_editor {\n  background: rgba(32,38,66,0.55);\n}\n\n/* ---------- 9. 启动画面: 独立卡片, 可安全加磨砂 ---------- */\nbody ._boot_1ionb_3 { background: transparent; }\nbody ._boot_1ionb_3 ._card_1ionb_26 {\n  padding: 36px 48px;\n  border-radius: 28px;\n  background: rgba(255,255,255,0.62);\n  border: 1px solid rgba(255,255,255,0.6);\n  box-shadow:\n    0 24px 64px rgba(70,90,160,0.20),\n    inset 0 1px 0 rgba(255,255,255,0.95);\n  backdrop-filter: blur(26px) saturate(1.4);\n  -webkit-backdrop-filter: blur(26px) saturate(1.4);\n}\nbody[data-ds-dark-theme] ._boot_1ionb_3 ._card_1ionb_26 {\n  background: rgba(28,34,62,0.64);\n  border-color: rgba(255,255,255,0.16);\n  box-shadow:\n    0 24px 64px rgba(0,0,12,0.45),\n    inset 0 1px 0 rgba(255,255,255,0.12);\n}\n\n/* ---------- 10. 滚动条 ---------- */\nbody {\n  --dsh-scrollbar-thumb: rgba(140,160,220,0.35);\n  --dsh-scrollbar-thumb-hover: rgba(120,140,220,0.55);\n}\nbody[data-ds-dark-theme] {\n  --dsh-scrollbar-thumb: rgba(140,160,220,0.30);\n  --dsh-scrollbar-thumb-hover: rgba(160,180,240,0.45);\n}\n\n/* ---------- 11. 微交互: 悬浮柔光 (只用阴影, 不用 transform) ---------- */\nbody .uV2eYG_add,\nbody .uV2eYG_modes [role=\"button\"] { transition: box-shadow 0.25s ease; }\nbody .uV2eYG_add:hover,\nbody .uV2eYG_modes [role=\"button\"]:hover { box-shadow: 0 0 0 4px rgba(120,160,255,0.18); }\n\n/* ---------- 12. 设置弹窗: 纯视觉美化 ----------\n   定位/尺寸完全交还应用自身 (v1 的 min-width 与 overlay\n   强制定位规则已删除, 那是设置面板跑出页面的根源之一)。 */\nbody .VOzbGW_panel {\n  background: linear-gradient(135deg, rgba(255,255,255,0.90), rgba(244,248,255,0.62));\n  border: 1px solid rgba(255,255,255,0.55);\n  box-shadow:\n    0 24px 80px rgba(60,80,150,0.24),\n    inset 0 1px 0 rgba(255,255,255,0.95),\n    inset 0 0 48px rgba(255,255,255,0.28);\n}\nbody[data-ds-dark-theme] .VOzbGW_panel {\n  background: linear-gradient(135deg, rgba(44,52,94,0.94), rgba(28,34,66,0.86));\n  border-color: rgba(255,255,255,0.14);\n  box-shadow:\n    0 24px 80px rgba(0,0,16,0.55),\n    inset 0 1px 0 rgba(255,255,255,0.12),\n    inset 0 0 48px rgba(255,255,255,0.03);\n}\n\nbody .VOzbGW_nav {\n  background: linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0.26));\n  border-right: 1px solid rgba(255,255,255,0.35);\n}\nbody[data-ds-dark-theme] .VOzbGW_nav {\n  background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));\n  border-right-color: rgba(255,255,255,0.10);\n}\n\nbody .VOzbGW_navCell { border-radius: 12px; transition: background 0.2s ease, box-shadow 0.2s ease; }\nbody .VOzbGW_navCell:hover {\n  background: rgba(255,255,255,0.55);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);\n}\nbody .VOzbGW_navCell.VOzbGW_active {\n  background: linear-gradient(135deg, rgba(255,255,255,0.82), rgba(226,238,255,0.62));\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 16px rgba(80,100,180,0.16);\n}\nbody[data-ds-dark-theme] .VOzbGW_navCell:hover { background: rgba(255,255,255,0.08); }\nbody[data-ds-dark-theme] .VOzbGW_navCell.VOzbGW_active {\n  background: linear-gradient(135deg, rgba(72,86,144,0.68), rgba(52,62,114,0.58));\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 4px 16px rgba(0,0,10,0.25);\n}\n\nbody .VOzbGW_close { border-radius: 999px; transition: background 0.2s ease, box-shadow 0.2s ease; }\nbody .VOzbGW_close:hover {\n  background: rgba(255,255,255,0.55);\n  box-shadow: 0 0 0 4px rgba(120,160,255,0.16);\n}\nbody[data-ds-dark-theme] .VOzbGW_close:hover { background: rgba(255,255,255,0.10); }\n\n/* 外观设置: 明暗主题方块 */\nbody ._8HJdBW_themeCube { transition: border-color 0.25s ease, box-shadow 0.25s ease; }\nbody ._8HJdBW_themeCube:hover:not(._8HJdBW_selected) {\n  border-color: rgba(140,170,255,0.60);\n  box-shadow: 0 4px 16px rgba(80,100,180,0.14);\n}\nbody ._8HJdBW_selected {\n  box-shadow:\n    0 0 0 2px rgba(120,160,255,0.35),\n    0 4px 18px rgba(80,100,180,0.16);\n}\n\nbody .zGbnIq_input:hover,\nbody .qSYn7G_search input:hover {\n  border-color: rgba(140,170,255,0.55);\n}\n\n/* 插件卡片: 展开态 */\nbody .YyYd_a_cardOpen {\n  background: linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.32));\n  border-color: rgba(140,170,255,0.50);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.85), 0 4px 18px rgba(80,100,180,0.10);\n}\nbody[data-ds-dark-theme] .YyYd_a_cardOpen {\n  background: linear-gradient(135deg, rgba(56,66,116,0.55), rgba(40,48,90,0.45));\n  border-color: rgba(120,160,255,0.30);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 18px rgba(0,0,10,0.25);\n}\n\n/* ---------- 13. 设置-模型页: 卡片/徽章/按钮 ---------- */\nbody .zGbnIq_rowCard {\n  background: linear-gradient(135deg, rgba(255,255,255,0.72), rgba(244,248,255,0.46));\n  border: 1px solid rgba(255,255,255,0.5);\n  border-radius: 16px;\n  box-shadow:\n    0 4px 18px rgba(80,100,180,0.10),\n    inset 0 1px 0 rgba(255,255,255,0.9);\n  transition: border-color 0.25s ease, box-shadow 0.25s ease;\n}\nbody .zGbnIq_rowCard:hover {\n  border-color: rgba(140,170,255,0.6);\n  box-shadow:\n    0 6px 22px rgba(80,100,180,0.14),\n    inset 0 1px 0 rgba(255,255,255,0.9);\n}\nbody[data-ds-dark-theme] .zGbnIq_rowCard {\n  background: linear-gradient(135deg, rgba(52,62,104,0.66), rgba(36,44,80,0.50));\n  border-color: rgba(255,255,255,0.14);\n  box-shadow:\n    0 4px 18px rgba(0,0,12,0.28),\n    inset 0 1px 0 rgba(255,255,255,0.12);\n}\nbody[data-ds-dark-theme] .zGbnIq_rowCard:hover {\n  border-color: rgba(120,160,255,0.38);\n}\n\nbody .zGbnIq_rowTag {\n  background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3));\n  border-color: rgba(255,255,255,0.55);\n  border-radius: 999px;\n  padding: 1px 10px;\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 500;\n}\nbody[data-ds-dark-theme] .zGbnIq_rowTag {\n  background: rgba(255,255,255,0.10);\n  border-color: rgba(255,255,255,0.18);\n}\n\nbody .zGbnIq_input,\nbody select.zGbnIq_input {\n  background: rgba(255,255,255,0.55);\n  border: 1px solid rgba(255,255,255,0.55);\n  border-radius: 10px;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);\n  transition: border-color 0.2s ease, box-shadow 0.2s ease;\n}\nbody .zGbnIq_input:focus {\n  border-color: rgba(140,170,255,0.75);\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,0.7),\n    0 0 0 3px rgba(120,160,255,0.18);\n}\nbody[data-ds-dark-theme] .zGbnIq_input,\nbody[data-ds-dark-theme] select.zGbnIq_input {\n  background: rgba(36,44,76,0.55);\n  border-color: rgba(255,255,255,0.14);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);\n}\n\nbody .zGbnIq_primaryButton {\n  background: linear-gradient(135deg, rgba(94,124,255,0.95), rgba(66,96,224,0.92));\n  border-radius: 999px;\n  box-shadow:\n    0 4px 16px rgba(80,110,240,0.35),\n    inset 0 1px 0 rgba(255,255,255,0.35);\n  transition: box-shadow 0.2s ease;\n}\nbody .zGbnIq_primaryButton:hover:not(:disabled) {\n  box-shadow:\n    0 6px 22px rgba(80,110,240,0.42),\n    inset 0 1px 0 rgba(255,255,255,0.35);\n}\n\nbody .zGbnIq_secondaryButton,\nbody .zGbnIq_addButton {\n  border-radius: 999px;\n  background: rgba(255,255,255,0.5);\n  border-color: rgba(255,255,255,0.55);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);\n  transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;\n}\nbody .zGbnIq_secondaryButton:hover:not(:disabled),\nbody .zGbnIq_addButton:hover:not(:disabled) {\n  background: rgba(255,255,255,0.65);\n  border-color: rgba(140,170,255,0.55);\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 3px rgba(120,160,255,0.14);\n}\nbody[data-ds-dark-theme] .zGbnIq_secondaryButton,\nbody[data-ds-dark-theme] .zGbnIq_addButton {\n  background: rgba(255,255,255,0.08);\n  border-color: rgba(255,255,255,0.16);\n}\nbody[data-ds-dark-theme] .zGbnIq_secondaryButton:hover:not(:disabled),\nbody[data-ds-dark-theme] .zGbnIq_addButton:hover:not(:disabled) {\n  background: rgba(255,255,255,0.12);\n  border-color: rgba(120,160,255,0.4);\n}\n\nbody .zGbnIq_dangerButton { border-radius: 999px; transition: background 0.2s ease; }\n\nbody .zGbnIq_editor,\nbody .zGbnIq_addCard,\nbody .zGbnIq_setupCard {\n  background: linear-gradient(135deg, rgba(255,255,255,0.66), rgba(244,248,255,0.42));\n  border: 1px solid rgba(255,255,255,0.5);\n  border-radius: 16px;\n  box-shadow:\n    0 4px 18px rgba(80,100,180,0.10),\n    inset 0 1px 0 rgba(255,255,255,0.9);\n}\nbody[data-ds-dark-theme] .zGbnIq_editor,\nbody[data-ds-dark-theme] .zGbnIq_addCard,\nbody[data-ds-dark-theme] .zGbnIq_setupCard {\n  background: linear-gradient(135deg, rgba(50,60,100,0.62), rgba(34,42,76,0.48));\n  border-color: rgba(255,255,255,0.14);\n  box-shadow:\n    0 4px 18px rgba(0,0,12,0.26),\n    inset 0 1px 0 rgba(255,255,255,0.10);\n}\n\nbody .zGbnIq_modelEntry {\n  background: rgba(255,255,255,0.4);\n  border-color: rgba(255,255,255,0.45);\n  border-radius: 10px;\n  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);\n}\nbody[data-ds-dark-theme] .zGbnIq_modelEntry {\n  background: rgba(255,255,255,0.06);\n  border-color: rgba(255,255,255,0.14);\n}\n\nbody .zGbnIq_advancedHint {\n  color: var(--dsw-alias-label-tertiary);\n  letter-spacing: 0.01em;\n}\n\n/* ---------- 14. 字体排版层级 (只改字重/颜色, 不改字号) ---------- */\nbody .VOzbGW_navTitle { font-weight: 600; }\nbody .zGbnIq_title { font-weight: 600; }\nbody .pbvGtq_heading { font-weight: 600; }\n\nbody .VOzbGW_trigger { font-weight: 500; }\nbody .VOzbGW_navCell { font-weight: 500; }\nbody .VOzbGW_navCell.VOzbGW_active { font-weight: 600; }\n\nbody .T1PP_q_title,\nbody .hVGvvW_title,\nbody ._8HJdBW_title,\nbody .zGbnIq_rowName,\nbody .zGbnIq_editorTitle,\nbody .zGbnIq_fieldLabel,\nbody .At1oFq_label { font-weight: 500; }\n\nbody .YyYd_a_name { font-weight: 600; }\n\nbody .T1PP_q_desc,\nbody .zGbnIq_intro,\nbody .YyYd_a_description,\nbody .At1oFq_hint,\nbody .zGbnIq_advancedHint {\n  font-weight: 400;\n  color: var(--dsw-alias-label-tertiary);\n}\n\nbody .zGbnIq_primaryButton,\nbody .zGbnIq_secondaryButton,\nbody .zGbnIq_addButton,\nbody .zGbnIq_dangerButton,\nbody .YyYd_a_save,\nbody .YyYd_a_discard { font-weight: 500; }\n\nbody .pbvGtq_tab[data-active=\"true\"] { font-weight: 600; }\n\n/* ---------- 16. 可读性增强 (壁纸/视频上层文字) ----------\n   背景为视频/图片时文字需要更重更清晰: 聊天列与侧栏默认字重\n   提升一档 (400→500, 经继承生效, 不覆盖应用显式字重), 并加轻\n   描边提高与 busy 背景的对比; 深色模式用暗色描边。 */\nbody .pI_x6G_centerCol,\nbody .pI_x6G_sidebarCol { font-weight: 500; letter-spacing: 0.01em; }\nbody .pI_x6G_centerCol { text-shadow: 0 1px 2px rgba(255,255,255,0.38); }\nbody[data-ds-dark-theme] .pI_x6G_centerCol { text-shadow: 0 1px 2px rgba(0,0,0,0.5); }\n\n/* 重点文字再加重: 会话标题/状态栏/模式标签 */\nbody .pI_x6G_centerCol h1,\nbody .pI_x6G_centerCol h2,\nbody .pI_x6G_centerCol h3 { font-weight: 700; }\n";
    var wallpaperCss = "\n.dsh-glass-theme-wp-host { position: relative; isolation: isolate; }\n.dsh-glass-theme-wp-host [class*=\"wSkVaW_root\"] { background: transparent; }\n.dsh-glass-theme-wp-host [class*=\"wSkVaW_composerSeat\"] { background: transparent; }\n.dsh-glass-theme-wp-host [class*=\"qBU-ya_root\"],\n.dsh-glass-theme-wp-host [class*=\"Y0dWHa_split\"],\n.dsh-glass-theme-wp-host [class*=\"Y0dWHa_table\"],\n.dsh-glass-theme-wp-host [class*=\"fV0t5q_root\"],\n.dsh-glass-theme-wp-host [class*=\"1p9O6q_plot\"] { background: transparent; }\n.dsh-glass-theme-wallpaper { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }\n.dsh-glass-theme-wallpaper > img,\n.dsh-glass-theme-wallpaper > video { width: 100%; height: 100%; object-fit: cover; display: block; }\n.dsh-glass-theme-wallpaper > .dsh-glass-theme-wp-scrim { position: absolute; inset: 0; background: rgba(255,255,255,0.30); }\nbody[data-ds-dark-theme] .dsh-glass-theme-wallpaper > .dsh-glass-theme-wp-scrim { background: rgba(8,10,20,0.38); }\n";

    var GLASS_SELECTOR = 'style[data-plugin-css="dsh-glass-theme/soft-glass.css"]';
    var WP_SELECTOR = 'style[data-plugin-css="dsh-glass-theme/wallpaper.css"]';
    var STORE_KEY = "dsh-glass-theme.enabled";
    var VOLUME_KEY = "dsh-glass-theme.volume";
    var WP_API = "/dsh-glass-theme/wallpaper";
    var WP_HOST_CLASS = "dsh-glass-theme-wp-host";
    var WP_LAYER_CLASS = "dsh-glass-theme-wallpaper";

    function readEnabled() {
      try {
        var v = localStorage.getItem(STORE_KEY);
        return v === null ? true : v === "1";
      } catch (e) { return true; }
    }
    function writeEnabled(on) {
      try { localStorage.setItem(STORE_KEY, on ? "1" : "0"); } catch (e) {}
    }
    function readVolume() {
      var v = parseFloat(localStorage.getItem(VOLUME_KEY));
      return isFinite(v) && v >= 0 && v <= 1 ? v : 0.5;
    }
    function writeVolume(v) {
      try { localStorage.setItem(VOLUME_KEY, String(v)); } catch (e) {}
    }

    function ensureTag(selector, content) {
      if (typeof document === "undefined") return;
      var tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("style");
        tag.dataset.plugin = "dsh-glass-theme";
        tag.dataset.pluginCss = selector.split('"')[1];
        document.head.appendChild(tag);
      }
      if (tag.textContent !== content) tag.textContent = content;
    }

    function install() {
      if (typeof document === "undefined") return;
      ensureTag(WP_SELECTOR, wallpaperCss);
      var tag = document.querySelector(GLASS_SELECTOR);
      if (!readEnabled()) {
        if (tag && tag.parentNode) tag.parentNode.removeChild(tag);
        return;
      }
      ensureTag(GLASS_SELECTOR, css);
    }

    install();

    /* -------- 聊天区背景壁纸: 服务端存储 + 启动自动恢复 -------- */

    var currentRec = null;

    function findChatHost() {
      return document.querySelector('[class*="pI_x6G_centerCol"]');
    }

    /* Muted autoplay is always allowed; unmuted autoplay is not. So always
       start muted, then try to open the sound once playback began — if the
       browser blocks it the video would pause, so we re-mute and retry muted,
       and a real user gesture (pointerdown/keydown) unmutes for good. */
    function attachVideoPlayback(el) {
      var v = readVolume();
      el.volume = v;
      el.muted = true;
      var keepPlaying = function () {
        try {
          el.volume = readVolume();
          el.muted = readVolume() <= 0.001;
          if (el.paused) { var p0 = el.play(); if (p0 && p0.catch) p0.catch(function () {}); }
        } catch (e) {}
      };
      var started = function () {
        el.removeEventListener("playing", started);
        if (v > 0.001 && navigator.userActivation && navigator.userActivation.hasBeenActive) {
          setTimeout(function () {
            try {
              el.muted = false; el.volume = readVolume();
              if (el.paused) { el.muted = true; var p = el.play(); if (p && p.catch) p.catch(function () {}); }
            } catch (e) {}
          }, 200);
        }
      };
      el.addEventListener("playing", started);
      // Insurance for files with broken duration metadata where loop fails.
      el.addEventListener("ended", function () {
        var p2 = el.play();
        if (p2 && p2.catch) p2.catch(function () {});
      });
      window.addEventListener("pointerdown", keepPlaying, true);
      window.addEventListener("keydown", keepPlaying, true);
      var p = el.play();
      if (p && p.catch) p.catch(function () {});
      // Some environments start paused despite the autoplay attribute; retry.
      var playTries = 0;
      var playTimer = setInterval(function () {
        playTries += 1;
        if (playTries > 30 || !el.isConnected) { clearInterval(playTimer); return; }
        if (el.paused) { var pp = el.play(); if (pp && pp.catch) pp.catch(function () {}); }
      }, 1000);
    }

    /* The composer seat paints a transparent-to-white gradient over the
       bottom of the chat column (behind the input card and the status bar);
       clear it so the wallpaper reaches the input area. React may restore it
       on re-render, so the watchdog re-clears as well. */
    function clearComposerSeat() {
      var seat = document.querySelector('[class*="wSkVaW_composerSeat"]');
      if (seat && seat.style.backgroundImage !== "none") seat.style.backgroundImage = "none";
    }

    function mountWallpaper(rec) {
      if (typeof document === "undefined" || !rec) return;
      var host = findChatHost();
      if (!host) return;
      host.classList.add(WP_HOST_CLASS);
      var layer = host.querySelector("." + WP_LAYER_CLASS);
      if (layer && layer.dataset.src === rec.src) return; // already mounted, keep playback
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
      layer = document.createElement("div");
      layer.className = WP_LAYER_CLASS;
      layer.dataset.src = rec.src;
      var el;
      if (/^video\//.test(rec.type || "")) {
        el = document.createElement("video");
        el.setAttribute("autoplay", "");
        el.setAttribute("loop", "");
        el.setAttribute("playsinline", "");
        attachVideoPlayback(el);
      } else {
        el = document.createElement("img");
        el.alt = "";
      }
      el.src = rec.src;
      el.style.position = "absolute";
      el.style.inset = "0";
      var scrim = document.createElement("div");
      scrim.className = "dsh-glass-theme-wp-scrim";
      layer.appendChild(el);
      layer.appendChild(scrim);
      host.appendChild(layer);
      clearComposerSeat();
      currentRec = rec;
    }

    function unmountWallpaper() {
      var host = findChatHost();
      if (host) {
        var layer = host.querySelector("." + WP_LAYER_CLASS);
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        host.classList.remove(WP_HOST_CLASS);
      }
      currentRec = null;
    }

    /* Re-mount the layer if a framework re-render drops it, and mount once
       the chat column first appears. Idempotent via layer.dataset.src. */
    function ensureWatch() {
      if (typeof MutationObserver === "undefined") return;
      var scheduled = false;
      var check = function () {
        scheduled = false;
        if (!currentRec) return;
        try {
          var host = findChatHost();
          if (!host || !host.querySelector("." + WP_LAYER_CLASS)) { mountWallpaper(currentRec); return; }
          clearComposerSeat();
        } catch (e) {}
      };
      var obs = new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        setTimeout(check, 300);
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
    ensureWatch();

    function bootWallpaper() {
      fetch(WP_API + "?meta=1", { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (meta) {
          if (!meta || !meta.exists) return;
          var tries = 0;
          var timer = setInterval(function () {
            tries += 1;
            if (findChatHost()) {
              clearInterval(timer);
              mountWallpaper({
                src: WP_API + "?t=" + meta.mtime,
                name: meta.name,
                type: meta.type,
              });
            } else if (tries > 240) {
              clearInterval(timer);
            }
          }, 500);
        })
        .catch(function () {});
    }
    bootWallpaper();

    window.__dshGlassTheme = {
      setWallpaper: function (file, name) {
        return fetch(WP_API, {
          method: "POST",
          headers: {
            "x-glass-name": encodeURIComponent(name || file.name || "wallpaper"),
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.ok) {
              mountWallpaper({
                src: WP_API + "?t=" + Date.now(),
                name: res.name || name,
                type: res.type || file.type,
              });
            }
            return res;
          });
      },
      clearWallpaper: function () {
        return fetch(WP_API, { method: "DELETE" }).then(function () {
          unmountWallpaper();
        });
      },
      setVolume: function (v) {
        v = Math.max(0, Math.min(1, v));
        writeVolume(v);
        var el = document.querySelector("." + WP_LAYER_CLASS + " > video");
        if (el) {
          el.volume = v;
          el.muted = v <= 0.001;
          if (!el.muted && el.paused) { var p = el.play(); if (p && p.catch) p.catch(function () {}); }
        }
        return v;
      },
      getVolume: readVolume,
    };

    /* ---------------- 设置页 UI ---------------- */

    var st = {
      card: {
        padding: "6px 20px", maxWidth: 720, borderRadius: 16, color: "#3c4454",
        background: "linear-gradient(135deg, rgba(255,255,255,0.72), rgba(244,248,255,0.46))",
        border: "1px solid rgba(120,140,190,0.28)",
        boxShadow: "0 4px 18px rgba(80,100,180,0.10)",
      },
      row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "14px 0" },
      rowTitle: { margin: 0, fontSize: 14.5, fontWeight: 600 },
      hint: { margin: "5px 0 0", fontSize: 12.5, lineHeight: 1.6, color: "#69707f", maxWidth: 480 },
      divider: { height: 1, background: "rgba(120,140,190,0.18)" },
      button: {
        padding: "7px 14px", borderRadius: 999, cursor: "pointer", fontSize: 12.5, fontWeight: 500,
        color: "#3c4454", border: "1px solid rgba(120,140,190,0.4)",
        background: "rgba(255,255,255,0.55)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        marginLeft: 8,
      },
      buttonDisabled: { opacity: 0.45, cursor: "default" },
      status: { fontSize: 12, color: "#69707f", marginTop: 6, maxWidth: 480, wordBreak: "break-all" },
      controls: { display: "flex", alignItems: "center", flexShrink: 0 },
      slider: { width: 180, accentColor: "#5b7cfa", cursor: "pointer" },
      sliderLabel: { fontSize: 12.5, color: "#3c4454", width: 42, textAlign: "right", flexShrink: 0 },
    };

    function Switch(props) {
      var on = props.on;
      var track = {
        position: "relative", width: 44, height: 26, borderRadius: 999, border: "none",
        cursor: "pointer", padding: 0, flexShrink: 0,
        transition: "background 0.2s ease",
        background: on ? "linear-gradient(135deg, #7d9bff, #4a6ce0)" : "rgba(120,130,155,0.35)",
        boxShadow: "inset 0 1px 3px rgba(0,0,20,0.18)",
      };
      var knob = {
        position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20,
        borderRadius: "50%", background: "#fff",
        transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "0 1px 4px rgba(0,0,20,0.25)",
      };
      return react.createElement("button", {
        type: "button", role: "switch", "aria-checked": on, "aria-label": props.label,
        onClick: props.onToggle, style: track,
      }, react.createElement("span", { style: knob }));
    }

    function Row(props) {
      return react.createElement("div", { style: st.row },
        react.createElement("div", null,
          react.createElement("p", { style: st.rowTitle }, props.title),
          props.hint ? react.createElement("p", { style: st.hint }, props.hint) : null,
          props.status ? react.createElement("p", { style: st.status }, props.status) : null
        ),
        props.control
      );
    }

    function VolumeSlider(props) {
      var s = react.useState(Math.round(readVolume() * 100));
      var val = s[0], setVal = s[1];
      var onChange = function (e) {
        var pct = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
        setVal(pct);
        window.__dshGlassTheme.setVolume(pct / 100);
      };
      return react.createElement("div", { style: st.controls },
        react.createElement("input", {
          type: "range", min: 0, max: 100, step: 1, value: val,
          "aria-label": "壁纸音量", onChange: onChange, style: st.slider,
        }),
        react.createElement("span", { style: st.sliderLabel }, val + "%")
      );
    }

    function WallpaperControls(props) {
      var inputRef = react.useRef(null);
      var name = props.name;
      var onPick = function () { if (inputRef.current) inputRef.current.click(); };
      var onFile = function (e) {
        var f = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!f) return;
        if (!/^image\//.test(f.type) && !/^video\//.test(f.type)) {
          window.alert("仅支持图片或视频文件");
          return;
        }
        props.onSet(f);
      };
      return react.createElement("div", { style: st.controls },
        react.createElement("input", {
          ref: inputRef, type: "file", accept: "image/*,video/*", style: { display: "none" },
          onChange: onFile,
        }),
        react.createElement("button", { type: "button", style: st.button, onClick: onPick }, "选择文件"),
        react.createElement("button", {
          type: "button", style: name ? st.button : Object.assign({}, st.button, st.buttonDisabled),
          onClick: name ? props.onClear : undefined,
        }, "清除")
      );
    }

    function ThemeSection() {
      var s = react.useState(readEnabled);
      var glassOn = s[0], setGlassOn = s[1];
      var toggleGlass = function () {
        var next = !glassOn;
        setGlassOn(next);
        writeEnabled(next);
        install();
      };
      var ws = react.useState({ name: null, type: "", error: "" });
      var wp = ws[0], setWp = ws[1];
      react.useEffect(function () {
        var load = function () {
          fetch(WP_API + "?meta=1", { cache: "no-store" })
            .then(function (r) { return r.json(); })
            .then(function (meta) {
              if (meta && meta.exists) setWp({ name: meta.name, type: meta.type || "", error: "" });
              else setWp({ name: null, type: "", error: "" });
            })
            .catch(function (e) { setWp({ name: null, type: "", error: "无法连接壁纸服务: " + e }); });
        };
        load();
        var onVisible = function () { if (!document.hidden) load(); };
        document.addEventListener("visibilitychange", onVisible);
        return function () { document.removeEventListener("visibilitychange", onVisible); };
      }, []);
      var onWpSet = function (f) {
        setWp({ name: f.name, type: f.type, error: "" });
        window.__dshGlassTheme.setWallpaper(f, f.name).catch(function (e) {
          setWp({ name: null, type: "", error: "上传失败: " + e });
        });
      };
      var onWpClear = function () {
        setWp({ name: null, type: "", error: "" });
        window.__dshGlassTheme.clearWallpaper().catch(function () {});
      };
      var isVideo = /^video\//.test(wp.type || "");

      // 主题美化功能逐行加入这里: { key, title, hint, control }
      var rows = [
        {
          key: "glass",
          title: "柔光玻璃主题",
          hint: "半透明磨砂玻璃外观（毛玻璃 + 边缘高光 + 渐变壁纸）。" +
                "关闭后立即恢复原生界面，设置保存在当前浏览器。",
          control: react.createElement(Switch, { on: glassOn, onToggle: toggleGlass, label: "柔光玻璃主题" }),
        },
        {
          key: "wallpaper",
          title: "聊天区背景壁纸",
          hint: "上传图片或视频，作为聊天框内的背景；比例不符时自动按框体裁剪，" +
                "页面缩放无需修正。文件保存在本机 Harness 数据目录，重启后自动恢复。" +
                (isVideo ? "视频循环播放，可在下方调节音量。" : ""),
          control: react.createElement(WallpaperControls, { name: wp.name, onSet: onWpSet, onClear: onWpClear }),
          status: wp.error ? ("壁纸异常：" + wp.error)
            : (wp.name ? "当前壁纸：" + wp.name : "未设置壁纸"),
        },
      ];
      if (isVideo) {
        rows.push({
          key: "wpvolume",
          title: "壁纸音量",
          hint: "调节视频壁纸的播放音量；页面首次交互后生效（浏览器自动播放策略）。",
          control: react.createElement(VolumeSlider),
        });
      }

      var children = [];
      for (var i = 0; i < rows.length; i++) {
        if (i > 0) children.push(react.createElement("div", { style: st.divider, key: "d" + i }));
        children.push(react.createElement(Row, Object.assign({ key: rows[i].key }, rows[i])));
      }
      return react.createElement("div", { style: st.card }, children);
    }

    function apply(ctx) {
      ctx.slots.inject("settings.section", function () {
        return ctx.slots.register({
          name: "settings.section",
          id: "dsh-glass-theme",
          order: 60,
          label: function () { return "主题"; },
          locale: "dsh-glass-theme",
          inject: function () { return {}; }
        }, function () { return react.createElement(ThemeSection); });
      });
    }

    return { name: "dsh-glass-theme", apply: apply, inject: ["slots"] };
  }
});
