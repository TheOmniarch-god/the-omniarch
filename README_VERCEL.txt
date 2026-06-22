VERCEL DEPLOYMENT — THE OMNIARCH

Domain:
- theomniarch.com.ng

Project type:
- Static site
- No build command required
- Root directory: project root
- Output directory: leave empty / default

OPTION A — Vercel Dashboard Upload / Git Import
1. Go to https://vercel.com/new
2. Import a GitHub repository OR upload this folder if using the dashboard workflow.
3. Framework Preset: Other
4. Build Command: leave empty
5. Output Directory: leave empty
6. Deploy.
7. After deploy, go to Project > Settings > Domains.
8. Add:
   theomniarch.com.ng
   www.theomniarch.com.ng  (optional but recommended)

DNS RECORDS FOR VERCEL
At your domain registrar/DNS manager:

Root/apex domain:
A     @      76.76.21.21

WWW:
CNAME www    cname.vercel-dns.com

If Vercel gives a different DNS instruction in the dashboard, follow Vercel's instruction.

REN ZU SUBDOMAIN
Your main site links to:
https://thelegendsofrenzu.theomniarch.com.ng

That subdomain must point to wherever the Ren Zu app is hosted.
If Ren Zu is also on Vercel:
CNAME thelegendsofrenzu    cname.vercel-dns.com

Then add thelegendsofrenzu.theomniarch.com.ng inside that Ren Zu Vercel project domains.

CLI DEPLOY OPTION
If you have Vercel CLI:
1. cd omniarch-live
2. vercel login
3. vercel --prod

Do not share passwords or tokens in chat.
