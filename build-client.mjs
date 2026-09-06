// Rebuild client.js by embedding soft-glass.css into the ModuleLoader template.
// Usage: node build-client.mjs   (run inside .dsh-glass-theme/)
// The generated client provides:
//   1. the glass stylesheet, applied immediately at boot (respecting the
//      localStorage on/off switch, default ON)
//   2. a "主题" section in the harness settings page: 柔光玻璃 toggle,
//      聊天区背景壁纸 (image/video upload, stored server-side), and a
//      壁纸音量 slider for video wallpapers
// After rebuilding, re-install into the dsh profile and restart, see README.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, 'soft-glass.css'), 'utf8');

// Wallpaper CSS lives in its own style tag: independent of the glass toggle.
// The host-relative rule neutralizes the conversation view's own opaque white
// background so the wallpaper shows through; scoped under the host class so a
// hash drift can only make it no-op, never leak.
const wallpaperCss = `
.dsh-glass-theme-wp-host { position: relative; isolation: isolate; }
.dsh-glass-theme-wp-host [class*="wSkVaW_root"] { background: transparent; }
.dsh-glass-theme-wp-host [class*="wSkVaW_composerSeat"] { background: transparent; }
.dsh-glass-theme-wp-host [class*="qBU-ya_root"],
.dsh-glass-theme-wp-host [class*="Y0dWHa_split"],
.dsh-glass-theme-wp-host [class*="Y0dWHa_table"],
.dsh-glass-theme-wp-host [class*="fV0t5q_root"],
.dsh-glass-theme-wp-host [class*="1p9O6q_plot"] { background: transparent; }
.dsh-glass-theme-wallpaper { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.dsh-glass-theme-wallpaper > img,
.dsh-glass-theme-wallpaper > video { width: 100%; height: 100%; object-fit: cover; display: block; }
.dsh-glass-theme-wallpaper > .dsh-glass-theme-wp-scrim { position: absolute; inset: 0; background: rgba(255,255,255,0.30); }
body[data-ds-dark-theme] .dsh-glass-theme-wallpaper > .dsh-glass-theme-wp-scrim { background: rgba(8,10,20,0.38); }
`;

const client = `window.__ModuleLoader__.load({
  id: "dsh-glass-theme",
  factory: (require) => {
    var react = require("react");
    // Complete stylesheets are embedded because browser clients cannot read workspace files.
    var css = ${JSON.stringify(css)};
    var wallpaperCss = ${JSON.stringify(wallpaperCss)};

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
      if (/^video\\//.test(rec.type || "")) {
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
        if (!/^image\\//.test(f.type) && !/^video\\//.test(f.type)) {
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
      var isVideo = /^video\\//.test(wp.type || "");

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
`;

writeFileSync(join(here, 'client.js'), client, 'utf8');
console.log('client.js rebuilt,', css.length, 'css chars,', wallpaperCss.trim().length, 'wallpaper css chars');
