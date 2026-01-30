const api = typeof browser !== "undefined" ? browser : chrome;

/** VARIABLES **/
let apiKey = "";
let slackEmojiMap = {};
let totalTime;
const savedBgColor = localStorage.getItem("bg-color-theme");

function refreshApiKey() {
  const apiKeyEl = document.querySelector(".api-key-display");
  apiKey = apiKeyEl?.textContent?.trim() ?? "";
}

async function initialize() {
  api.runtime.onMessage.addListener((message) => {
    if (message.type === "SHOW_UPDATE_BANNER") {
      showUpdateBanner(message.version);
    }
  });

  // Settings-related functions
  addSpicetownSettings();
  applySettingsSync();
  applyUISync();

  await fetchSlackEmojis();

  // UI Enhancements
  const uiEnhancements = [
    improveKitchenLayout,
    addDevlogImprovement,
    addThemesPage,
    addProjectSearcher,
    addImprovedUI,
    addExtraProjectInfo,
    addImprovedShop,
    addUserExplore,
    addKeybinds,
    addExtraShipInfo,
    addDevlogImageTools,
    watchForNewComments,
    addWeeklyGains,
    addEmojiAutocomplete,
    addProjectVotes,
    addDevlogGenerator,
    addDevlogStreak,
    addNextShipEstimation
  ];
  uiEnhancements.forEach(func => func());

  // Grab The Api Key
  refreshApiKey();

  const topCollabDiv = document.querySelector(".top-collab img");
  if (topCollabDiv) {
    const spicetownIcon = Object.assign(document.createElement("img"), {
      src: chrome.runtime.getURL("/images/hc-gh&st-collab.png"),
      className: "spicetown-icon-header",
    })
    spicetownIcon.after(spicetownIcon);
  }
}

function addDevlogImprovement() {
  const devlogTextContainer = document.querySelector('.projects-new__card > .projects-new__field:not(.projects-new__field--description) > .input.input--red > .input__field.input__field--textarea');
  if (!devlogTextContainer) return;

  const devlogMdActions = document.createElement('div');
  devlogMdActions.classList.add('input__actions-container');
  devlogMdActions.innerHTML = `
    <button data-md="italic" title="Italic">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
    </button>
    <button data-md="bold" title="Bold">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/></svg>
    </button>
    <button data-md="h1" title="Heading 1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>
    </button>
    <button data-md="h2" title="Heading 2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>
    </button>
    <button data-md="link" title="Link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    </button>
    <button data-md="image" title="Image">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    </button>
    <button data-md="blockquote" title="Blockquote">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-quote-icon lucide-text-quote"><path d="M17 5H3"/><path d="M21 12H8"/><path d="M21 19H8"/><path d="M3 12v7"/></svg>
    </button>
    <button data-md="list" title="List">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-icon lucide-list"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>
    </button>
    <button data-md="numbered-list" title="Numbered List">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-ordered-icon lucide-list-ordered"><path d="M11 5h10"/><path d="M11 12h10"/><path d="M11 19h10"/><path d="M4 4h1v5"/><path d="M4 9h2"/><path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"/></svg>
    </button>
    <button data-md="horizontal-line" title="Horizontal Line">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>
    </button>
    <button data-md="inline-code" title="Inline Code">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left-right-ellipsis-icon lucide-chevrons-left-right-ellipsis"><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="m17 7 5 5-5 5"/><path d="m7 7-5 5 5 5"/><path d="M8 12h.01"/></svg>
    </button>
    <button data-md="code-block" title="Code Block">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-icon lucide-code"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
    </button>
  `;

  devlogTextContainer.after(devlogMdActions);

  // am too lazy to add it to every single one :P
  const applyMarkdown = (mdType) => {
    const [selectStart, selectEnd] = [devlogTextContainer.selectionStart, devlogTextContainer.selectionEnd];
    const selectedText = devlogTextContainer.value.slice(selectStart, selectEnd);
    let insertText = "";
    let newSelectStart = selectStart;
    let newSelectEnd = selectEnd;

    // first time using switch hope it goes well <3
    switch (mdType) {
      case "italic": // TODO: fix parsing on this
        insertText = selectedText ? `_${selectedText}_` : '_MD Editor by Spicetown_';
        newSelectStart = selectStart + (selectedText ? 1 : 1);
        newSelectEnd = selectStart + insertText.length - 1;
        break;
      case "bold":
        insertText = selectedText ? `**${selectedText}**` : '**MD Editor by Spicetown**';
        newSelectStart = selectStart + (selectedText ? 2 : 2);
        newSelectEnd = selectStart + insertText.length - 2;
        break;
      case "h1":
        insertText = selectedText ? `# ${selectedText}` : '# MD Editor by Spicetown';
        newSelectStart = selectStart + (selectedText ? 2 : 2);
        newSelectEnd = selectStart + insertText.length;
        break;
      case "h2":
        insertText = selectedText ? `## ${selectedText}` : '## MD Editor by Spicetown';
        newSelectStart = selectStart + (selectedText ? 3 : 3);
        newSelectEnd = selectStart + insertText.length;
        break;
      case "link":
        insertText = selectedText ? `[${selectedText}](url)` : '[MD Editor by Spicetown](https://spicetown.sabiothedev.xyz)';
        newSelectStart = selectStart + (selectedText ? selectedText.length + 3 : 7);
        newSelectEnd = selectStart + 3;
        break;
      case "image":
        insertText = selectedText ? `![${selectedText}](imageurl)` : '![Alt text](https://i.ibb.co/yBhBsGyf/Group-11-1.png)';
        newSelectStart = selectStart + (selectedText ? selectedText.length + 4 : 8);
        newSelectEnd = selectStart + 3;
        break;
      case "blockquote": // TODO: fix parsing on this
        insertText = selectedText ? `> ${selectedText}` : '> MD Editor by Spicetown';
        newSelectStart = selectStart + (selectedText ? 2 : 2);
        newSelectEnd = selectStart + insertText.length;
        break;
      case "list":
        insertText = selectedText ? `- ${selectedText}` : '- MD Editor by Spicetown';
        newSelectStart = selectStart + (selectedText ? 2 : 2);
        newSelectEnd = selectStart + insertText.length;
        break;
      case "numbered-list":
        insertText = selectedText ? `1. ${selectedText}` : '1. MD Editor by Spicetown';
        newSelectStart = selectStart + (selectedText ? 2 : 2);
        newSelectEnd = selectStart + insertText.length;
        break;
      case "horizontal-line":
        insertText = "\n---\n";
        newSelectStart = newSelectEnd = selectStart + insertText.length;
        break;
      case "inline-code":
        insertText = selectedText ? `\`${selectedText}\`` : '`MD Editor by Spicetown`';
        newSelectStart = selectStart + (selectedText ? 1 : 1);
        newSelectEnd = selectStart + insertText.length - 1;
        break;
      case "code-block":
        insertText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```\nMD Editor by Spicetown\n```';
        newSelectStart = selectStart + 4;
        newSelectEnd = selectStart + insertText.length - 4;
        break;
    }

    devlogTextContainer.setRangeText(insertText, selectStart, selectEnd, "end");
    devlogTextContainer.focus();
    devlogTextContainer.setSelectionRange(newSelectStart, newSelectEnd);
    updatePreview();
  };

  devlogMdActions.addEventListener("click", (e) => {
    const btnClicked = e.target.closest("button");
    if (!btnClicked) return;
    e.preventDefault();
    applyMarkdown(btnClicked.dataset.md);
  });

  devlogTextContainer.addEventListener("keydown", (e) => {
    if (!e.ctrlKey) return; // all shortcuts use ctrl so like yippee
    const key = e.key.toLowerCase();
    let type = null;
    if (e.shiftKey && e.altKey && key === "c") type = "code-block";
    else if (e.shiftKey && key === "l") type = "link";
    else if (e.shiftKey && key === "i") type = "image";
    else if (e.shiftKey && key === "b") type = "blockquote";
    else if (e.shiftKey && key === "c") type = "inline-code";
    else if (key === "i") type = "italic";
    else if (key === "b") type = "bold";
    else if (key === "l") type = "list";
    else if (key === "k") type = "numbered-list";
    else if (key === "h") type = "horizontal-line";

    if (type) {
      e.preventDefault();
      applyMarkdown(type);
    }
  })

  const parentContainer = document.querySelector(".projects-new__form > .projects-new__card > .projects-new__field");
  parentContainer.classList.add("projects-new__devlog-text")
  const previewContainer = document.createElement("div");
  previewContainer.classList.add("post__body");

  function parser(text) {
    if (!text) return "";

    let html = text;

    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const id = `__CODEBLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre class="flavortown-md-pre"><code><span>${code.trim()}</span></code></pre>`);
      return id;
    });

    html = html.replace(/^> (.*$)/gim, "<bq>$1</bq>");

    html = html
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>") // oops
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^---$/gim, "<hr/>")
      .replace(/^\s*-\s+(.*)/gim, "<ubli>$1</ubli>")
      .replace(/^\s*\d+\.\s+(.*)/gim, "<obli>$1</obli>");

    html = html
      .replace(/(<ubli>.*<\/ubli>\s*)+/g, (m) => `<ul>${m.replace(/ubli/g, "li")}</ul>`)
      .replace(/(<obli>.*<\/obli>\s*)+/g, (m) => `<ol>${m.replace(/obli/g, "li")}</ol>`)
      .replace(/(<bq>.*<\/bq>\s*)+/g, (m) => `<blockquote><p>${m.replace(/<\/?bq>/g, "").trim().split('\n').join('</p><p>')}</p></blockquote>`);

    html = html.split("\n").map(line => {
      const trimmed = line.trim();
      if (!trimmed) return ""; 
      if (/^<(h[1-3]|ul|ol|li|blockquote|p|hr|pre)/i.test(trimmed)) return line;
      return `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
    }).join("\n");

    html = html
      .replace(/\*\*\*_(.*?)_\*\*\*/gim, "<strong><em>$1</em></strong>") // what drugs was i on when i typed
      .replace(/\*\*_(.*?)_\*\*/gim, "<strong><em>$1</em></strong>") // <emphasis></emphasis> sob
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\_(.*?)\_/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    codeBlocks.forEach((block, i) => {
      html = html.replace(`__CODEBLOCK_${i}__`, block);
    });

    return html.replace(/<p>(__CODEBLOCK_.*)<\/p>/g, "$1").trim();
  }
  const updatePreview = () => {
    previewContainer.innerHTML = parser(devlogTextContainer.value); // wowie parser
  };

  parentContainer.appendChild(previewContainer);
  updatePreview();
  
  devlogTextContainer.addEventListener("input", () => {
    updatePreview();
  });
}

function addKeybinds() { // :3
  const sidebarItems = document.querySelectorAll(".sidebar__nav-list > .sidebar__nav-item > .sidebar__nav-link");
  if (sidebarItems) {
    sidebarItems.forEach((sItem, i) => {
      const nKey = i + 1;
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) { // "omg the metaverse" - some company idk
          if ((e.key >= "1" && e.key <= "9") || (e.key >= "1" && e.key <= "9" && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD)) { // in cased u r a weirdo and use numpad
            const pressed = parseInt(e.key, 10);
            if (pressed === nKey) {
              e.preventDefault();
              sItem.click();
            }
          }
        }
      })
      const hotkeyDiv = document.createElement("div");
      hotkeyDiv.className = "sidebar__nav-item-hotkey-div";
      sItem.parentElement.appendChild(hotkeyDiv);
      const hotCtrl = document.createElement("p");
      hotCtrl.textContent = "Ctrl";
      hotCtrl.className = "sidebar__nav-item-hotkey";
      hotkeyDiv.appendChild(hotCtrl);
      const hotNum = document.createElement("p");
      hotNum.textContent = nKey;
      hotNum.className = "sidebar__nav-item-hotkey";
      hotkeyDiv.appendChild(hotNum);
    })
  }
  const projectsBoardGridItems = document.querySelectorAll(".projects-board__grid .projects-board__grid-item .project-card__banner-frame");
  if (projectsBoardGridItems) {
    projectsBoardGridItems.forEach((pbgItem, i) => {
      const nKey = i + 1;
      document.addEventListener("keydown", (e) => {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          if ((e.key >= "1" && e.key <= "9") || (e.key >= "1" && e.key <= "9" && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD)) {
            const pressed = parseInt(e.key, 10);
            if (pressed === nKey) {
              e.preventDefault();
              pbgItem.click();
            }
          }
        }
      })
    })
  }
  const exploreNavComponent = document.querySelectorAll(".explore__nav-component");
  if (exploreNavComponent) {
    exploreNavComponent.forEach((enComponent, i) => {
      const nKey = i + 1;
      document.addEventListener("keydown", (e) => {
        if (!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
          if ((e.key >= "1" && e.key <= "9") || (e.key >= "1" && e.key <= "9" && e.location === KeyboardEvent.DOM_KEY_LOCATION_NUMPAD)) {
            const pressed = parseInt(e.key, 10);
            if (pressed === nKey) {
              e.preventDefault();
              enComponent.click();
            }
          }
        }
      })
      const hotkeyDiv = document.createElement("div");
      hotkeyDiv.className = "explore__nav-component-hotkey-div";
      enComponent.appendChild(hotkeyDiv);
      const hotNum = document.createElement("div");
      hotNum.textContent = nKey;
      hotNum.className = "explore__nav-component-hotkey";
      hotkeyDiv.appendChild(hotNum);
    })
  }
  const nDevlog = document.querySelector(".projects-show__container > .mt-4 > .btn.btn--brown");
  if (nDevlog) {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && !e.shiftKey && e.altKey && !e.metaKey) {
        if (e.key === "n") {
          e.preventDefault();
          nDevlog.click();
        }
      }
    })
  }
}

// optimize via DRY principle :yay:
function addImprovedUI() {
  const prevVotesBtn = document.querySelector(".btn.btn--brown.btn--borderless.votes-new__prev-btn");
  if (prevVotesBtn) {
    prevVotesBtn.textContent = "Previous votes";

    const skipBtn = prevVotesBtn.cloneNode(true);
    skipBtn.textContent = "Skip";
    skipBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.reload();
    });
    
    const wrapper = document.createElement("div");
    wrapper.className = "vote-action__div";

    const mainSection = prevVotesBtn.parentElement.querySelector(".votes-new__main");
    prevVotesBtn.parentElement.insertBefore(wrapper, mainSection);
    wrapper.append(prevVotesBtn, skipBtn);
  }
}

function addExtraProjectInfo() {
  const ICONS = {
    clock: `
      <g clip-path="url(#clip0_21_12)">
        <path d="M190.5 381C295.683 381 381 295.683 381 190.5C381 85.3166 295.683 0 190.5 0C85.3166 0 0 85.3166 0 190.5C0 295.683 85.3166 381 190.5 381ZM176.892 81.643C176.892 74.1588 183.016 68.0355 190.5 68.0355C197.984 68.0355 204.108 74.1588 204.108 81.643V183.969L267.041 234.315C272.892 239.01 273.844 247.582 269.149 253.433C267.879 255.028 266.265 256.316 264.427 257.199C262.589 258.083 260.575 258.54 258.536 258.536C255.542 258.536 252.548 257.583 250.031 255.542L181.996 201.114C178.798 198.528 176.894 194.651 176.894 190.5L176.892 81.643Z" fill="currentColor"/>
        <path d="M504.005 368.521L462.996 326.967C458.004 322.017 451.004 319.054 443.009 319.054H383.992C368.997 318.06 356 330.924 356 345.766V484.294C355.994 487.935 356.714 491.542 358.119 494.907C359.524 498.271 361.586 501.329 364.188 503.903C366.79 506.477 369.879 508.517 373.279 509.907C376.679 511.296 380.323 512.008 384.002 512H483.998C487.677 512.008 491.321 511.296 494.721 509.907C498.121 508.517 501.21 506.477 503.812 503.903C506.414 501.329 508.476 498.271 509.881 494.907C511.286 491.542 512.006 487.935 512 484.294V387.329C512 380.4 508.997 373.471 504.005 368.521ZM403.999 397.221H434C437.997 397.221 441.995 400.193 441.995 405.134C441.995 410.084 439.002 413.047 434 413.047H403.999C402.946 413.06 401.9 412.864 400.924 412.471C399.948 412.078 399.062 411.495 398.317 410.758C397.572 410.021 396.983 409.143 396.586 408.177C396.189 407.211 395.991 406.176 396.004 405.134C396.004 400.183 400.002 397.221 403.999 397.221ZM464.001 452.632H403.999C400.002 452.632 396.004 449.66 396.004 444.719C396.004 439.778 398.998 436.806 403.999 436.806H464.001C467.998 436.806 471.996 439.768 471.996 444.719C471.996 449.669 467.998 452.632 464.001 452.632Z" fill="currentColor"/>
      </g>
      <defs>
        <clipPath id="clip0_21_12"><rect width="512" height="512" fill="white"/></clipPath>
      </defs>`,
    calendar: `
      <path d="M190.5 381C295.683 381 381 295.683 381 190.5C381 85.3166 295.683 0 190.5 0C85.3166 0 0 85.3166 0 190.5C0 295.683 85.3166 381 190.5 381ZM176.892 81.643C176.892 74.1588 183.016 68.0355 190.5 68.0355C197.984 68.0355 204.108 74.1588 204.108 81.643V183.969L267.041 234.315C272.892 239.01 273.844 247.582 269.149 253.433C267.879 255.028 266.265 256.316 264.427 257.199C262.589 258.083 260.575 258.54 258.536 258.536C255.542 258.536 252.548 257.583 250.031 255.542L181.996 201.114C178.798 198.528 176.894 194.651 176.894 190.5L176.892 81.643Z" fill="currentColor"/>
      <path d="M336.014 402.2C336.004 403.063 336 403.936 336 404.821V449.979C336 459.357 336.492 467.466 338.005 474.275C339.539 481.18 342.234 487.251 346.991 492.009C351.749 496.766 357.82 499.461 364.725 500.995C371.534 502.509 379.643 503 389.021 503H450.979C460.357 503 468.466 502.509 475.275 500.995C482.18 499.461 488.251 496.766 493.009 492.009C497.766 487.251 500.461 481.18 501.995 474.275C503.509 467.466 504 459.357 504 449.979V404.821C504 403.936 503.996 403.063 503.987 402.2H336.014Z" fill="currentColor"/>
      <path d="M361.199 354.715V343.4C361.199 338.761 364.96 335 369.599 335C374.238 335 377.999 338.761 377.999 343.4V352.092C381.453 351.885 385.127 351.8 389.02 351.8H450.978C454.872 351.8 458.546 351.885 461.999 352.092V343.4C461.999 338.761 465.76 335 470.399 335C475.038 335 478.799 338.761 478.799 343.4V354.715C484.252 356.339 489.077 358.861 493.008 362.791C497.766 367.549 500.46 373.62 501.994 380.525C502.34 382.082 502.633 383.707 502.879 385.4H337.12C337.365 383.707 337.658 382.082 338.004 380.525C339.538 373.62 342.233 367.549 346.99 362.791C350.921 358.861 355.747 356.339 361.199 354.715Z" fill="currentColor"/>`,
    users: `
      <path d="M155.5 0C104.054 0 62.2 41.8723 62.2 93.3398C62.2 144.807 104.054 186.68 155.5 186.68C206.946 186.68 248.8 144.807 248.8 93.3398C248.8 41.8723 206.946 0 155.5 0ZM271.583 247.658C246.04 221.711 212.177 207.422 176.233 207.422H134.767C98.8234 207.422 64.9603 221.711 39.4168 247.658C13.9985 273.478 0 307.56 0 343.629C0 349.357 4.6415 354 10.3667 354H300.633C306.358 354 311 349.357 311 343.629C311 307.56 297.002 273.478 271.583 247.658Z" fill="currentColor"/>
      <path d="M336.014 402.2C336.004 403.063 336 403.936 336 404.821V449.979C336 459.357 336.492 467.466 338.005 474.275C339.539 481.18 342.234 487.251 346.991 492.009C351.749 496.766 357.82 499.461 364.725 500.995C371.534 502.509 379.643 503 389.021 503H450.979C460.357 503 468.466 502.509 475.275 500.995C482.18 499.461 488.251 496.766 493.009 492.009C497.766 487.251 500.461 481.18 501.995 474.275C503.509 467.466 504 459.357 504 449.979V404.821C504 403.936 503.996 403.063 503.987 402.2H336.014Z" fill="currentColor"/>
      <path d="M361.199 354.715V343.4C361.199 338.761 364.96 335 369.599 335C374.238 335 377.999 338.761 377.999 343.4V352.092C381.453 351.885 385.127 351.8 389.02 351.8H450.978C454.872 351.8 458.546 351.885 461.999 352.092V343.4C461.999 338.761 465.76 335 470.399 335C475.038 335 478.799 338.761 478.799 343.4V354.715C484.252 356.339 489.077 358.861 493.008 362.791C497.766 367.549 500.46 373.62 501.994 380.525C502.34 382.082 502.633 383.707 502.879 385.4H337.12C337.365 383.707 337.658 382.082 338.004 380.525C339.538 373.62 342.233 367.549 346.99 362.791C350.921 358.861 355.747 356.339 361.199 354.715Z" fill="currentColor"/>`
  };

  // helpers to optimize this garbage code
  const getRating = (value, scale) => {
    const rating = scale.find(s => s.min === undefined ? value <= s.max : value >= s.min) || {label: "(?)", class: ""};
    return rating;
  }

  const parseNum = (el) => parseInt(el?.textContent.replace(/\D/g, "") || "0", 10);

  const card = document.querySelector(".project-show-card");
  const content = document.querySelector(".project-show-card__content.project-card__content");
  if (!content) return;

  const stats = content.querySelectorAll(".project-show-card__stat");
  const devlogCount = parseNum(stats[0]);

  const timeString = stats[1]?.textContent || "";
  const hours = parseInt(timeString.match(/(\d+)h/)?.[1] || "0", 10);
  const minutes = parseInt(timeString.match(/(\d+)m/)?.[1] || "0", 10);
  const seconds = parseInt(timeString.match(/(\d+)s/)?.[1] || "0", 10);

  const totalMins = (hours * 60) + minutes + (seconds > 30 ? 1 : 0);
  totalTime = totalMins;

  const extraInfoDiv = document.createElement("div");
  extraInfoDiv.className = "project-extra-info__div";
  content.insertBefore(extraInfoDiv, card.querySelector(".project-show-card__description"));

  if (devlogCount === 0) {
    extraInfoDiv.innerHTML = "<p>Create a devlog to view more stats.</p>";
    return;
  }

  const scales = {
    minsPerDevlog: [
      {min: 150, label: "(Bad)", class: "awful"},
      {min: 120, label: "(Poor)", class: "bad"},
      {min: 101, label: "(Okay)", class: "okay"},
      {min: 81, label: "(Good)", class: "good"},
      {min: 40, label: "(Great)", class: "great"},
      {min: 20, label: "(Good)", class: "good"},
      {min: 15, label: "(Okay)", class: "okay"},
      {min: 10, label: "(Poor)", class: "bad"},
      {min: 0, label: "(Bad)", class: "awful"}
    ],
    timePerDay: [
      {min: 180, label: "(Great)", class: "great"},
      {min: 120, label: "(Good)", class: "good"},
      {min: 60, label: "(Okay)", class: "okay"},
      {min: 30, label: "(Poor)", class: "bad"},
      {min: 0, label: "(Bad)", class: "awful"}
    ],
    followersPerDay: [
      {min: 0.5, label: "(Great)", class: "great"},
      {min: 0.3, label: "(Good)", class: "good"},
      {min: 0.2, label: "(Okay)", class: "okay"},
      {min: 0.1, label: "(Poor)", class: "bad"},
      {min: 0, label: "(Bad)", class: "awful"}
    ]
  };

  const createStatRow = (svgType, text, ratingObj) => {
    const row = document.createElement("div");
    row.className = "project-extra-info__container";
    row.innerHTML = `
      ${getSvg(svgType)}
      <p>${text} <span class="project-extra-info__rating project-extra-info__rating--${ratingObj.class}">${ratingObj.label}</span></span>
    `;
    return row;
  };

  const minsPerDevlog = totalMins / devlogCount;
  extraInfoDiv.appendChild(createStatRow('clock', `1 devlog for every ${convertMToFormat(Math.round(minsPerDevlog))}`, getRating(minsPerDevlog, scales.minsPerDevlog)));

  const timeline = document.querySelector(".projects-show__timeline .mt-4");
  if (timeline) {
    const lastPost = timeline.lastElementChild?.querySelector(".post__time")?.textContent.toLowerCase() || "";
    const numMatch = lastPost.match(/(\d+)|\b(a|an)\b/);
    const num = numMatch ? (numMatch[1] ? parseInt(numMatch[1], 10) : 1) : 1;
    let daysActive = 1;
    
    if (lastPost.includes("month")) {
      daysActive = num * 30;
    } else if (lastPost.includes("day")) {
      daysActive = num;
    } else if (lastPost.includes("hour") || lastPost.includes("hours")) {
      daysActive = 1;
    } else {
      daysActive = Math.min(1, parseInt(num, 10) || 1);
    }

    const minsPerDay = totalMins / daysActive;
    extraInfoDiv.appendChild(createStatRow('calendar', `${convertMToFormat(minsPerDay)} a day`, getRating(minsPerDay, scales.timePerDay)));

    const followerCount = parseNum(content.querySelector(".project-show-card__stat--clickable"));
    const followersPerDay = (followerCount / daysActive).toFixed(2);
    extraInfoDiv.appendChild(createStatRow('users', `${followersPerDay} follower(s) a day`, getRating(followersPerDay, scales.followersPerDay)));
  }

  function getSvg(type) {
    const fillMode = type === 'clock' ? 'currentColor' : 'none';
    return `
      <svg width="32" height="32" viewBox="0 0 512 512" fill="${fillMode}" xmlns="http://www.w3.org/2000/svg" style="color: var(--color-tan-400)">
        ${ICONS[type]}
      </svg>`;
  }
}

function addImprovedShop() {
  const shopGoalsItemsNodeList = document.querySelectorAll(".shop-goals__item");
  let shopGoalsItems = Array.from(shopGoalsItemsNodeList);
  if (!shopGoalsItems || shopGoalsItems.length === 0) return;

  document // thanks gizzy for this amazing code (now it's mine :3)
    .querySelectorAll('a.shop-item-card__link[data-turbo-frame="_top"]')
    .forEach((a) => {
      a.removeAttribute("data-turbo-frame")
      a.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          window.location.href = a.href;
        },
        { once: true },
      );
  });

  const sidebarBalance = document.querySelector(".sidebar__user-balance");
  const userBalance = sidebarBalance ? parseFloat(sidebarBalance.textContent.replace(/[^\d.]/g, '')) : 0;

  const shopGoalsContainer = document.querySelector(".shop-goals__container");
  const shopGoalsTitle = document.querySelector(".shop-goals__title");
  const itemsContainer = document.querySelector(".shop-goals__items");

  if (!shopGoalsContainer || !shopGoalsTitle || !itemsContainer) return;

  const allProgressWrapper = document.createElement("div");
  allProgressWrapper.classList.add("shop-goals__all-progress-wrapper");

  allProgressWrapper.innerHTML = `
    <span id="all-percent">0.00%</span>
    <div class="shop-goals__heading-progress-bar">
      <div class="shop-goals__heading-progress-bar-fill"></div>
    </div>
    <div class="all-current__container">
      <span id="all-current">0</span> / <span id="all-total">0</span> 
    </div>
  `;

  const shopGoalEditorDiv = document.createElement("div");
  shopGoalEditorDiv.classList.add("shop-goals-editor__div");
  shopGoalEditorDiv.style.display = "none";

  shopGoalEditorDiv.innerHTML = `
    <p class="shop-goal-editor__editor-name">Spicetown Shop Goal Editor</p>
    <div class="shop-goal-editor__heading">
      <h2 class="shop-goal-editor__name">Select an item</h2>
      <button class="shop-goal-editor__save-btn">Save</button>
      <button class="shop-goal-editor__remove-btn">Remove</button>
    </div>
    <div class="shop-goal-editor__input">
      <label class="shop-goal-editor__quantity-label">Quantity</label>
      <div class="shop-goal-editor__quantity-container">
        <button id="decrease-quantity__btn">-</button>
        <input type="number" class="shop-goal-editor__quantity-input" value="1" min="1" max="99">
        <button id="increase-quantity__btn">+</button>
      </div>
    </div>
  `;

  const editorInput = shopGoalEditorDiv.querySelector(".shop-goal-editor__quantity-input");
  const editorInputPlus = shopGoalEditorDiv.querySelector("#increase-quantity__btn");
  const editorInputMinus = shopGoalEditorDiv.querySelector("#decrease-quantity__btn");

  const updateQuantity = (newValue) => {
    let value = parseInt(newValue);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 99) value = 99;

    editorInput.value = value;
  };

  editorInputPlus.addEventListener("click", () => {
    updateQuantity(parseInt(editorInput.value) + 1);
  });

  editorInputMinus.addEventListener("click", () => {
    updateQuantity(parseInt(editorInput.value) - 1);
  });

  editorInput.addEventListener("input", (event) => {
    if (event.target.value > 99) {
      event.target.value = 99;
    }
  });

  editorInput.addEventListener("blur", (event) => {
    updateQuantity(event.target.value);
  });

  const editorName = shopGoalEditorDiv.querySelector(".shop-goal-editor__name");
  const editorSaveBtn = shopGoalEditorDiv.querySelector(".shop-goal-editor__save-btn");
  const editorRemoveBtn = shopGoalEditorDiv.querySelector(".shop-goal-editor__remove-btn");

  let activeEditingItem = null; // track which item is being edited and then sell your user data (joke)

  const calculateAllProgress = async () => {
    let totalRequiredCost = 0;
    let runningBalance = userBalance;

    const allFill = document.querySelector(".shop-goals__heading-progress-bar-fill");
    const allCurrentText = document.querySelector("#all-current");
    const allTotalText = document.querySelector("#all-total");
    const allPercentText = document.querySelector("#all-percent");

    const currentItems = document.querySelectorAll(".shop-goals__item");

    for (const item of currentItems) {
      const id = item.getAttribute("data-item-id");
      const fill = item.querySelector(".shop-goals__progress-fill");
      const progressTxt = item.querySelector(".shop-goals__progress-text");

      if (!progressTxt || !fill) continue;

      let derivedPrice = 0;
      const matchingShopItemCard = document.querySelector(`div.shop-item-card[data-shop-id="${id}"]`);
      if (matchingShopItemCard) {
        const priceTextRaw = matchingShopItemCard.querySelector(".shop-item-card__price").textContent || "🍪 0";
        derivedPrice = parseFloat(priceTextRaw.replace(/[^\d.]/g, ''));
      } else {
        const remaining = parseFloat(progressTxt.textContent.replace(/[^\d.]/g, '')) || 0;
        const isComplete = fill.style.width === "100%";
        if (isComplete) derivedPrice = 0;
        else derivedPrice = remaining + userBalance;
      }

      const storage = await chrome.storage.local.get([`shop_goal_qty_${id}`]);
      const qty = storage[`shop_goal_qty_${id}`] || 1;
      const itemTotal = derivedPrice * qty;
      
      totalRequiredCost += itemTotal;

      const contribution = Math.min(runningBalance, itemTotal);
      const itemPercent = itemTotal === 0 ? 100 : (contribution / itemTotal) * 100;

      if (fill) fill.style.width = `${itemPercent}%`;
      if (progressTxt) {
        const neededForThis = Math.max(0, itemTotal - contribution);
        progressTxt.textContent = neededForThis <= 0 ? "✅ Ready!" : `🍪${neededForThis.toLocaleString()} more needed`;
      }

      const fillColor = itemPercent >= 100 ? "var(--completed-color)" : "var(--progress-color)";
      const emptyColor = "rgba(255, 255, 255, 0.5)";
      item.style.background = `linear-gradient(to right, ${fillColor} ${itemPercent}%, ${emptyColor} ${itemPercent}%)`;

      runningBalance = Math.max(0, runningBalance - itemTotal);
    }
    
    const percent = totalRequiredCost === 0 ? 100 : Math.min(100, (userBalance / totalRequiredCost) * 100);
    if (allFill) allFill.style.width = `${percent}%`;
    if (allCurrentText) allCurrentText.textContent = Math.floor(userBalance).toLocaleString();
    if (allTotalText) allTotalText.textContent = Math.floor(totalRequiredCost).toLocaleString();
    if (allPercentText) allPercentText.textContent = (Math.round((percent + Number.EPSILON) * 100) / 100).toLocaleString() + "%";
  }

  shopGoalsItems.forEach(shopGoalItemDiv => {
    const shopGoalItemID = shopGoalItemDiv.getAttribute("data-item-id");
    const shopGoalsLink = shopGoalItemDiv.querySelector(".shop-goals__link");
    const shopGoalsProgressTxt = shopGoalItemDiv.querySelector(".shop-goals__progress-text");
    const shopGoalsProgressBarFill = shopGoalItemDiv.querySelector(".shop-goals__progress-fill");
    const itemName = shopGoalItemDiv.querySelector(".shop-goals__name").textContent;

    shopGoalItemDiv.setAttribute("draggable", "true");

    const currentRemaining = parseFloat(shopGoalsProgressTxt.textContent.replace(/[^\d.]/g, '')) || 0;
    const isComplete = shopGoalsProgressBarFill.style.width === "100%";
    
    let derivedPrice = 0;
    const matchingShopItemCard = document.querySelector(`div.shop-item-card[data-shop-id="${shopGoalItemID}"]`);

    if (matchingShopItemCard) {
      const priceTextRaw = matchingShopItemCard.querySelector(".shop-item-card__price").textContent || "🍪 0";
      derivedPrice = parseFloat(priceTextRaw.replace(/[^\d.]/g, ''));
    }

    if (!derivedPrice) {
      if (isComplete) derivedPrice = 0;
      else derivedPrice = currentRemaining + userBalance;
    }

    const pricePerUnit = derivedPrice;

    const updateShopItemPrice = (quantity, availableBalance) => {
      const newTotalRequired = pricePerUnit * quantity;

      const contribution = Math.min(availableBalance, newTotalRequired);
      const newRemaining = Math.max(0, newTotalRequired - userBalance);
      const newPercent = newTotalRequired === 0 ? 100 : Math.min(100, (contribution / newTotalRequired) * 100);

      const progressBarContainer = shopGoalItemDiv.querySelector(".shop-goals__progress-bar");
      if (progressBarContainer) progressBarContainer.style.display = "none";

      const fillColor = newPercent >= 100 ? "var(--completed-color)" : "var(--progress-color)";
      const emptyColor = "rgba(255, 255, 255, 0.5)";

      shopGoalItemDiv.style.background = `linear-gradient(to right, ${fillColor} ${newPercent}%, ${emptyColor} ${newPercent}%)`;

      // i love formatting code properly
      // its so fun (not sarcastic btw)
      const shopGoalImg = shopGoalItemDiv.querySelector(".shop-goals__image");
      if (shopGoalImg) {
        if (newPercent >= 100) shopGoalImg.classList.add("completed");
        else shopGoalImg.classList.remove("completed");
      }

      if (newRemaining <= 0) {
        shopGoalsProgressTxt.textContent = `✅ Ready to buy!`;
        shopGoalItemDiv.classList.add("shop-goals__progress-fill--complete");
      } else {
        shopGoalsProgressTxt.textContent = `🍪${newRemaining.toLocaleString()} more needed`;
        shopGoalItemDiv.classList.remove("shop-goals__progress-fill--complete");
      }

      return Math.max(0, availableBalance - newTotalRequired);
    }

    // idk if i need this but oh well i aint gonna risk it
    shopGoalItemDiv.updateShopItemPrice = updateShopItemPrice;

    chrome.storage.local.get([`shop_goal_qty_${shopGoalItemID}`], result => {
      const quantity = result[`shop_goal_qty_${shopGoalItemID}`] || 1;
      updateShopItemPrice(quantity);
    });

    shopGoalsLink.href = "";
    shopGoalsLink.addEventListener("click", (e) => {
      e.preventDefault();
      activeEditingItem = {
        id: shopGoalItemID,
        div: shopGoalItemDiv,
        updateShopItemPrice
      };
      editorName.textContent = itemName;
      chrome.storage.local.get([`shop_goal_qty_${shopGoalItemID}`], result => {
        editorInput.value = result[`shop_goal_qty_${shopGoalItemID}`] || 1;
      });
      shopGoalEditorDiv.style.display = "block";
      document.querySelectorAll(".shop-goals__item").forEach(item => item.classList.remove("selected"));
      shopGoalItemDiv.classList.add("selected");
    });
  });

  editorSaveBtn.addEventListener("click", () => {
    if (!activeEditingItem) return;
    const newQuantity = parseInt(editorInput.value) || 1;
    chrome.storage.local.set({[`shop_goal_qty_${activeEditingItem.id}`]: newQuantity}, () => {
      activeEditingItem.updateShopItemPrice(newQuantity);
      calculateAllProgress();
      shopGoalEditorDiv.style.display = "none";
    });
  });

  editorRemoveBtn.addEventListener("click", () => {
    if (!activeEditingItem) return;
    const originalRemoveBtn = activeEditingItem.div.querySelector(".shop-goals__remove");
    if (originalRemoveBtn) {
      originalRemoveBtn.click();
      shopGoalEditorDiv.style.display = "none";
      activeEditingItem = null;
      window.location.reload(); // reload needed or else the inject DOM gets overwriten!!!!!!!!!!!!!!!!!!!!!!!!!
    }
  });

  const shopGoalsDiv = document.createElement("div");
  shopGoalsDiv.classList.add("shop-goals__div");

  shopGoalsTitle.after(allProgressWrapper); // i love this function!!!!!!! this makes life way easier then
  allProgressWrapper.after(shopGoalsDiv);
  shopGoalsDiv.appendChild(itemsContainer);
  shopGoalsDiv.appendChild(shopGoalEditorDiv);

  document.querySelectorAll(".shop-item-card__star").forEach(btn => {
    btn.addEventListener("click", () => window.location.reload());
  });

  // my mommy said my variables names shouldnt be super long
  // so from now on variables will be cool and short (like me)
  // NOOOO I CANT HAVE MY PROJECT EXTRA INFORMATION INFORMATION ELEMENT VARIABLE

  let draggedItem = null;

  shopGoalsItems.forEach(item => {
    item.setAttribute("draggable", "true");

    item.addEventListener("dragstart", (e) => { // mommy said e is for event
      draggedItem = item;
      item.classList.add("dragging");
      e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      draggedItem = null;
      shopGoalsItems.forEach(i => i.style.transform = "");
      saveOrder();
      calculateAllProgress();
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    item.addEventListener("dragenter", () => {
      if (item === draggedItem) return;

      const allItems = [...itemsContainer.querySelectorAll(".shop-goals__item")];
      const draggedIndex = allItems.indexOf(draggedItem);
      const targetIndex = allItems.indexOf(item);

      if (draggedIndex < targetIndex) item.after(draggedItem);
      else item.before(draggedItem);
    });
  });

  function saveOrder() {
    const currentOrder = Array.from(itemsContainer.querySelectorAll(".shop-goals__item")) // should be array? idk
      .map(item => item.getAttribute("data-item-id"));
    chrome.storage.local.set({'shop_goal_priority_order': currentOrder});
  }

  // loading the saved order
  chrome.storage.local.get(['shop_goal_priority_order'], (result) => {
    const savedOrder = result.shop_goal_priority_order;
    if (savedOrder) {
      savedOrder.forEach(id => {
        const item = itemsContainer.querySelector(`.shop-goals__item[data-item-id="${id}"]`);
        if (item) itemsContainer.appendChild(item);
      });
    }
    calculateAllProgress();
  });
}

async function addProjectSearcher() {
  const getRandomIntegerInclusive = (min, max) => { // WHY IS THIS NOT A NORMAL FUCKING JAVASCRIPT FUNCTION ARGHHHH
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const explorePageContainer = document.querySelector(".explore");
  const projectList = document.querySelector("#project-list");

  if (!explorePageContainer || !projectList || document.querySelector(".project-list__searcher") || !(document.querySelector(".explore__nav-component.selected").textContent.trim() === "Gallery")) return;

  const searchContainer = document.createElement("div");
  searchContainer.classList.add("project-list__search-container");

  const searchInput = document.createElement("input");
  searchInput.placeholder = "Search project";
  searchInput.classList.add("project-list__searcher", "input__field");

  const searchBtn = document.createElement("button");
  searchBtn.classList.add("project-list__action-btn");
  searchBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 40 40" fill="none"><path d="M39.0527 34.2126L29.8565 25.0156C31.419 22.5281 32.3258 19.5879 32.3258 16.4326C32.3258 7.50574 25.0891 0.27002 16.1626 0.27002C7.23605 0.27002 0 7.50574 0 16.4326C0 25.3598 7.23571 32.5948 16.1626 32.5948C19.5964 32.5948 22.777 31.5213 25.3942 29.6971L34.481 38.7846C35.1124 39.4154 35.9402 39.7295 36.7669 39.7295C37.5946 39.7295 38.4213 39.4154 39.0537 38.7846C40.3155 37.5215 40.3155 35.4754 39.0527 34.2126ZM16.1626 27.3584C10.1291 27.3584 5.23745 22.4671 5.23745 16.4333C5.23745 10.3994 10.1291 5.50781 16.1626 5.50781C22.1964 5.50781 27.0877 10.3994 27.0877 16.4333C27.0877 22.4671 22.1964 27.3584 16.1626 27.3584Z" fill="currentColor"></path></svg>`;

  const randomBtn = document.createElement("button");
  randomBtn.classList.add("project-list__action-btn");
  randomBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dice1-icon lucide-dice-1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M12 12h.01"/></svg>`

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(randomBtn);
  searchContainer.appendChild(searchBtn);

  const insertionPoint = explorePageContainer.querySelector(".explore__projects-list") || projectList;
  explorePageContainer.insertBefore(searchContainer, insertionPoint);

  let currentPage = 1;

  const handleSearch = async (append = false) => {
    if (!append) {
      currentPage = 1;
      projectList.innerHTML = '<p class="explore__end">Searching Flavortown...</p>';
    }

    try {
      refreshApiKey();
      const query = encodeURIComponent(searchInput.value);
      const response = await fetch(`https://flavortown.hackclub.com/api/v1/projects?query=${query}&page=${currentPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();

      if (data.error === "rate_limited" || data.error === "unauthorized") {
        const endMsg = document.querySelector(".explore__end");
        if (!endMsg) return;
        if (data.error === "rate_limited") endMsg.textContent = "Rate limited. Wait 1 min."; else if (data.error === "unauthorized") endMsg.textContent = "Generate an API key from Settings.";
        return;
      }

      renderProjects(data.projects, append);
      updatePaginationUI(data.pagination);
    } catch (err) {
      console.error("i failed to fetch shit FAAHHHHH: ", err);
    }
  };

  const getTotalProjects = async () => {
    try {
      refreshApiKey();
      const response = await fetch('https://flavortown.hackclub.com/api/v1/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (data.error === "rate_limited" || data.error === "unauthorized") {
        if (data.error === "rate_limited") projectList.innerHTML = `<p class="explore__end">Rate limited. Wait 1 min.</p>`
        else if (data.error === "unauthorized") projectList.innerHTML = `<p class="explore__end">Generate an API key from settings.</p>`
        return;
      }

      return data.pagination.total_count;
    } catch (err) {
      console.error("i couldnt get projects api grrrrrrrrrr", + err);
    }
  }

  const getRandomProject = async (lastProjectID) => {
    try {
      refreshApiKey();
      const randomProjectID = getRandomIntegerInclusive(1, lastProjectID);
      const response = await fetch(`https://flavortown.hackclub.com/api/v1/projects/${randomProjectID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 404 && lastProjectID != undefined) {
        getRandomProject(lastProjectID);
        return "deleted_project";
      } else if (lastProjectID === undefined) {
        return "rate_limited";
      }

      const data = await response.json();

      if (data.error === "rate_limited" || data.error === "unauthorized") {
        if (data.error === "rate_limited") projectList.innerHTML = `<p class="explore__end">Rate limited. Wait 1 min.</p>`
        else if (data.error === "unauthorized") projectList.innerHTML = `<p class="explore__end">Generate an API key from settings.</p>`
        return;
      }

      return randomProjectID;
    } catch (err) {
      console.error("i couldnt get specific project api UGHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", err);
      getRandomProject(lastProjectID);
    }
  }

  function updatePaginationUI(paginationData) {
    let paginationContainer = document.querySelector(".explore__pagination");

    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.className = 'explore__pagination';
      projectList.after(paginationContainer);
    }

    if (paginationData.next_page) {
      paginationContainer.innerHTML = `
        <button type="button" class="btn btn--brown" id="ext-load-more">
          Load More Projects
        </button>
      `;
      
      document.getElementById("ext-load-more").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        currentPage = paginationData.next_page;
        handleSearch(true); 
      });
    } else {
      paginationContainer.innerHTML = `<p class="explore__end">You've reached the end.</p>`;
    }
  }

  function renderProjects(projects, append) {
    if (!projects || projects.length === 0) {
      if (!append) projectList.innerHTML = `<p class="explore__end">No projects found.</p>`;
      return;
    }

    const html = projects.map(project => `
      <div id="project_${project.id}" class="project-card">
        <div class="project-card__banner ${!project.banner_url ? 'project-card__banner--placeholder' : ''}">
          <a class="project-card__banner-frame" href="/projects/${project.id}">
            ${project.banner_url
              ? `<img src="${project.banner_url}" class="project-card__banner-image" alt="${project.title}">`
              : `<div class="project-card__banner-placeholder"><p>Banners are not supported in the API yet</p></div>`
            }
          </a>
        </div>
        <div class="project-card__content">
          <h3 class="project-card__title">
            <a class="project-card__title-link" href="/projects/${project.id}">${project.title}</a>
          </h3>
          <p class="project-card__description">${project.description || ''}</p>
        </div>
      </div>
    `).join('');

    if (append) {
      const statusMsg = projectList.querySelector(".explore__end");
      if (statusMsg) statusMsg.remove();
      projectList.insertAdjacentHTML('beforeend', html);
    } else {
      projectList.innerHTML = html;
    }
  }

  searchBtn.addEventListener("click", () => handleSearch(false));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch(false);
  });

  randomBtn.addEventListener("click", async () => {
    const randomProjectID = await getRandomProject(await getTotalProjects());

    if (randomProjectID === "deleted_project") {
      projectList.innerHTML = `<p class="explore__end">Deleted project. Try again.</p>`;
    } else if (randomProjectID === "rate_limited") {
      projectList.innerHTML = `<p class="explore__end">Rate limited. Wait 1 min.</p>`;
    } else {
      window.location.pathname = `/projects/${randomProjectID}`;
    }
  });
}

async function addUserExplore() {
  const exploreNav = document.querySelector(".explore__nav");
  if (!exploreNav) return;

  // Use the template logic you had
  const usersComponent = document.querySelectorAll(".explore__nav-component:not(.selected)")[0].cloneNode(true);

  usersComponent.href = "/explore/users";
  usersComponent.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    Users
  `;

  usersComponent.addEventListener("click", (e) => {
    e.preventDefault();

    // fake switching urls lmao
    // i just hate having to modify innerHTML and flashbanging users
    window.history.pushState({}, "", "/explore/users");

    document.querySelectorAll(".explore__nav-component").forEach(element => element.classList.remove("selected"));
    usersComponent.classList.add("selected");

    // elements needed to hide so i can pretend there's a new page :3
    const elementsToHide = [ // querySelector btw
      ".explore__header",
      ".project-list__search-container",
      "#project-list",
      ".explore__pagination",
      ".explore__list"
    ];

    elementsToHide.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) element.style.display = "none";
    });

    const existingMessage = document.getElementById("users");
    if (existingMessage) existingMessage.remove();

    const mainContainer = document.querySelector(".explore");

    const usersWrapper = document.createElement("div");
    usersWrapper.id = "users-container"; // i feel like using id today instead of classes (querySelector) for everything :D

    const usersDiv = document.createElement("div");
    usersDiv.id = "users";
    usersDiv.className = "explore__list";

    usersWrapper.appendChild(usersDiv);
    mainContainer.appendChild(usersWrapper);

    // start at 1?
    let currentPage = 1;

    const getUsers = async (page = 1) => {
      try {
        await refreshApiKey();
        const response = await fetch(`https://flavortown.hackclub.com/api/v1/users?page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (data.error === "rate_limited" || data.error === "unauthorized") {
          const msg = data.error === "rate_limited" ? "Rate limited. Wait 1 min." : "Generate an API key from settings.";
          usersDiv.innerHTML = `<p class="explore__end">${msg}</p>`;
          return;
        }

        renderUsers(data.users, usersDiv);
        setupPagination(data.pagination, usersWrapper);
      } catch (err) {
        console.error("i couldnt get users api grrrrrrrrrr >:(", err);
        usersDiv.innerHTML = `<p class="explore__end">Error fetching users.</p>`;
      }
    }

    function renderUsers(users, targetElement) {
      if (!users || users.length === 0) {
        targetElement.innerHTML = `<p class="explore__end">No users found.</p>`;
        return;
      }

      const html = users.map(user => `
        <div class="user-card">
          <p class="user-card__id">#${user.id}</p>
          <img src="${user.avatar}" class="user-avatar"/>
          <h3 class="user-card__title">
            <a href="https://flavortown.hackclub.com/users/${user.id}" target="_blank" style="color: inherit;">
              ${user.display_name}
            </a>
          </h3>
        </div>
      `).join('');

      targetElement.insertAdjacentHTML("beforeend", html);
    }

    function setupPagination(pagination, wrapper) {
      const oldPagination = wrapper.querySelector(".explore__pagination");
      if (oldPagination) oldPagination.remove(); // fucking nuke the old next page button :D

      if (pagination && pagination.current_page < pagination.total_pages) {
        const paginationDiv = document.createElement("div");
        paginationDiv.classList.add("explore__pagination");
        paginationDiv.innerHTML = `
          <button type="button" class="btn btn--brown" style="position: relative;" id="load-more-users">
            Load More Users
          </button>
        `;
        wrapper.appendChild(paginationDiv);
        paginationDiv.querySelector("#load-more-users").addEventListener("click", () => {
          currentPage++;
          getUsers(currentPage);
        });
      }
    }

    getUsers();
  });

  exploreNav.insertBefore(usersComponent, exploreNav.querySelector(".explore__nav-component[href='/explore/following']"));
}

// function addAchievementInfo() { // deprecate
//   const achievementGridDiv = document.querySelector(".achievements__grid");
//   if (!achievementGridDiv) return;
//   const achievementMap = {
//     "Anyone Can Cook!": "Sign up to Flavortown",
//     "Very Fried": "Verify your identity",
//     "Home Cookin'": "Make your first project",
//     "Recipe Notes": "Post a devlog",
//     "Yapper": "Comment on a devlog",
//     "Off the Menu": "Buy something from the shop (NOT free stickers)",
//     "Regular Customer": "Buy 5 items from the shop",
//     "VIP Diner": "Buy 10 items from the shop",
//     "Line Cook": "Have 5 or more projects",
//     "Order Up!": "Ship your first project",
//     "Michelin Star": "Have your project approved for shipping",
//     "Cookbook Author": "Post 10 devlogs",
//     "Scrapbook usage?!": "Use scrapbook in a devlog",
//     "Cooking": "Get 'fire' project status, given out by Flavortown devs",
//     "Accept cookies": "Spam the cookie ? amount of times."
//   };
//   const secretMap = {
//     "15": {name: "Cookbook Author", desc: "Post 10 devlogs", reward: "15"},
//     "16": {name: "Scrapbook usage?!", desc: "Use scrapbook in a devlog"},
//     "17": {name: "Cooking", desc: "Get 'fire' project status, given out by Flavortown devs", reward: "5"},
//     "18": {name: "Accept cookies", desc: "Spam the cookie for a certain amount."} // isnt in fucking source code :(
//   };
//   const achievementCards = achievementGridDiv.querySelectorAll(".achievements__card");
//   achievementCards.forEach((achievementCard, index) => {
//     const achievementCardNameEl = achievementCard.querySelector(".achievements__name");
//     const achievementCardDescriptionEl = achievementCard.querySelector(".achievements__description");
//     const achievementCardRewardEl = achievementCard.querySelector(".achievements__reward.achievements__reward--secret");

//     if (!achievementCardNameEl || !achievementCardDescriptionEl) return;

//     const achievementCardName = achievementCardNameEl.textContent.trim();
//     const position = (index + 1).toString(); // fuck 0-index

//     if (achievementCardName === "???" && secretMap[position]) {
//       achievementCardNameEl.textContent = secretMap[position].name;
//       achievementCardDescriptionEl.textContent = secretMap[position].desc;
//       if (achievementCardRewardEl && secretMap[position].reward) {
//         achievementCardRewardEl.textContent = `+${secretMap[position].reward} 🍪`;
//       }
//     } else if (achievementMap[achievementCardName]) {
//       achievementCardDescriptionEl.textContent = achievementMap[achievementCardName];
//     }
//   })
// }

async function addSpicetownSettings() {
  const settingsForm = await document.querySelector(".settings-form");
  if (!settingsForm) return;
  const modalActions = await settingsForm.querySelector(".modal__actions");
  const saveBtn = await modalActions.querySelector(".modal__actions-close");

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

    rerollApiHeading.appendChild(rerollApiForm);

    const rerollApiBtn = rerollApiForm.querySelector("button");
    rerollApiBtn.style.background = "none";
    rerollApiBtn.style.border = "none";
    rerollApiBtn.style.cursor = "pointer";

    const rerollApiSvg = rerollApiForm.querySelector("svg");
    rerollApiSvg.style.color = "var(--color-text-body)";

    const copyApiBtn = document.createElement("button");
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

  const syncSection = document.createElement("div");
  syncSection.className = "settings-section";
  syncSection.innerHTML = `
    <h3>beep boop data management center</h3>
    <p>export ur settings to move to another device</p>
    <div>
      <button id="btn-export-settings" class="btn btn--brown">export settings</button>
      <label class="btn btn--brown">
        import settings
        <input type="file" id="file-import-settings" accept=".json">
      </label>
    </div>
  `;
  settingsForm.appendChild(syncSection);

  document.getElementById("btn-export-settings").addEventListener("click", async () => {
    const localStore = await chrome.storage.local.get(null);
    const exportData = {
      timestamp: Date.now(),
      version: 1,
      storage: localStore,
      browserLocal: {
        "bg-color-theme": localStorage.getItem("bg-color-theme")
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spicetown-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  document.getElementById("file-import-settings").addEventListener("change", (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.storage) throw new Error("invalid backup file format!!!!!!!! uh oh");
        await chrome.storage.local.set(data.storage);
        if (data.browserLocal) {
          Object.entries(data.browserLocal).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value);
          });
        }
        alert("settings imported successfully and will load after we reload the website!");
        location.reload();
      } catch (error) {
        console.error(error);
        alert("failed to import settings check console for more details");
      }
    };
    reader.readAsText(file);
  });
}

async function addThemesPage() {
  const sidebar = document.querySelector("aside.sidebar");
  if (!sidebar) return;

  const sidebarNavList = document.querySelector(".sidebar__nav-list");
  const themesNavItem = document.createElement("li");
  themesNavItem.innerHTML = `
    <li class="sidebar__nav-list">
      <a class="sidebar__nav-link" href="/themes">
        <span class="sidebar__nav-icon-wrapper" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="sidebar__nav-icon">
            <path d="M10.8468 21.9342C5.86713 21.3624 2 17.1328 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.1565 18.7173 16.7325 15.9135 16.3703C14.2964 16.1614 12.8386 15.9731 12.2619 16.888C11.8674 17.5136 12.2938 18.2938 12.8168 18.8168C13.4703 19.4703 13.4703 20.5297 12.8168 21.1832C12.2938 21.7062 11.5816 22.0186 10.8468 21.9342ZM11.085 6.99976C11.085 7.82818 10.4134 8.49976 9.585 8.49976C8.75658 8.49976 8.085 7.82818 8.085 6.99976C8.085 6.17133 8.75658 5.49976 9.585 5.49976C10.4134 5.49976 11.085 6.17133 11.085 6.99976ZM6.5 13C7.32843 13 8 12.3284 8 11.5C8 10.6716 7.32843 9.99998 6.5 9.99998C5.67157 9.99998 5 10.6716 5 11.5C5 12.3284 5.67157 13 6.5 13ZM17.5 13C18.3284 13 19 12.3284 19 11.5C19 10.6716 18.3284 9.99998 17.5 9.99998C16.6716 9.99998 16 10.6716 16 11.5C16 12.3284 16.6716 13 17.5 13ZM14.5 8.49998C15.3284 8.49998 16 7.82841 16 6.99998C16 6.17156 15.3284 5.49998 14.5 5.49998C13.6716 5.49998 13 6.17156 13 6.99998C13 7.82841 13.6716 8.49998 14.5 8.49998Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
          </svg>
        </span>
        <span class="sidebar__nav-label">
          Themes
        </span>
      </a>
    </li>
  `
  sidebarNavList.appendChild(themesNavItem);

  themesNavItem.addEventListener("click", (event) => {
    event.preventDefault();
    window.history.pushState({}, "", "/themes");
    Array.from(document.body.children).forEach(node => {
      if (node.tagName.toLowerCase() === "div") node.remove();
    });
    document.querySelector("a.sidebar__nav-link.sidebar__nav-link--active").classList.remove("sidebar__nav-link--active");
    themesNavItem.querySelector("a.sidebar__nav-link").classList.add("sidebar__nav-link--active");
    const themesDiv = document.createElement("div");
    themesDiv.classList.add("themes");
    themesDiv.innerHTML = `
      <div class="ui-heading ui-heading--orange">
          <div class="ui-heading__stack">
            <span class="ui-heading__backdrop" aria-hidden="true"></span>
            <div class="ui-heading__surface">
              <h1 class="ui-heading__title">Themes</h1>
            </div>
          </div>
        </div>
        <div class="themes__div-container">
          <div class="themes__div-label-container">
            <h2>Themes</h2>
            <p>Choose your spice!</p>
          </div>
          <div class="themes__div-options-container" id="bg-color-container">
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-vanilla">
              <p class="themes__div-option-name">Vanilla</p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-catppuccin-mocha">
              <p class="themes__div-option-name">Catppuccin Mocha</p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-catppuccin-macchiato">
              <p class="themes__div-option-name">Catppuccin Macchiato</p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-charcoal">
              <p class="themes__div-option-name">Charcoal <small>(by Aperaine)</small></p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-midnight">
              <p class="themes__div-option-name">Midnight <small>(by Joko26)</small></p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-ruby">
              <p class="themes__div-option-name">Ruby</p>
            </div>
            <div class="themes__div-option themes__div-option--bg-color" name="bg-color-option" id="bg-color-leafy">
              <p class="themes__div-option-name">Leafy</p>
            </div>
          <div>
        </div>
      </div>
    </div>
      <div class="themes__div-container">
        <div class="themes__div-label-container">
          <h2>Custom Theme</h2>
          <p>Mix your own theme!</p>
        </div>
        <div class="themes__custom-editor">
          <div class="themes__color-grid">
            <label>primary bg: <input type="color" id="custom-bg-primary" value="#1e1e2e"></label>
            <label>card bg: <input type="color" id="custom-surface-card" value="#6c7086"></label>
            <label>accent: <input type="color" id="custom-accent" value="#7ca6e9"></label>
            <label>text: <input type="color" id="custom-text-primary" value="#bac2de"></label>
          </div>
          <button id="save-custom-theme" class="btn btn--brown">Apply</button>
        </div>
      </div>
    </div>
    `
    document.body.insertBefore(themesDiv, document.querySelector(".dev-footer"));
    const elements = {
      bgColorContainer: document.getElementById("bg-color-container"),
      bgColorOptions: document.querySelectorAll(".themes__div-option--bg-color"),
      bgColorVanilla: document.getElementById("bg-color-vanilla")
    }

    if (savedBgColor) {
      const activeOpt = document.getElementById(savedBgColor);
      if (activeOpt) activeOpt.setAttribute("selected", true);
    }

    elements.bgColorOptions.forEach(option => {
      option.addEventListener("click", selectBgColorOption);
    });

    async function selectBgColorOption(event) {
      const selectedId = event.currentTarget.id;
      
      elements.bgColorOptions.forEach(opt => opt.setAttribute("selected", "false"));
      event.currentTarget.setAttribute("selected", "true");

      localStorage.setItem("bg-color-theme", selectedId);
      await chrome.storage.local.set({ "selectedTheme": selectedId });

      if (typeof applyTheme === "function") {
        applyTheme(selectedId);
      } else {
        chrome.runtime.sendMessage({ type: "THEME_UPDATED", themeId: selectedId });
      }
    }

    const saveBtn = document.getElementById("save-custom-theme");
    saveBtn.addEventListener("click", async () => {
      const customTheme = {
        "--bg-primary": document.getElementById("custom-bg-primary").value,
        "--surface-card": document.getElementById("custom-surface-card").value,
        "--accent": document.getElementById("custom-accent").value,
        "--text-primary": document.getElementById("custom-text-primary").value
      };
      localStorage.setItem("bg-color-theme", "custom");
      await chrome.storage.local.set({
        "selectedTheme": "custom",
        "customThemeValues": customTheme
      });
      chrome.runtime.sendMessage({type: "THEME_UPDATED", themeId: "custom"});
    });
  })
}

async function addDevlogGenerator() {
  const path = window.location.pathname;
  if (path.includes("/projects/") && !path.includes("/devlogs/")) {
    const repoLink = Array.from(document.querySelectorAll(".project-show-card__actions a"))
      .find(a => a.textContent.toLowerCase().includes("repository"));
    if (repoLink) sessionStorage.setItem("active_repo_url", repoLink.href);
  }

  if (path.includes("/devlogs/new")) {
    let repoUrl = sessionStorage.getItem("active_repo_url");
    if (!repoUrl) {
      const projectId = path.match(/\/projects\/(\d+)/)?.[1];
      if (projectId) {
        try {
          const response = await fetch(`https://flavortown.hackclub.com/projects/${projectId}`);
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const repoLink = Array.from(doc.querySelectorAll(".project-show-card__actions a"))
            .find(a => a.textContent.toLowerCase().includes("repository"));
          if (repoLink) {
            repoUrl = repoLink.href;
            sessionStorage.setItem("active_repo_url", repoUrl);
          }
        } catch (error) {
          console.error("failed to backload a repo url ", error);
        }
      }
    }
    if (repoUrl) injectDevlogTools(repoUrl);
  }

  async function injectDevlogTools(repoUrl) {
    const textArea = document.querySelector("#post_devlog_body");
    if (!textArea || document.getElementById("devlog-gen-container")) return;

    const repoPath = repoUrl.replace(/https?:\/\/github\.com\//, "").split("/").slice(0, 2).join("/");

    const container = document.createElement("div");
    container.id = "devlog-gen-container";
    container.innerHTML = `
      <div>
        <select id="commit-from"><option>loading commits...</option></select>
        <span>to</span>
        <select id="commit-to"><option>select your from commit first</option></select>
        <button type="button" id="btn-gen-devlog" class="btn btn--brown">add changelog</button>
      </div>
      <small>repository: ${repoPath}</small>
    `;
    textArea.parentElement.parentElement.parentElement.insertBefore(container, document.querySelector(".projects-new__field.projects-new__devlog-text"));

    try {
      const response = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=50`);
      const allCommits = await response.json();

      const fromSelect = document.getElementById("commit-from");
      const toSelect = document.getElementById("commit-to");
      fromSelect.innerHTML = allCommits.map(commit => `<option value="${commit.sha}">${commit.commit.message.split("\n")[0].substring(0, 16)}... (${commit.sha.substring(0, 7)})</option>`).join("");
      const updateToDropdown =() => {
        const selectedIndex = fromSelect.selectedIndex;
        const validToCommits = allCommits.slice(0, selectedIndex + 1);
        toSelect.innerHTML = validToCommits.map(commit => `<option value="${commit.sha}">${commit.commit.message.split("\n")[0].substring(0, 16)}... (${commit.sha.substring(0, 7)})</option>`).join("");
      };
      fromSelect.addEventListener("change", updateToDropdown);
      updateToDropdown();
    } catch (error) {
      document.getElementById("commit-from").innerHTML = "<option>Failed to load commits</option>";
    }

    document.getElementById("btn-gen-devlog").addEventListener("click", async () => {
      const from = document.getElementById("commit-from").value;
      const to = document.getElementById("commit-to").value;
      
      const button = document.getElementById("btn-gen-devlog");
      button.textContent = "adding...";
      button.disabled = true;

      const devlogContent = await generateDevlog(repoUrl, from, to);
      textArea.value += (textArea.value ? "\n\n" : "") + devlogContent;

      button.textContent = "add changelog";
      button.disabled = false;
    });
  }

  async function generateDevlog(repoUrl, from, to) {
    let repoPath = repoUrl.replace("https://github.com/", "").replace("http://github.com/", "").split("/").slice(0, 2).join("/");
    const apiUrl = `https://api.github.com/repos/${repoPath}/compare/${from}%5E...${to}`;
    
    try {
      const response = await fetch(apiUrl);
      if (response.status === 404) {
        throw new Error("repo or commits not found, check if hashes and repo names are correct!!!!!!!!!!! pweeaseee");
      }
      const data = await response.json();
      if (!data.commits || data.commits.length === 0) {
        alert("no commits found in that range (p.s. 'from' should be an older commit than 'to')");
        return "";
      }

      return data.commits.map(commit => {
        const shortSha = commit.sha.substring(0, 7);
        const message = commit.commit.message.split("\n")[0].trim();
        return `- ${message} ([${shortSha}](${commit.html_url}))`;
      }).join("\n");
    } catch (error) {
      alert(error.message);
      return "";
    }
  }
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

async function addExtraShipInfo() {
  const shipPosts = document.querySelectorAll(".post.post--ship:not([data-payout-type])");
  if (shipPosts.length === 0) return;

  shipPosts.forEach(shipPost => {
    let mins = 0;
    let next = shipPost.nextElementSibling;
    while (next && !next.classList.contains("post--ship")) {
      if (next.classList.contains("post--devlog")) {
        const d = next.querySelector(".post__duration")?.textContent || "";
        const h = d.match(/(\d+)h/)?.[1] || 0;
        const m = d.match(/(\d+)m/)?.[1] || 0;
        mins += (parseInt(h) * 60) + parseInt(m);
      }
      next = next.nextElementSibling;
    }

    const timeSinceItem = document.createElement("div");
    timeSinceItem.className = "post__payout-item";
    timeSinceItem.innerHTML = `
      <span class="post__payout-label">Time since:</span>
      <span class="post__payout-value">${convertMToFormat(totalTime - mins)}</span>
    `;

    const footer = shipPost.querySelector(".post__payout-footer");
    if (footer) {
      footer.appendChild(timeSinceItem);
      shipPost.setAttribute("data-payout-type", "processed");
    }
  });
}

function addDevlogImageTools() {
  // coming soon :D
}

async function fetchSlackEmojis() {
  return new Promise((resolve) => {
    api.runtime.sendMessage({type: "GET_SLACK_EMOJIS"}, (data) => {
      if (data && data.ok) {
        slackEmojiMap = data.emoji;
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

function watchForNewComments() {
  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      change.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const hasComments = node.classList?.contains("comment") || node.querySelector(".comment");
          if (hasComments) {
            setTimeout(addEmojiRendering, 50);
          }
        }
      })
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

function addEmojiAutocomplete() {
  let currentMatches = [];
  const menu = document.createElement("div");
  menu.className = "emoji-preview-menu";
  menu.style.display = "none";
  document.body.appendChild(menu);

  const triggerCheck = (target) => {
    if (!target.matches("textarea, input")) return;
    const text = target.value;
    const cursorPos = target.selectionStart;
    const textBeforeCursor = text.slice(0, cursorPos);
    const match = textBeforeCursor.match(/:([a-z0-9_\-+]*)$/i);

    if (match) {
      const query = match[1].toLowerCase();
      currentMatches = Object.keys(slackEmojiMap)
        .filter(name => name.includes(query))
        .sort((a, b) => a.length - b.length)
        .slice(0, 10);

      if (currentMatches.length > 0) {
        showMenu(target, currentMatches, query);
      } else {
        menu.style.display = "none";
      }
    } else {
      menu.style.display = "none";
    }
  };

  document.addEventListener("input", (event) => triggerCheck(event.target));
  document.addEventListener("focusin", (event) => triggerCheck(event.target));
  document.addEventListener("focusout", () => {
    setTimeout(() => {
      menu.style.display = "none";
    }, 150);
  });

  function showMenu(input, matches, query) {
    menu.innerHTML = "";
    const rect = input.getBoundingClientRect();
    menu.style.display = "block";
    menu.style.left = `${rect.left + window.scrollX}px`;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight + 100}px`;

    matches.forEach((name) => {
      let url = slackEmojiMap[name];
      if (!url) return;
      if (url.startsWith('alias:')) {
        const target = url.split(":")[1];
        url = slackEmojiMap[target];
      }
      const item = document.createElement("div");
      item.className = "emoji-option";
      item.innerHTML = `<img src="${url}" style="width: 20px; height: 20px;"> <span>:${name}:</span>`;
      item.onclick = () => insertEmoji(input, name, url);
      menu.appendChild(item);
    });
  }

  function insertEmoji(input, name, originalUrl) {
    const text = input.value;
    const cursorPos = input.selectionStart;
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&w=24&h=24&fit=contain`;
    const emojiMarkdown = `![${name}](${proxyUrl}) `;
    const before = text.slice(0, cursorPos).replace(/:[a-z0-9_\-+]*$/, emojiMarkdown);
    const after = text.slice(cursorPos);
    input.value = before + after;
    const menu = document.querySelector(".emoji-preview-menu");
    if (menu) menu.style.display = "none";
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function showUpdateBanner(version) {
  // Prevent duplicate banners
  if (document.getElementById("spicetown-update-banner")) return;

  const banner = document.createElement("div");
  banner.id = "spicetown-update-banner";
  banner.innerHTML = `
    <strong>This extension is outdated!</strong>
    <p>Version ${version} is ready to be installed.</p>
    <button id="go-update-btn">Update Now</button>
    <button id="close-update-banner">Ignore</button>
  `;

  document.body.appendChild(banner);

  document.getElementById("go-update-btn").addEventListener("click", () => {
    api.runtime.sendMessage({type: "OPEN_EXTENSIONS_PAGE"});
  });
  document.getElementById("close-update-banner").addEventListener("click", () => {
    banner.remove();
  });
}

async function addWeeklyGains() {
  const userElements = document.querySelectorAll(".user");
  const userIds = [];
  const idToElementMap = {};

  userElements.forEach(element => {
    const link = element.querySelector("a[href^='/users/']");
    if (link) {
      const id = link.getAttribute("href").split("/").pop();
      userIds.push(id);
      idToElementMap[id] = element.querySelector("p");
    }
  });

  refreshApiKey();

  api.runtime.sendMessage({
    type: "FETCH_WEEKLY_LEADERBOARD",
    userIds: userIds,
    currentApiKey: apiKey
  }, (weeklyData) => {
    if (!weeklyData) return;
    Object.keys(weeklyData).forEach(userId => {
      const gain = weeklyData[userId];
      const pTag = idToElementMap[userId];

      if (pTag && !pTag.dataset.weeklyAdded) {
        const span = document.createElement("small");
        span.textContent = ` (${gain >= 0 ? '+' : ''}${gain})`;
        pTag.appendChild(span);
        pTag.dataset.weeklyAdded = "true";
      }
    });
  });
}

function updateThemeCache(themeId) {
    const cacheData = {
        themeId: themeId,
        timestamp: Date.now()
    };
    localStorage.setItem('flavortown-theme-cache', JSON.stringify(cacheData));

    chrome.storage.local.set({ selectedTheme: themeId });
}

async function addProjectVotes() {
  const posts = document.querySelectorAll(".post--ship");
  posts.forEach(async post => {
    // Get the project name via the project link on the ship post!
    // hey if ur looking through the code should i keep up with commenting stuff?
    const projectLink = Array.from(post.querySelectorAll("a[href^='/projects/']"))
      .find(a => !a.textContent.toLowerCase().includes("repository"));
    if (!projectLink || post.dataset.votesLoaded) return;

    const projectName = projectLink.textContent.trim();
    post.dataset.votesLoaded = "true";

    const cacheKey = `votes_cache_${projectName}`;
    const cachedData = await chrome.storage.local.get([cacheKey]);
    const now = Date.now();
    let votes = null;

    if (cachedData[cacheKey]) {
      const {data, timestamp} = cachedData[cacheKey];
      if (now - timestamp < 600000) {
        votes = data;
      } // every 6 minutes? (i think so im not sure :P;) [it's 10 minutes now]
    }

    const renderVotes = (voteList) => {
      if (voteList && voteList.length > 0) {
        const votesContainer = document.createElement("div");
        votesContainer.className = "post__votes-container";

        const title = document.createElement("strong");
        title.textContent = "Public Votes";
        votesContainer.appendChild(title);

        voteList.forEach((vote, index) => {
          const voteEl = document.createElement("div");
          voteEl.className = "public-vote-item";
          if (index >= 5) {
            voteEl.style.display = "none";
            voteEl.classList.add("is-collapsed");
          }
          voteEl.innerHTML = `
            <div>
              <img src="${vote.image}"/>
              <strong>@${vote.voter}</strong>
              <small>${vote.timeAgo}</small>
            </div>
            ${vote.text}
          `;
          votesContainer.appendChild(voteEl);
        });

        if (voteList.length > 5) {
          const viewMoreBtn = document.createElement("button");
          viewMoreBtn.textContent = `View ${voteList.length - 5} more votes`;
          viewMoreBtn.className = "btn-view-more-votes";
          viewMoreBtn.addEventListener("click", () => {
            const hiddenVotes = Array.from(votesContainer.querySelectorAll(".is-collapsed"));
            hiddenVotes.slice(0, 5).forEach(element => {
              element.style.display = "block";
              element.classList.remove("is-collapsed");
            });
            const stillHidden = votesContainer.querySelectorAll(".is-collapsed").length;
            if (stillHidden > 0) {
              viewMoreBtn.textContent = `View ${stillHidden} more votes`
            } else {
              viewMoreBtn.remove();
            }
          });

          votesContainer.appendChild(viewMoreBtn);
        }

        post.querySelector(".post__content").appendChild(votesContainer);
      }
    };

    if (votes) {
      renderVotes(votes);
      return;
    }

    api.runtime.sendMessage({
      type: "FETCH_COMMUNITY_VOTES",
      projectName: projectName
    }, async (fetchedVotes) => {
      if (fetchedVotes) {
        await chrome.storage.local.set({
          [cacheKey]: {
            data: fetchedVotes,
            timestamp: Date.now()
          }
        });

        renderVotes(fetchedVotes);
      }
    });
  });
}

async function improveKitchenLayout() {
  const kitchenIndex = document.querySelector(".kitchen-index");
  if (!kitchenIndex) return;
  // remove the not so needed divs
  kitchenIndex.querySelector(".kitchen-setup").remove();
  kitchenIndex.querySelector(".kitchen-comic").remove();
  kitchenIndex.querySelector(".kitchen-help").remove();

  const kitchenStreak = document.createElement("div");
  kitchenStreak.className = "state-card state-card--neutral kitchen-stats-card";
  kitchenStreak.innerHTML = `
    <div class="kitchen-stats-card__content">
      <div class="state-card__title">Streak</div>
      <div class="state-card__streak">loading</div>
    </div>
  `;
  kitchenIndex.querySelector(".kitchen-stats__grid").appendChild(kitchenStreak);

  const lbRank = kitchenIndex.querySelector(".kitchen-stats-card__rank").textContent.replace(/\D/g, "");
  try {
    const {lb_cache} = await chrome.storage.local.get("lb_cache");
    let totalUsers = lb_cache?.total;
    if (!totalUsers || Date.now() - lb_cache.ts > 3600000) { // 1 hour
      const html = await fetch("https://flavortown.hackclub.com/leaderboard").then(resolve => resolve.text());
      const doc = new DOMParser().parseFromString(html, "text/html");
      totalUsers = parseInt(doc.querySelector("main > .subtitle")?.textContent.replace(/\D/g, ""), 10);
      if (totalUsers) chrome.storage.local.set({lb_cache: {total: totalUsers, ts: Date.now()}});
    }
    if (totalUsers) {
      const percentValue = (lbRank / totalUsers) * 100;
      const displayedPercent = Number(percentValue.toPrecision(2));
      kitchenIndex.querySelector(".kitchen-stats-card__rank").innerHTML += ` <small>(Top ${displayedPercent}%)</small>`;
    }
  } catch (err) {
    console.error("i couldnt get leaderboard page grrrrrrrrrr >:(", err);
  }
}

async function addDevlogStreak() {
  const kitchenIndex = document.querySelector(".kitchen-index");
  if (!kitchenIndex) return;

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const userLink = document.querySelector(".sidebar__user-details").querySelector("a");
  if (!userLink) return;
  const userLinkHref = userLink.pathname;
  try {
    const cacheKey = `devlog_streak_cache_${userLinkHref}`;
    const cachedData = await chrome.storage.local.get([cacheKey]);
    const now = Date.now();
    const todayString = new Date().toISOString().split("T")[0];

    const updateStreakUI = (streakValue, datesSet) => {
      kitchenIndex.querySelector(".state-card__streak").innerHTML = `${streakValue} <small>days</small>`;
      if (datesSet.has(todayString)) {
        kitchenIndex.querySelector(".state-card__streak").classList.add("state-card__streak--done");
      } else {
        kitchenIndex.querySelector(".state-card__streak").classList.remove("state-card__streak--done");
      }
    };

    if (cachedData[cacheKey]) {
      const {streak, lastChecked, dates} = cachedData[cacheKey];
      const datesSet = new Set(dates || []);
      if (now - lastChecked < 600000) {
        updateStreakUI(streak, datesSet);
        return
      }; // 10 mins??? if math is mathing (IT WAS 6 MINS; changed it to 10)
    }

    await refreshApiKey();
    const userResponse = await fetch(`https://flavortown.hackclub.com/api/v1${userLinkHref}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });
    const userData = await userResponse.json();

    const projectIds = userData.project_ids || [];
    const projectPromises = projectIds.map(id =>
      fetch(`https://flavortown.hackclub.com/api/v1/projects/${id}`,{
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      }).then(resolve => resolve.json())
    );
    const projects = await Promise.all(projectPromises);

    const allDevlogIds = projects.flatMap(project => project.devlog_ids || []).sort((a, b) => b - a);
    const uniqueDates = new Set();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    for (const id of allDevlogIds) {
      await wait(250);
      const devlogResponse = await fetch(`https://flavortown.hackclub.com/api/v1/devlogs/${id}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });
      const devlog = await devlogResponse.json();
      if (!devlog || !devlog.created_at) continue;
      const logDate = devlog.created_at.split("T")[0];

      if (uniqueDates.size === 0 && logDate !== todayString && logDate !== yesterdayString) break;
      if (!uniqueDates.has(logDate)) {
        if (uniqueDates.size > 0) {
          const lastDate = new Date([...uniqueDates].pop());
          lastDate.setDate(lastDate.getDate() - 1);
          if (logDate !== lastDate.toISOString().split("T")[0]) break;
        }
        uniqueDates.add(logDate);
      }
    }

    const activeDates = [...uniqueDates].sort((a, b) => new Date(b) - new Date(a));
    if (activeDates.length === 0) return;

    if (activeDates[0] !== todayString && activeDates[0] !== yesterdayString) return;

    let streak = 0;
    let checkDate = new Date(activeDates[0]);

    for (let i = 0; i < activeDates.length; i++) {
      const currentDateString = activeDates[i];
      const expectedDateString = checkDate.toISOString().split("T")[0];
      if (currentDateString === expectedDateString) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    updateStreakUI(streak, uniqueDates);

    await chrome.storage.local.set({
      [cacheKey]: {
        streak: streak,
        lastChecked: Date.now(),
        dates: [...uniqueDates]
      }
    });
  } catch (error) {
    console.error("adding devlog streak did not work because ", error);
  }
}

function addNextShipEstimation() {
  const payoutFooters = document.querySelectorAll(".post__payout-footer");
  if (payoutFooters.length === 0) return;

  const latestFooter = payoutFooters[payoutFooters.length - 1];

  const calculate = () => {
    const items = Array.from(latestFooter.querySelectorAll(".post__payout-item"));
    const multiplierItem = items.find(i => i.querySelector(".post__payout-label")?.textContent.includes("Multiplier"));
    const timeSinceItem = items.find(i => i.querySelector(".post__payout-label")?.textContent.includes("Time since"));

    if (!multiplierItem || !timeSinceItem) return false; // Not loaded yet

    const multiplier = parseFloat(multiplierItem.querySelector(".post__payout-value").textContent.replace(/[^\d.]/g, '')) || 0;
    const timeText = timeSinceItem.querySelector(".post__payout-value").textContent;

    const h = parseInt(timeText.match(/(\d+)h/)?.[1] || 0);
    const m = parseInt(timeText.match(/(\d+)m/)?.[1] || 0);
    const totalHours = h + (m / 60);

    const estimatedPayout = Math.round(totalHours * multiplier);

    const targetLink = document.querySelector("#ship-btn-wrapper > *");
    if (!targetLink) return false;
    if (targetLink.textContent.includes("~🍪")) return true;
    targetLink.textContent += ` ~🍪 ${estimatedPayout}`;

    return true;
  };

  const observer = new MutationObserver((mutations, obs) => {
    if (calculate()) {
      obs.disconnect();
    }
  });

  observer.observe(latestFooter, {
    childList: true,
    subtree: true,
    characterData: true
  });

  calculate();
}

// coming soon (wip)
// function addShopItemEstimation() {
//   document.querySelectorAll(".shop-item-card").forEach(card => {
//     let isFlipped = false;
//     let isFlipping = false;
//     let originalContent = null;

//     card.addEventListener("mouseenter", () => {
//       if (!isFlipped && !isFlipping) {
//         isFlipping = true;

//         originalContent = Array.from(card.childNodes).map(node => node.cloneNode(true));

//         card.style.setProperty("transform", "scaleX(-1)", "important");
//         isFlipped = true;

//         setTimeout(() => {
//           isFlipping = false;
//         }, 200);

//         card.innerHTML = ""; 
//       }
//     });

//     const resetCard = () => {
//       isFlipping = true;
//       card.style.transform = "";
//       isFlipped = false;

//       if (originalContent) {
//         card.innerHTML = '';
//         originalContent.forEach(node => card.appendChild(node));
//       }

//       setTimeout(() => {
//         isFlipping = false;
//       }, 200);
//     };

//     card.addEventListener("mousemove", (event) => {
//       if (isFlipping) return;

//       const rect = card.getBoundingClientRect();
//       const buffer = 5;
//       const isOutside = 
//         event.clientX < rect.left - buffer || 
//         event.clientX > rect.right + buffer || 
//         event.clientY < rect.top - buffer || 
//         event.clientY > rect.bottom + buffer;

//       if (isOutside && isFlipped) {
//         resetCard();
//       }
//     });

//     card.addEventListener("mouseleave", () => {
//       if (!isFlipping && isFlipped) {
//         resetCard();
//       }
//     });
//   });
// }

function str_rand(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}

function convertMToFormat(mins) {
  let h = Math.floor(mins / 60);
  let m = Math.floor(mins % 60);
  return `${String(h)}h ${String(m)}m`;
}

initialize();