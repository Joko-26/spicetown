// please firefox work w/ background scripts pwease
// ok it didnt so im adding a certain something

const api = typeof browser !== "undefined" ? browser : chrome;
const isFirefox = typeof browser !== "undefined";
const userCache = {};

api.runtime.onUpdateAvailable.addListener((details) => {
  api.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      api.tabs.sendMessage(tabs[0].id, {type: "SHOW_UPDATE_POPUP", version: details.version});
    }
  });
});

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SLACK_EMOJIS") {
    fetch("https://cachet.dunkirk.sh/emojis")
      .then(res => res.json())
      .then(data => {
        const emojiMap = {};
        data.forEach(e => {if (e.imageUrl) emojiMap[e.name] = e.imageUrl;});
        sendResponse({ok: true, emoji: emojiMap});
      })
      .catch(error => sendResponse({ok: false, error: error.message}));
    return true;
  } else if (request.type === "RESIZE_EMOJI") {
    resizeImage(request.url, 24, 24).then(base64 => {
      sendResponse({ok: true, dataUri: base64});
    }).catch(error => {
      sendResponse({ok: false, error: error.message});
    });
    return true;
  } else if (request.type === "OPEN_EXTENSIONS_PAGE") {
    const url = isFirefox ? "about:addons" : "chrome://extensions";
    api.tabs.create({url: url});
  } else if (request.type === "FETCH_WEEKLY_LEADERBOARD") {
    Promise.all([
      fetchFeed(),
      Promise.all(request.userIds.map(id => getSlackId(id, request.currentApiKey)))
    ]).then(([totals, slackIdList]) => {
      const result = {};
      request.userIds.forEach((id, i) => {
        const sId = slackIdList[i];
        result[id] = totals[sId] || 0;
      });
      sendResponse(result);
    });
    return true;
  } else if (request.type === "FETCH_COMMUNITY_VOTES") {
    fetchVotes(request.projectName).then(votes => {
      sendResponse(votes);
    });
    return true;
  }
});

async function fetchFeed() {
  const response = await fetch(`https://slack.com/api/conversations.history?channel=C0A3JN1CMNE&oldest=${Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)}&limit=1000`, {
    headers: {"Authorization": "Bearer xoxb-2210535565-10363082154950-Q7Y1CHTqIKUSzgrpAKbLDvBk"}
  });
  const data = await response.json();

  const totals = {};

  if (data.ok) {
    data.messages.forEach(message => {
      if (!message.text) return;
      const match = message.text.match(/<@([A-Z0-9]+)>.*?Balance\s+([+-]\d+)/i);
      if (match) {
        const slackId = match[1];
        const change = parseInt(match[2]);
        totals[slackId] = (totals[slackId] || 0) + change;
      }
    });
  }
  return totals;
}

async function fetchVotes(projectName) {
  let allMessages = [];
  let cursor = null;
  let hasMore = true;

  try {
    while (hasMore) {
      const url = new URL("https://slack.com/api/conversations.history");
      url.searchParams.append("channel", "C0A2DTFSYSD");
      url.searchParams.append("limit", "100");
      if (cursor) url.searchParams.append("cursor", cursor);

      const response = await fetch(url.toString(), {
        headers: {"Authorization": "Bearer xoxb-2210535565-10363082154950-Q7Y1CHTqIKUSzgrpAKbLDvBk"}
      });
      const data = await response.json();

      if (!data.ok) break;
      allMessages = allMessages.concat(data.messages);
      cursor = data.response_metadata?.next_cursor;
      hasMore = !!(data.has_more && cursor);
    }

    const target = projectName.toLowerCase().trim();

    const filteredMessages = allMessages.filter(msg => {
      if (!msg.blocks || msg.blocks.length < 2) return false;
      const headerText = msg.blocks[1]?.text?.text || "";
      return headerText.toLowerCase().includes(`*${target}*`);
    });

    const votePromises = filteredMessages.map(async (msg) => {
      const voterMatch = (msg.text || "").match(/Voted by:\s*<?@?([A-Z0-9\._-]+)>?/i);
      const voterId = voterMatch ? voterMatch[1] : null;
      
      let displayName = "Unknown";
      let profilePic = "";
      if (voterId) {
        const userInfo = await getSlackUserInfo(voterId);
        displayName = userInfo.display_name || userInfo.real_name || userInfo.name || "Unknown";
        profilePic = userInfo.profile?.image_48 || "";
      }

      let voteComment = "voted for this project!";
      if (msg.blocks[3]?.text?.text) {
        voteComment = msg.blocks[3].text.text;
      }

      return {
        voter: displayName,
        image: profilePic,
        text: voteComment,
        ts: msg.ts,
        timeAgo: formatTimeAgo(msg.ts * 1000)
      };
    });

    return await Promise.all(votePromises);
  } catch (error) {
    return [];
  }
}

async function getSlackId(userId, apiKey) {
  if (userCache[userId]) return userCache[userId];
  try {
    const response = await fetch(`https://flavortown.hackclub.com/api/v1/users/${userId}`, {
      headers: {"Authorization": apiKey}
    });
    const data = await response.json();
    if (data.slack_id) {
      userCache[userId] = data.slack_id;
      return data.slack_id;
    }
  } catch (error) {console.error("ratelimited/api error", error);}
  return null;
}

async function getSlackUserInfo(userId) {
  if (userCache[userId]) return userCache[userId];
  try {
    const response = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      headers: { 
        "Authorization": "Bearer xoxb-2210535565-10363082154950-Q7Y1CHTqIKUSzgrpAKbLDvBk" 
      }
    });
    const data = await response.json();

    if (data.ok && data.user) {
      userCache[userId] = data.user;
      return data.user;
    }
    return {};
  } catch (err) {
    return {};
  }
}

async function resizeImage(url, width, height) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`http error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${response.status}`);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bitmap, 0, 0, width, height);
    
    const resizedBlob = await canvas.convertToBlob({ type: "image/png" });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(resizedBlob);
    });
  } catch (error) {
    console.error("resizing image failed i crave for help at scripts/background.js ", error);
    throw error;
  }
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Just now"
  else if (minutes === 1) return "1 minute ago"
  else if (minutes < 60) return `${minutes} minutes ago`
  else if (hours === 1) return "1 hour ago"
  else if (hours < 24) return `${hours} hours ago`
  else if (days === 1) return "1 day ago";
  return `${days} days ago`;
}