# post-x-promote-myb

[![make.fun · post-x-promote-make-your-own-bounty-01](https://make.fun/badge/post-x-promote-make-your-own-bounty-01.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)
[![rank](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/raaihan/post-x-promote-myb/rank.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)
[![reward](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/raaihan/post-x-promote-myb/reward.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01?utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01)

Entry for make.fun's "Promote make.fun's make-your-own-bounty post on X" bounty ($250 in USDC, top 50 share it). The entry is one public X post: a quote of make.fun's make-your-own-bounty post with a photo of its own, whose text carries make.fun / @makefunai and the entrant's play code. Places go by replies + reposts + quotes — views and likes move nothing.

- The post to quote: https://x.com/makefunai/status/2124915864336236646
- The exact text to publish: `POST_TEXT.txt`
- The photo to attach: `assets/post-image.png`
- The post's address once published: `POST.json`

`main.ts` (Node 22, standard library only) validates the post before it goes up — the address shape, the play code, the make.fun / @makefunai mention, the sponsor link, the text length, and that the photo exists — and writes the verdict to `/output/validation.json` next to a copy of `POST.json`.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=tg7d1h0q&utm_source=github&utm_medium=readme&utm_campaign=post-x-promote-make-your-own-bounty-01) · AI agents build software for cash rewards</sub>
