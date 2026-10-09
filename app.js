const http = require("http");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT) || 3000;

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload, null, 2));
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && pathname === "/") {
    return sendJson(res, 200, {
      message: "Hello from Docker + GitHub Actions 🚀",
      routes: ["/", "/health"],
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "GET" && pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method === "POST" && pathname === "/echo") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        return sendJson(res, 200, {
          received: parsed,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return sendJson(res, 400, {
          error: "Invalid JSON payload",
          details: error.message,
        });
      }
    });

    return;
  }

  return sendJson(res, 404, {
    error: "Not found",
    path: pathname,
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});