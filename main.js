const tg = window.Telegram?.WebApp;
const log = (...a) => { document.getElementById('log').textContent += a.join(' ') + '\n'; };

if (!tg) {
  document.body.innerHTML = "<p>Открой в Telegram Mini App.</p>";
  throw new Error("No Telegram.WebApp");
}
tg.ready();

const MESSAGE_ID = "LmaSRHTyQcfXzZgL";

async function shareOnce(id) {
  return new Promise((resolve, reject) => {
    const handler = (evt) => {
      const d = evt?.data;
      if (d?.eventType === "prepared_message_failed") {
        window.removeEventListener("message", handler);
        reject(d?.eventData);
      }
      if (d?.eventType === "prepared_message_sent") {
        window.removeEventListener("message", handler);
        resolve(d?.eventData);
      }
    };
    window.addEventListener("message", handler);
    try { tg.shareMessage(String(id)); } catch (e) { reject(e); }
  });
}

async function shareFlow() {
  try {
    await shareOnce(MESSAGE_ID);
    log("sent");
  } catch (e) {
    log("error:", e?.error || e?.message || String(e));
  }
}

document.getElementById("share").addEventListener("click", shareFlow);
