/**
 * Wrap any fetch‑call with automatic silent token refresh.
 *
 * @param {() => Promise<Response>} call     – the request you want to run
 * @param {() => Promise<Response>} refresh  – hits /auth/refresh to renew cookies
 * @returns {Promise<Response>}              – the original or the retried response
 */
export default async function withTokenRefresh(call, refresh) {
    let res = await call();
    if (res.status !== 401) return res;     // access‑token still valid
  
    // One‑shot silent refresh
    const r = await refresh();
    if (!r.ok) return res;                  // refresh failed – propagate 401
  
    return await call();                    // retry original request
  }
  