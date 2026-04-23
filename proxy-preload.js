// Preload: route all Node HTTP/HTTPS/fetch traffic through local CONNECT proxy.
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const PROXY = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "http://127.0.0.1:10808";
const NM = path.join(__dirname, "node_modules");

try {
  fs.appendFileSync(
    path.join(__dirname, "preload-trace.log"),
    `[${new Date().toISOString()}] pid=${process.pid} argv=${JSON.stringify(process.argv).slice(0, 200)}\n`,
  );
} catch {}

// 1) undici (native fetch) — proper CONNECT tunneling
try {
  const { setGlobalDispatcher, ProxyAgent } = require(path.join(NM, "undici"));
  setGlobalDispatcher(new ProxyAgent(PROXY));
} catch (e) {
  console.error("[proxy-preload] undici failed:", e.message);
}

// 2) http/https default agents — override globalAgent so node-fetch / got / axios tunnel correctly
try {
  const { HttpProxyAgent } = require(path.join(NM, "http-proxy-agent"));
  const { HttpsProxyAgent } = require(path.join(NM, "https-proxy-agent"));
  http.globalAgent = new HttpProxyAgent(PROXY);
  https.globalAgent = new HttpsProxyAgent(PROXY);
} catch (e) {
  console.error("[proxy-preload] proxy-agent failed:", e.message);
}
