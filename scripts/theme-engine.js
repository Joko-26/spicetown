(function() {
  let activeTheme = "";
  let bodyObserver = null;

  const init = () => {
    chrome.storage.local.get(['selectedTheme'], (result) => {
      activeTheme = result.selectedTheme || localStorage.getItem("bg-color-theme");
      if (activeTheme) {
        startThemeEngine(activeTheme);
      }
    });

    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === "THEME_UPDATED") {
        activeTheme = request.themeId;
        startThemeEngine(activeTheme);
      }
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.selectedTheme) {
        activeTheme = changes.selectedTheme.newValue;
        startThemeEngine(activeTheme);
      }
    });
  };

  function startThemeEngine(themeId) {
    activeTheme = themeId;

    if (!bodyObserver) {
      bodyObserver = new MutationObserver(() => {
        const body = document.body;
        if (body) {
          applyTheme(body, activeTheme);
        }
      });

      bodyObserver.observe(document.documentElement, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ["data-theme"] 
      });
    }

    if (document.body) {
      applyTheme(document.body, themeId);
    }
  }

  function shiftLightness(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    l = Math.max(0, Math.min(1, l + (percent / 100)));
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  function applyTheme(body, themeId) {
    if (!body) return;
    const refreshHat = () => {
      const hat = body.querySelector(".sidebar__user-avatar-hat-bg");
      if (hat) updateHatImage(themeId, hat);
    };
    
    const currentTheme = body.getAttribute("data-theme");
    const needsThemeUpdate = currentTheme !== themeId || themeId === "custom";
    if (needsThemeUpdate) {
      if (themeId === "custom") {
        if (currentTheme !== "custom") body.setAttribute("data-theme", "custom");
        
        chrome.storage.local.get(["customThemeValues"], (res) => {
          const values = res.customThemeValues;
          if (!values) return;

          const bg = values["--bg-primary"];
          const card = values["--surface-card"];
          const accent = values["--accent"];
          const text = values["--text-primary"];

          const derived = {
            "--bg-primary": bg,
            "--text-primary": text,
            "--text-highlight": text,
            "--surface-card": card,
            "--accent": accent,
            "--surface-header": shiftLightness(bg, 8),
            "--surface-header-backdrop": shiftLightness(bg, 15),
            "--surface-dark": shiftLightness(bg, -10),
            "--kitchen-bar-bg": shiftLightness(bg, -5),
            "--input-main-bg": shiftLightness(bg, 10),
            "--border-color": shiftLightness(card, -15),
            "--input-sub-bg": shiftLightness(card, -8),
            "--accent-darker": shiftLightness(accent, -15),
            "--accent-muted": shiftLightness(accent, -10),
            "--accent-semi-transparent": accent + "4d",
            "--kitchen-gradient": `linear-gradient(90deg, ${text} 0%, ${accent} 100%)`,
            "--projects-show-timeline-url": `url('data:image/svg+xml,<svg width="8" height="90" viewBox="0 0 4 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="4" height="30" rx="2" fill="${encodeURIComponent(accent)}"/></svg>')`
          };

          Object.entries(derived).forEach(([variable, value]) => {
            if (body.style.getPropertyValue(variable) !== value) {
              body.style.setProperty(variable, value);
            }
          });

          refreshHat();
        });
      } else if (themeId === "bg-color-vanilla") {
        body.removeAttribute("data-theme");
        body.style.removeProperty("--theme-bg-image");
        body.style.cssText = "";
      } else {
        body.setAttribute("data-theme", themeId);
        body.style.cssText = ""; 
        updateBodyStyles(themeId, body);
      }
    }
    refreshHat();
  }

  function updateBodyStyles(themeId, body) {
    if (themeId === "bg-color-vanilla") {
      body.style.removeProperty("--theme-bg-image");
      return;
    }

    const localThemes = ["ruby", "dracula", "charcoal", "midnight", "aurora"];
    const remoteThemes = {
      "bg-color-catppuccin-mocha": "https://i.ibb.co/fYQVfZbb/Mask-group-12.png",
      "bg-color-catppuccin-macchiato": "https://i.ibb.co/C5mZtM9R/Mask-group-13.png",
      "bg-color-leafy": "https://i.ibb.co/qFNQLtjq/Mask-group-21.png"
    };
    const shortName = themeId.replace("bg-color-", "");
    let bgUrl = localThemes.includes(shortName) 
      ? chrome.runtime.getURL(`/themes/bg-color/${shortName}/bg.png`)
      : remoteThemes[themeId];
    const currentProp = body.style.getPropertyValue("--theme-bg-image");

    if (bgUrl && currentProp !== `url("${bgUrl}")`) {
      body.style.setProperty("--theme-bg-image", `url('${bgUrl}')`);
    }
  }

  function updateHatImage(themeId, hatEl) {
    const hatMap = {
      "bg-color-ruby": "https://i.ibb.co/YBF6TqZ0/Mask-group-19.png",
      "bg-color-catppuccin-mocha": "https://i.ibb.co/cSZ853Kk/Mask-group-17.png",
      "bg-color-catppuccin-macchiato": "https://i.ibb.co/zhK0H9KW/Mask-group-16.png",
      "bg-color-charcoal": "https://hc-cdn.hel1.your-objectstorage.com/s/v3/d6258e630f490ea0_mask.png",
      "bg-color-leafy": "https://i.ibb.co/S7wr4DvT/Mask-group-20.png",
      "bg-color-midnight": chrome.runtime.getURL("/themes/bg-color/midnight/user-avatar-hat-bg.png")
    };

    if (hatMap[themeId]) {
      hatEl.style.display = "block";
      if (hatEl.src !== hatMap[themeId]) {
        hatEl.src = hatMap[themeId];
      }
    } else {
      hatEl.style.display = "none";
    }
  }
  init();
})();