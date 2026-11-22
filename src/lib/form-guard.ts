/**
 * form-guard.ts — lightweight anti-abuse for the public forms.
 *
 * The site is a static export with no server, so real Turnstile/CAPTCHA
 * verification is impossible here: Turnstile needs a server-side check of
 * the token against Cloudflare, and there is no API route to do it in
 * (that needs the OpenNext/Workers migration). Until then, the honest
 * defences available client-side are:
 *
 * 1. Honeypot — a field humans never see and never fill. Bots that
 *    autofill every input reveal themselves. Flagged submissions are
 *    silently "accepted" (fake success, nothing written) so bots can't
 *    tell they were caught.
 * 2. Throttle — one submission per form per 60s per browser, enforced
 *    via localStorage. Stops naive double-submit / replay floods and
 *    shows an honest error to a real user who taps twice.
 *
 * This does NOT stop a determined attacker with the anon key — nothing
 * client-side can. The real fix is server-side validation after the
 * OpenNext migration (Turnstile) and/or Supabase RLS tightening.
 */

/** True when the honeypot field was filled — i.e. almost certainly a bot. */
export function isHoneypotFilled(value: string): boolean {
  return value.trim().length > 0;
}

const THROTTLE_MS = 60_000;

/**
 * Returns true when this browser may submit this form now, and records the
 * attempt. Returns false when the last submission was too recent.
 * localStorage failures (private mode etc.) fail open — never block a user.
 */
export function checkThrottle(formKey: string): boolean {
  try {
    const key = `ow_submit_${formKey}`;
    const last = Number(window.localStorage.getItem(key) || 0);
    const now = Date.now();
    if (now - last < THROTTLE_MS) return false;
    window.localStorage.setItem(key, String(now));
    return true;
  } catch {
    return true;
  }
}
