# Facebook Sharing Debugger 403 on Vercel

If [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) shows **403** for `https://cashlight.in/` but `curl -A "facebookexternalhit/1.1" https://cashlight.in/` returns **200**, the app and `robots.txt` are fine. **Vercel edge DDoS mitigation** is blocking Meta’s datacenter IPs before the request reaches Next.js.

This is a [known Vercel + Meta issue](https://community.vercel.com/t/facebook-sharing-debugger-returns-403-meta-crawler-blocked-by-vercel-ddos-mitigation/41737). The debugger message *“could be due to a robots.txt block”* is misleading.

## Verify (local)

```bash
curl -s "https://cashlight.in/robots.txt"
curl -sI -A "facebookexternalhit/1.1" "https://cashlight.in/"
curl -sI "https://cashlight.in/api/og"
```

Expect: `Allow: /` for `facebookexternalhit`, homepage **200**, OG image **200** `image/png`.

## Fix on Vercel (dashboard)

1. **Project → Firewall → Overview**  
   Click **Scrape Again** in Facebook Debugger, then refresh Firewall. Look for **Challenged** or **Denied** events at the same time.

2. **Deployment Protection**  
   **Settings → Deployment Protection**  
   Ensure production **cashlight.in** is not behind Vercel Authentication (previews only).

3. **Pro / Enterprise — custom or system bypass**  
   **Firewall → Configure**  
   Add a rule that **Bypasses** (not just “Log”) when:
   - User-Agent contains `facebookexternalhit`, `Facebot`, `meta-externalfetcher`, or  
   - IP is in Meta’s ranges (AS32934), if using System Bypass Rules.

   Note: On some plans, **automatic DDoS mitigation runs before** custom rules, so a UA-only rule may not be enough. Use **System Bypass** for Meta CIDRs or contact Vercel support.

4. **Hobby plan**  
   Custom bypass may not run before system DDoS rules. Open a [Vercel support ticket](https://vercel.com/help) and ask to allow **facebookexternalhit / Meta crawler IPs** for project **cashlight** on **cashlight.in**.

   Include:
   - Domain: `https://cashlight.in/`
   - Symptom: Sharing Debugger 403, curl with same UA returns 200
   - Firewall log screenshot showing DDoS challenge on scrape

## Workarounds to test

- Share `https://cashlight.in/` in a **Facebook post or WhatsApp** — previews sometimes work when the Debugger does not.
- Try `https://www.cashlight.in/` if you add a `www` alias.
- **Scrape Again** several times in the Debugger (cache can show old errors).

## App-side (already done)

- `robots.txt`: explicit `Allow: /` for Meta/social crawlers
- `og:image`: `https://cashlight.in/api/og` (200 PNG, no redirect)
- `NEXT_PUBLIC_SITE_URL=https://cashlight.in` in **Production** env

No further Next.js changes fix edge-level 403; resolution is Vercel firewall / support.
