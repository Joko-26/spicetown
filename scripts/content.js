let apiKey = "Wait! We're trying to obtain the API Key for you..."

function initialize() {
  const topCollabDiv = document.querySelector(".top-collab img");
  if (topCollabDiv) {
    const spicetownIcon = document.createElement("img");
    spicetownIcon.src = chrome.runtime.getURL("/images/hc-gh&st-collab.png");
    spicetownIcon.style.height = "45px";
    spicetownIcon.style.width = "auto";

    topCollabDiv.insertAdjacentElement("afterend", spicetownIcon);
  }

  // settings related
  addSpicetownSettings(); // must go BEFORE applySettingsSync()
  applySettingsSync();
  applyUISync();

  // non settings related
  addBannerTemplateHint();
}

async function addSpicetownSettings() {
  const settingsForm = await document.querySelector(".settings-form");
  const modalActions = await settingsForm.querySelector(".modal__actions");
  const saveBtn = modalActions.querySelector(".modal__actions-close");

  if (!settingsForm || !modalActions || !saveBtn) return;

  // screenshare mode
  const screenshareModeDiv = document.createElement("div");
  screenshareModeDiv.classList.add("settings-form__field");

  const screenshareModeCheckbox = document.createElement("label");
  screenshareModeCheckbox.classList.add("settings-form__checkbox");
  screenshareModeDiv.appendChild(screenshareModeCheckbox);

  const screenshareModeBoxInput = document.createElement("input");
  screenshareModeBoxInput.type = "checkbox";
  screenshareModeBoxInput.name = "screenshare_mode";
  screenshareModeBoxInput.id = "screenshare_mode";
  screenshareModeBoxInput.value = 1;
  screenshareModeCheckbox.appendChild(screenshareModeBoxInput);

  const screenshareModeTitle = document.createElement("span");
  screenshareModeTitle.textContent = "Screenshare Mode"
  screenshareModeCheckbox.appendChild(screenshareModeTitle);

  const screenshareModeHint = document.createElement("small");
  screenshareModeHint.classList.add("settings-form__hint");
  screenshareModeHint.textContent = "Replace sensitive information blurring with secure, black boxes"
  screenshareModeDiv.appendChild(screenshareModeHint);

  settingsForm.insertBefore(screenshareModeDiv, modalActions);

  saveBtn.addEventListener("click", function() {
    saveSetting(screenshareModeBoxInput.checked);
  });

  // settings v2
  const apiKeyDisplay = document.querySelector(".api-key-display");
  if (apiKeyDisplay) {
    const apiKeyContainer = apiKeyDisplay.parentElement
    const apiKeyDiv = apiKeyContainer.parentElement;
    apiKeyDiv.classList.add("api-key__div");

    const rerollApiForm = apiKeyContainer.querySelector("form.button_to");

    const rerollApiHeading = document.createElement("div");
    rerollApiHeading.classList.add("api-key-info__div")
    apiKeyDiv.insertBefore(rerollApiHeading, apiKeyContainer);

    const rerollApiLabel = apiKeyDiv.querySelector("label.settings-form__label");

    rerollApiHeading.appendChild(rerollApiLabel);
    rerollApiHeading.appendChild(rerollApiForm);

    const rerollApiBtn = rerollApiForm.querySelector("button");
    rerollApiBtn.style.background = "none";
    rerollApiBtn.style.border = "none";
    rerollApiBtn.style.cursor = "pointer";

    const rerollApiSvg = rerollApiForm.querySelector("svg");
    rerollApiSvg.style.color = "var(--color-text-body)";

    const copyApiBtn = document.createElement("button");
    copyApiBtn.style.height = "24px";
    copyApiBtn.style.background = "none";
    copyApiBtn.style.border = "none";
    copyApiBtn.style.cursor = "pointer";
    copyApiBtn.addEventListener("click", function() {
      navigator.clipboard.writeText(apiKey);
      document.getElementById('settings-modal').close();
    });

    apiKeyContainer.appendChild(copyApiBtn);

    const copyApiSvg = rerollApiSvg.cloneNode(false);
    rerollApiSvg.style.width = "16";
    rerollApiSvg.style.height = "16";
    copyApiBtn.appendChild(copyApiSvg);

    const copyApiSvgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    copyApiSvgRect.setAttribute("width", "14");
    copyApiSvgRect.setAttribute("height", "14");
    copyApiSvgRect.setAttribute("x", "8");
    copyApiSvgRect.setAttribute("y", "8");
    copyApiSvgRect.setAttribute("rx", "2");
    copyApiSvgRect.setAttribute("ry", "2");
    copyApiSvg.appendChild(copyApiSvgRect);

    const copyApiSvgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    copyApiSvgPath.setAttribute("d", "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2");
    copyApiSvg.appendChild(copyApiSvgPath);
  }
  
  // theming menu
  const sidebarNavList = document.querySelector(".sidebar__nav-list");
  if (sidebarNavList) {
    const themesNavItem = document.createElement("ul");
    themesNavItem.classList.add("sidebar__nav-list");
    sidebarNavList.appendChild(themesNavItem);

    const themesNavLink = document.createElement("a");
    themesNavLink.classList.add("sidebar__nav-link");
    themesNavLink.href = "/themes";
    themesNavItem.appendChild(themesNavLink);

    const themesNavIconSpan = document.createElement("span");
    themesNavIconSpan.classList.add("sidebar__nav-icon-wrapper");
    themesNavIconSpan.ariaHidden = true;
    themesNavLink.appendChild(themesNavIconSpan);

    const themesNavIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    themesNavIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    themesNavIcon.setAttribute("width", "24");
    themesNavIcon.setAttribute("height", "24");
    themesNavIcon.setAttribute("viewBox", "0 0 24 24");
    themesNavIcon.classList.add("sidebar__nav-icon");
    themesNavIconSpan.appendChild(themesNavIcon);

    const themesNavIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    themesNavIconPath.setAttribute("d", "M10.8468 21.9342C5.86713 21.3624 2 17.1328 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.1565 18.7173 16.7325 15.9135 16.3703C14.2964 16.1614 12.8386 15.9731 12.2619 16.888C11.8674 17.5136 12.2938 18.2938 12.8168 18.8168C13.4703 19.4703 13.4703 20.5297 12.8168 21.1832C12.2938 21.7062 11.5816 22.0186 10.8468 21.9342ZM11.085 6.99976C11.085 7.82818 10.4134 8.49976 9.585 8.49976C8.75658 8.49976 8.085 7.82818 8.085 6.99976C8.085 6.17133 8.75658 5.49976 9.585 5.49976C10.4134 5.49976 11.085 6.17133 11.085 6.99976ZM6.5 13C7.32843 13 8 12.3284 8 11.5C8 10.6716 7.32843 9.99998 6.5 9.99998C5.67157 9.99998 5 10.6716 5 11.5C5 12.3284 5.67157 13 6.5 13ZM17.5 13C18.3284 13 19 12.3284 19 11.5C19 10.6716 18.3284 9.99998 17.5 9.99998C16.6716 9.99998 16 10.6716 16 11.5C16 12.3284 16.6716 13 17.5 13ZM14.5 8.49998C15.3284 8.49998 16 7.82841 16 6.99998C16 6.17156 15.3284 5.49998 14.5 5.49998C13.6716 5.49998 13 6.17156 13 6.99998C13 7.82841 13.6716 8.49998 14.5 8.49998Z");
    themesNavIconPath.setAttribute("fill", "currentColor");
    themesNavIconPath.setAttribute("fill-rule", "evenodd");
    themesNavIconPath.setAttribute("clip-rule", "evenodd");
    themesNavIcon.appendChild(themesNavIconPath);

    const themesNavLabel = document.createElement("span");
    themesNavLabel.classList.add("sidebar__nav-label");
    themesNavLabel.textContent = "Themes";
    themesNavLink.appendChild(themesNavLabel);
  }
}

function addBannerTemplateHint() {
  const bannerInputDiv = document.querySelector(".input.file-upload.input--green");
  const bannerInputSubtitle = bannerInputDiv.querySelector(".input__subtitle");

  if (!bannerInputDiv || !bannerInputSubtitle) return;

  bannerInputSubtitle.textContent += " ";

  const bannerTemplateFileUrl = chrome.runtime.getURL("/download/banner-template.png")

  const bannerTemplateDownloadHint = document.createElement("a");
  bannerTemplateDownloadHint.textContent = "View the banner template.";
  bannerTemplateDownloadHint.href = bannerTemplateFileUrl;
  bannerTemplateDownloadHint.target = "_blank";

  bannerInputSubtitle.appendChild(bannerTemplateDownloadHint);
}

function saveSetting(value) {
  chrome.storage.local.set({'screenshareMode': value});
}

function applySettingsSync() {
  function initializeCensor(el) {el.classList.add("api-key-display-secure"); el.classList.add("api-key-display-censored"); el.textContent = "";}
  function applyCensor(el) {el.classList.add("api-key-display-censored"); el.classList.remove("api-key-display-visible"); el.textContent = "";}
  function removeCensor(el, text) {el.classList.remove("api-key-display-censored"); el.classList.add("api-key-display-visible"); el.textContent = text;}

  chrome.storage.local.get(['screenshareMode'], function(result) {
    let value = result.screenshareMode;
    if (value !== undefined && value) {
      // apiKeyDisplay blurring change
      const apiKeyDisplay = document.querySelector(".api-key-display");

      if (apiKeyDisplay) {
        let censoredA = true;
        apiKey = apiKeyDisplay.textContent;

        initializeCensor(apiKeyDisplay);
        apiKeyDisplay.textContent = str_rand(6); // haha funny number

        apiKeyDisplay.addEventListener('mouseleave', (e) => {
          e.stopImmediatePropagation();
        }, true);

        apiKeyDisplay.addEventListener('mouseup', () => {
          if (censoredA) {
            censoredA = false;
            removeCensor(apiKeyDisplay, apiKey);
          } else {
            censoredA = true;
            applyCensor(apiKeyDisplay);
            apiKeyDisplay.textContent = str_rand(7); // HAHAHAHA FUNNI NUMBERRRRR (kys if you laughed /j)
          }
        }, true);
      }

      // homeAddress blurring change
      const homeAddressDisplay = document.querySelector(".my-orders__header-value.my-orders__blurred-when-inactive");

      if (homeAddressDisplay) {
        let censoredH = true;
        const homeAddress = homeAddressDisplay.textContent;

        initializeCensor(homeAddressDisplay);
        homeAddressDisplay.textContent = str_rand(homeAddress.length);
        
        homeAddressDisplay.addEventListener('mouseleave', (e) => {
          e.stopImmediatePropagation();
        }, true);

        homeAddressDisplay.addEventListener('mouseup', () => {
          if (censoredH) {
            censoredH = false;
            removeCensor(homeAddressDisplay, homeAddress);
          } else {
            censoredH = true;
            applyCensor(homeAddressDisplay);
            homeAddressDisplay.textContent = str_rand(homeAddress.length);
          }
        }, true);
      }

      // shipping address black out
      const shippingAddressText = document.querySelector(".dropdown__char-span");

      if (shippingAddressText) {
        let censoredS = true;
        const shippingAddress = shippingAddressText.textContent;

        document.querySelector(".dropdown__menu").classList.add("dropdown__menu-secure")

        initializeCensor(shippingAddressText);
        shippingAddressText.textContent = str_rand(shippingAddress.length);
      }
    }
  })
}

function applyUISync() {
  chrome.storage.local.get(['screenshareMode'], function(result) {
    let value = result.screenshareMode;
    if (value !== undefined) {
      const screenshareModeCheckbox = document.getElementById('screenshare_mode');
      if (!screenshareModeCheckbox) return;

      screenshareModeCheckbox.checked = value;
    }
  })
}

function str_rand(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}

initialize();