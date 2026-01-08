import morgan from "morgan";

// Custom token for response time in milliseconds
morgan.token("response-time-ms", (req, res) => {
  const responseTime = res.getHeader("X-Response-Time");
  return responseTime ? `${responseTime}ms` : "-";
});

// Custom token for request ID (if you want to add request tracking)
morgan.token("request-id", (req) => {
  return req.id || "-";
});

// Custom token for user info
morgan.token("user", (req) => {
  return req.user ? req.user.email : "anonymous";
});

// Development format - more detailed
export const developmentLogger = morgan((tokens, req, res) => {
  const status = tokens.status(req, res);
  const statusColor =
    status >= 500
      ? "\x1b[31m" // red
      : status >= 400
      ? "\x1b[33m" // yellow
      : status >= 300
      ? "\x1b[36m" // cyan
      : "\x1b[32m"; // green

  return [
    "\x1b[90m", // gray
    tokens.date(req, res, "iso"),
    "\x1b[0m", // reset
    statusColor,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "\x1b[0m", // reset
    tokens["response-time"](req, res),
    "ms",
    "\x1b[90m", // gray
    "-",
    tokens["user"](req, res),
    "\x1b[0m", // reset
  ].join(" ");
});

// Production format - JSON structured logging
export const productionLogger = morgan((tokens, req, res) => {
  return JSON.stringify({
    timestamp: tokens.date(req, res, "iso"),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: parseInt(tokens.status(req, res)),
    responseTime: parseFloat(tokens["response-time"](req, res)),
    contentLength: tokens.res(req, res, "content-length"),
    userAgent: tokens["user-agent"](req, res),
    user: tokens.user(req, res),
    ip: tokens["remote-addr"](req, res),
  });
});

// API-specific logger for debugging
export const apiLogger = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens["response-time"](req, res);

  // Only log API routes
  if (!url.startsWith("/api/")) {
    return null;
  }

  return `🔗 API ${method} ${url} → ${status} (${responseTime}ms)`;
});

// Error logger for failed requests
export const errorLogger = morgan((tokens, req, res) => {
  const status = parseInt(tokens.status(req, res));

  // Only log errors (4xx and 5xx)
  if (status < 400) {
    return null;
  }

  const errorType = status >= 500 ? "🚨 SERVER ERROR" : "⚠️  CLIENT ERROR";

  return [
    errorType,
    tokens.method(req, res),
    tokens.url(req, res),
    `→ ${status}`,
    `(${tokens["response-time"](req, res)}ms)`,
    `User: ${tokens.user(req, res)}`,
  ].join(" ");
});

// Request logger middleware that adds request timing
export const requestTimer = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    res.setHeader("X-Response-Time", duration);
  });

  next();
};

// Request ID middleware for tracking
export const requestId = (req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader("X-Request-ID", req.id);
  next();
};
