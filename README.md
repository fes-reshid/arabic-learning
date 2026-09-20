# Hikaya

Hikaya is a colorful, child-friendly Arabic reading adventure. The learning map moves through six themed lands, from recognising letters to becoming a confident story reader.

## Run locally

No build step is required. Serve the project with any static file server:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Production deployment

The production workflow publishes the static site to
[`https://diinislaam.com/hikaya/`](https://diinislaam.com/hikaya/) whenever a
change reaches `main`. It can also be started manually from the Actions tab.

Create a protected GitHub environment named `production`, then configure these
repository secrets:

| Name | Purpose |
| --- | --- |
| `DEPLOY_HOST` | SSH host for `diinislaam.com` |
| `DEPLOY_USER` | SSH user with access to the website document root |
| `DEPLOY_SSH_KEY` | Private Ed25519 deployment key |
| `SSH_KNOWN_HOSTS` | Trusted host-key line for the production server |
| `DEPLOY_PORT` | Optional SSH port; defaults to `22` |

If the site's document root differs from the default, set the repository
variable `DEPLOY_PATH`. Its default is
`/var/www/diinislaam.com/html/hikaya`. The workflow uploads only the four public
site files and removes obsolete files from that directory.

## Features

- Six-stage Arabic literacy journey
- Responsive desktop and mobile layouts
- Interactive current lesson and letter pronunciation
- Locked-stage and completion feedback
- Weekly goal, streak, stars, and reward UI
