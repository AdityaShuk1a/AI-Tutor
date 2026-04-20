/**
 * Custom Logger Middleware
 * Logs the request method, URL, status code, and how long it took.
 */
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req; 
    const { statusCode } = res;

    const statusColor = statusCode >= 400 ? '❌' : '✅';

    console.log(
      `${statusColor} [${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} (${duration}ms)`
    );
  });

  next(); 
};

export default logger;