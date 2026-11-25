# post-x-promote-myb — agent notes

Entry for make.fun bounty `post-x-promote-make-your-own-bounty-01` ($250 USDC, top 50 share it, deadline Fri 27 Nov 2026 01:35 WIB).

## What the entry is

One public X post from @kaylanihh:
1. Quote make.fun's post https://x.com/makefunai/status/2124915864336236646 (Repost → Quote), or link to it in a new post.
2. Attach the photo `assets/post-image.png`.
3. Paste `POST_TEXT.txt` as the text — it carries the play code `makefun-pouch-cub-cattail`, `@makefunai`, and the link https://make.fun/sponsor/new.
4. Keep the post and the account public until the results are out (result due 11 Dec 2026).

## What this repo holds

- `main.ts` — validator written from scratch for this entry (Node 22, stdlib only). Checks POST.json's address shape, the play code, the make.fun / @makefunai mention, the sponsor link, the 280-character limit, and that the photo exists. Writes `validation.json` + a copy of `POST.json` to the output dir.
- `POST.json` — the published post's address. Placeholder until the post is up; replace it with the real `https://x.com/kaylanihh/status/<id>` (Share → Copy link) before submitting.
- `POST_TEXT.txt` — the exact text to publish. Do not edit after posting: X posts cannot be edited, only deleted and reposted.
- `assets/post-image.png` — the photo attached to the post.

## Scoring

Replies + reposts + quotes. Views and likes move nothing. Bought, botted, or self-made engagement disqualifies.
