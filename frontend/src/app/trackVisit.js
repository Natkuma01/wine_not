import api from "./api";

function generateId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function getSessionId() {
  let id = sessionStorage.getItem("session_id");
  if (!id) {
    id = typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : generateId();
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
