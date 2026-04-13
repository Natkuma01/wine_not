import api from "./api";

function getSessionId() {
  let id = sessionStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("session_id", id);
  }
  return id;
}

export function trackVisit(path) {
  api
    .post("/analytics/track/", {
      path,
      session_id: getSessionId(),
      referrer: document.referrer || "",
    })
    .catch(() => {
      // silently ignore tracking failures
    });
}
