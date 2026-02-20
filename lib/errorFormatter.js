/**
 * Error Formatter - Sanitizes and safely formats error messages for user-facing responses
 * Prevents leaking sensitive code, stack traces, and API details
 */

/**
 * Sanitize an error message for user display
 * Removes stack traces, file paths, code snippets, and sensitive details
 */
function sanitizeError(error) {
  if (!error) return 'An unknown error occurred.';
  
  let message = error.message || String(error);
  
  // Remove file paths (e.g., /home/user/project/file.js:123)
  message = message.replace(/[\/\\][\w\-\.\/\\]+\.(js|ts|json|py|rb|java):\d+/gi, '[code]');
  
  // Remove full file paths
  message = message.replace(/[\/\\](?:home|root|tmp|var|opt|usr)[\w\-\.\/\\]*/gi, '[path]');
  
  // Remove stack traces starting with "at "
  message = message.replace(/\s*at\s+[\w\.]+\s*\([^\)]+\)/g, '');
  
  // Remove long URLs that might contain API keys
  message = message.replace(/https?:\/\/[^\s]+?(api|key|token|secret)[^\s]*/gi, '[secure-url]');
  
  // Remove error codes that might reveal system internals
  message = message.replace(/ENOSPC|ENOENT|EACCES|EISDIR|EEXIST|EPERM/g, '[system-error]');
  
  // Truncate very long messages (>200 chars)
  if (message.length > 200) {
    message = message.substring(0, 197) + '...';
  }
  
  return message.trim();
}

/**
 * Convert any error to a safe user-facing message
 */
function getUserFriendlyMessage(error, context = '') {
  const sanitized = sanitizeError(error);
  
  const defaultMessage = context 
    ? `❌ An error occurred while ${context}. Please try again later.`
    : '❌ An error occurred. Please try again later.';
  
  // If sanitized message is generic, return default
  if (sanitized.toLowerCase().includes('unknown') || !sanitized) {
    return defaultMessage;
  }
  
  // Return sanitized message
  return `❌ ${sanitized}`;
}

/**
 * Safe error logging for console (can include stack)
 */
function logError(context, error) {
  console.error(`[${context}]`, error);
}

module.exports = {
  sanitizeError,
  getUserFriendlyMessage,
  logError
};
