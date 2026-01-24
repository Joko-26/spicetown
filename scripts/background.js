// please firefox work w/ background scripts pwease
// ok it didnt so im adding a certain something

const api = typeof browser !== "undefined" ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SLACK_EMOJIS") {
    fetch("https://slack.com/api/emoji.list", {
      headers: {"Authorization": "Bearer xoxb-2210535565-10363082154950-Q7Y1CHTqIKUSzgrpAKbLDvBk"} // this is safe to expose because the only perm is to view emojis :D
                                                                                                   // hopefully? :3
    })
      .then(response => response.json())
      .then(data => sendResponse(data))
      .catch(error => sendResponse({ok: false, error: error.message}));
    return true;
  }
});