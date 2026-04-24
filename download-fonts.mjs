import { mkdirSync, writeFileSync } from "fs";
import { connect } from "net";
import { connect as tlsConnect } from "tls";
import { URL } from "url";

const PROXY_HOST = "127.0.0.1";
const PROXY_PORT = 10808;
const DEST = "./public/fonts";

mkdirSync(DEST, { recursive: true });

function fetchViaProxy(urlStr, debug = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const host = url.hostname;
    const path = url.pathname + url.search;

    const tcp = connect(PROXY_PORT, PROXY_HOST, () => {
      tcp.write(`CONNECT ${host}:443 HTTP/1.1\r\nHost: ${host}:443\r\n\r\n`);
    });

    tcp.once("data", (connectResp) => {
      if (!connectResp.toString().includes("200")) {
        tcp.destroy();
        reject(new Error("Proxy CONNECT failed: " + connectResp.toString().slice(0, 80)));
        return;
      }

      const tls = tlsConnect({ socket: tcp, servername: host, rejectUnauthorized: false });

      tls.on("connect", () => {
        tls.write(
          `GET ${path} HTTP/1.0\r\nHost: ${host}\r\nAccept: */*\r\nConnection: close\r\n\r\n`
        );
      });

      const chunks = [];
      tls.on("data", (d) => chunks.push(d));
      tls.on("end", () => {
        const raw = Buffer.concat(chunks);
        if (debug) {
          console.log("Raw response header:", raw.slice(0, 500).toString());
        }
        // Find end of headers (\r\n\r\n)
        let headerEnd = -1;
        for (let i = 0; i < raw.length - 3; i++) {
          if (raw[i] === 13 && raw[i+1] === 10 && raw[i+2] === 13 && raw[i+3] === 10) {
            headerEnd = i + 4;
            break;
          }
        }
        if (headerEnd === -1) { resolve(Buffer.alloc(0)); return; }

        // Check for redirect
        const headerStr = raw.slice(0, headerEnd).toString();
        const locationMatch = headerStr.match(/Location:\s*(.+)\r?\n/i);
        if (locationMatch) {
          const newUrl = locationMatch[1].trim();
          if (debug) console.log("Redirect to:", newUrl);
          fetchViaProxy(newUrl.startsWith("http") ? newUrl : `https://${host}${newUrl}`, debug)
            .then(resolve).catch(reject);
          return;
        }

        resolve(raw.slice(headerEnd));
      });
      tls.on("error", reject);
    });

    tcp.on("error", reject);
  });
}

const BASE = "https://cdn.fontcdn.ir/Font/Persian/Peyda";

async function main() {
  // Debug: fetch CSS
  console.log("Fetching CSS...");
  const cssBuf = await fetchViaProxy(`${BASE}/Peyda.css`, true);
  const css = cssBuf.toString("utf8");
  console.log("CSS body length:", css.length);
  if (css.length > 0) console.log("CSS preview:", css.slice(0, 300));

  let fontUrls = [];
  if (css.length > 100) {
    const matches = [...css.matchAll(/url\(['"]?([^'")\s]+\.woff2)['"]?\)/g)];
    fontUrls = [...new Set(matches.map(m => {
      const u = m[1];
      return u.startsWith("http") ? u : `${BASE}/${u}`;
    }))];
  }

  if (fontUrls.length === 0) {
    // Fallback guesses
    fontUrls = [
      "Peyda-Regular.woff2","Peyda-Medium.woff2","Peyda-SemiBold.woff2",
      "Peyda-Bold.woff2","Peyda-Black.woff2",
    ].map(f => `${BASE}/${f}`);
    console.log("Using fallback file names:", fontUrls);
  } else {
    console.log("Found from CSS:", fontUrls);
  }

  for (const url of fontUrls) {
    const filename = url.split("/").pop().split("?")[0];
    try {
      const buf = await fetchViaProxy(url);
      if (buf.length < 1000) {
        console.log(`SKIP (${buf.length} bytes, likely error): ${filename}`);
        console.log("  Content:", buf.slice(0,200).toString());
        continue;
      }
      writeFileSync(`${DEST}/${filename}`, buf);
      console.log(`✓ ${filename} (${(buf.length/1024).toFixed(1)} KB)`);
    } catch(e) {
      console.log(`✗ ${filename}: ${e.message}`);
    }
  }
}

main().catch(console.error);
