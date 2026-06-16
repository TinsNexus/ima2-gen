# ima2-gen

<p align="center">
  <img src="assets/logo.png" alt="ima2-gen logo" width="240">
</p>

[![npm version](https://img.shields.io/npm/v/ima2-gen)](https://www.npmjs.com/package/ima2-gen)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Read in other languages**: [한국어](docs/README.ko.md) · [日本語](docs/README.ja.md) · [简体中文](docs/README.zh-CN.md) · [Tiếng Việt](docs/README.vi.md)

`ima2-gen` is a local image generation studio for people who want the ChatGPT/Codex image workflow in a small desktop-like web app.

Install globally, sign in with ChatGPT OAuth or Grok OAuth, and start generating images and videos. Iterate with history, references, node branches, multimode batches, Canvas Mode cleanup, and Grok Video generation. No API key required — free ChatGPT OAuth and SuperGrok subscription cover everything.

## Features

- **Classic mode**: generate, edit, reuse the current image, paste references, and continue from history.
- **Node mode**: branch a good image into multiple directions without losing the original.
- **Multimode batches**: launch several Classic outputs from one prompt, watch slot-by-slot progress, and continue from the best result.
- **Video generation**: create short videos from text, a single image, or multiple reference images via Grok video models. SSE streaming shows planning → submitted → progress % → done.
- **Storyboard mode**: maintain character and scene continuity across sequential frames for video production.
- **Canvas Mode**: zoom, pan, annotate, erase, clean backgrounds, keep transparent previews, and export alpha or matte-backed versions.
- **Local gallery**: session-aware history with generation time and reasoning effort metadata.
- **Reference images**: drag, drop, paste, up to 5 references (images) or up to 7 (video); large images are compressed before upload.
- **Prompt library imports**: import local prompt packs, GitHub folders, and curated GPT-image prompt hints.
- **Mobile shell**: app bar, compose sheet, and compact settings on smaller screens.
- **Observable jobs**: active and recent jobs tracked with safe logs and request IDs.
- **SSE Multiplexing**: single `GET /api/events` channel eliminates browser 6-connection limits during concurrent generation.

## Quick Start

```bash
npm install -g ima2-gen
ima2 setup
ima2 serve
```

Then open `http://localhost:3333`.

To generate a video from the CLI:

```bash
ima2 video "a cat playing piano" --duration 5 --resolution 720p
ima2 video "animate this scene" --ref photo.png --duration 10
```

If `3333` is already occupied, `ima2-gen` binds the next available port and writes the actual URL to `~/.ima2/server.json`. Use `ima2 open` or the URL printed in the terminal instead of assuming the port.

### One-Click Install (no npm required)

**macOS:**
```bash
curl -fsSL https://lidge-jun.github.io/ima2-gen/install-mac.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://lidge-jun.github.io/ima2-gen/install-windows.ps1 | iex
```

**Linux / WSL:**
```bash
curl -fsSL https://lidge-jun.github.io/ima2-gen/install-linux.sh | bash
```

Each script checks for nvm/fnm/brew/winget, installs Node LTS through the best available method, and handles stale process cleanup automatically.

### Using npx

```bash
npx ima2-gen serve
```

See [docs/NPX_QUICKSTART.md](docs/NPX_QUICKSTART.md) for the full `npx` workflow.

## Step-by-Step Installation

### Prerequisites

- **Node.js >= 20** (LTS recommended)
- **npm** (comes with Node.js)
- A **ChatGPT account** (for GPT OAuth) or **xAI/Grok account** (for Grok OAuth)

### Install

```bash
npm install -g ima2-gen
```

### Authenticate

```bash
ima2 setup
```

This offers four choices:

1. **GPT OAuth** — login with ChatGPT account (free, images only)
2. **Grok OAuth** — login with xAI/Grok account (images + video)
3. **Both** — GPT OAuth + Grok OAuth (full feature access)
4. **Web setup** — configure everything in the web UI

Video generation requires Grok OAuth (option 2 or 3). Run `ima2 grok login` separately if you already have GPT OAuth configured and want to add video support.

### Start the Server

```bash
ima2 serve
```

### Verify

```bash
ima2 status
ima2 ping
```

### Update

```bash
npm install -g ima2-gen@latest
```

Ctrl+C performs a clean shutdown — closing the database, stopping child processes, and releasing file locks.

## Configuration

Config priority:

```text
environment variables > ~/.ima2/config.json > built-in defaults
```

### Environment Variables

| Variable | Default | Description |
|---|---:|---|
| `IMA2_PORT` / `PORT` | `3333` | Web server port |
| `IMA2_HOST` | `127.0.0.1` | Web server bind host |
| `IMA2_OAUTH_PROXY_PORT` / `OAUTH_PORT` | `10531` | OAuth proxy port |
| `IMA2_SERVER` | — | CLI target override |
| `IMA2_CONFIG_DIR` | `~/.ima2` | Config and SQLite location |
| `IMA2_ADVERTISE_FILE` | `~/.ima2/server.json` | Runtime discovery file |
| `IMA2_GENERATED_DIR` | `~/.ima2/generated` | Generated image directory |
| `IMA2_IMAGE_MODEL_DEFAULT` | `gpt-5.4-mini` | Server fallback image model |
| `IMA2_REASONING_EFFORT` | `medium` | Default reasoning effort for GPT OAuth path (`none`, `low`, `medium`, `high`, `xhigh`) |
| `IMA2_NO_OAUTH_PROXY` | — | Set `1` to disable auto-started OAuth proxy |
| `IMA2_LOG_LEVEL` | `info` | Log level: `debug`, `info`, `warn`, `error`, `silent` |
| `IMA2_INFLIGHT_TERMINAL_TTL_MS` | `300000` | Recent terminal job retention for debug views |
| `IMA2_MAX_PARALLEL` | `24` | Max concurrent generation jobs |
| `OPENAI_API_KEY` | — | API key for `provider: "api"` Responses API path |
| `IMA2_API_IMAGE_MODEL_DEFAULT` | `gpt-5.4-mini` | Default image model for `provider: "api"` |
| `IMA2_API_REASONING_EFFORT` | `low` | Default reasoning effort for `provider: "api"` |
| `IMA2_API_IMAGE_SIZE` | `1024x1024` | Default size for `provider: "api"` |
| `IMA2_API_ALLOW_WEB_SEARCH` | `true` | Toggle web search for `provider: "api"` |
| `IMA2_GROK_PROXY_HOST` | `127.0.0.1` | Host for bundled progrok proxy |
| `IMA2_GROK_PROXY_PORT` | `18645` | Port for bundled progrok proxy |
| `IMA2_NO_GROK_PROXY` | — | Set `1` to disable automatic progrok startup |
| `IMA2_GROK_PLANNER_MODEL` | `grok-4.3` | Grok search/planner model |
| `IMA2_GROK_PLANNER_TIMEOUT_MS` | `60000` | Timeout for Grok search and planner calls |
| `IMA2_GROK_IMAGE_MODEL_DEFAULT` | `grok-imagine-image` | Default final Grok image model |
| `IMA2_GROK_GENERATION_TIMEOUT_MS` | `120000` | Timeout for Grok Images API call |
| `GEMINI_API_KEY` | — | API key for `provider: "gemini-api"` direct Generative Language API path |
| `VERTEX_SERVICE_ACCOUNT_JSON` | — | Google service account JSON for Vertex AI auth |

### Config File

The config file is at `~/.ima2/config.json`. Editable keys:

```
imageModels.default          imageModels.reasoningEffort
apiProvider.defaultImageModel apiProvider.defaultReasoningEffort
grokProvider.plannerModel     grokProvider.plannerTimeoutMs
grokProvider.defaultImageModel
log.level                    features.cardNews
storage.generatedDir         server.port
server.host                  server.bodyLimit
oauth.proxyPort              limits.maxRefCount
limits.maxGeneratedImages    limits.maxParallel
```

Manage from CLI:

```bash
ima2 config ls --effective        # show merged effective config
ima2 config get log.level          # read a specific key
ima2 config set imageModels.reasoningEffort high
ima2 config keys --json            # list all writable keys
```

### Logging Modes

- **Normal**: `ima2 serve` — quiet by default (startup URLs, warnings, errors visible)
- **Dev mode**: `ima2 serve --dev` or `npm run dev` — verbose diagnostics with request IDs, OAuth streams, node generation phases
- **Explicit**: `IMA2_LOG_LEVEL=debug ima2 serve`

## Provider Paths

| Provider | Auth Required | Features | Notes |
|---|---|---|---|
| `oauth` | ChatGPT OAuth | Images (generate, edit, multimode, node) | Default path, no API key needed |
| `api` | `OPENAI_API_KEY` | Images (generate, edit, multimode, node) | OpenAI Responses API |
| `grok` | Grok OAuth (progrok) | Images + Video | Mandatory xAI Web Search + `grok-4.3` planner |
| `grok-api` | `XAI_API_KEY` | Images + Video | Direct xAI API, same pipeline as `grok` |
| `agy` | Antigravity CLI login | Images only | Fixed 1024x1024 JPEG, max 3 refs |
| `gemini-api` | `GEMINI_API_KEY` or Vertex AI JSON | Images only | Models: `nano-banana-2`, `nano-banana-pro` |

### Model Guidance

- `gpt-5.4` — recommended balanced choice
- `gpt-5.4-mini` — current default, faster draft model
- `gpt-5.5` — strongest quality option (requires Codex CLI support)

## Workflows

### Classic Mode

1. Write a prompt.
2. Attach or paste references if needed.
3. Pick model, quality, size, format, and moderation.
4. Generate one image, or enable multimode for multiple candidates.
5. Copy, download, continue from the result, or send to Canvas Mode.

See [Prompt Studio manual](docs/PROMPT_STUDIO.md) for detailed controls.

### Node Mode

Each node keeps its own prompt and result. Root nodes attach local references; child nodes use the parent image as source. Completed jobs are matched back to nodes by request ID.

### Canvas Mode

Zoom, pan, annotate, erase, multiselect, group, undo/redo, and sticky notes. Detect transparent images, preview checkerboard, and export with preserved alpha or matte color.

### Video Generation

Three modes auto-detected from reference count:
- **Text-to-video** (0 refs): 1–15s
- **Image-to-video** (1 ref): 1–15s
- **Reference-to-video** (2–7 refs): 1–10s

SSE events: `planning` → `submitted` → `progress` → `done` or `error`.

### Prompt Library

Import from local files, GitHub folders, curated sources, and GPT-image hint packs. Imported prompts are indexed locally.

## API Reference

The full endpoint list is at [docs/API.md](docs/API.md). Key endpoints:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server health, version |
| `GET` | `/api/providers` | Provider availability |
| `POST` | `/api/generate` | Text-to-image generation |
| `POST` | `/api/edit` | Image edit |
| `POST` | `/api/generate/multimode` | Multi-image SSE generation |
| `POST` | `/api/node/generate` | Node-mode generation |
| `POST` | `/api/video/generate` | Video generation (SSE) |
| `GET` | `/api/events` | SSE multiplex channel |
| `GET` | `/api/history` | List generated assets |
| `GET` | `/api/inflight` | Active jobs |
| `GET` | `/api/quota` | Provider quota/billing |

### Async Generation

All generation endpoints support `async: true` mode:

```json
{
  "async": true,
  "requestId": "req_xxx",
  "...": "other route fields"
}
```

Returns `202 { requestId }` immediately. Progress events arrive on `GET /api/events`.

## CLI Commands

### Server

| Command | Description |
|---|---|
| `ima2 serve [--dev]` | Start the local web server |
| `ima2 setup` | Reconfigure saved auth |
| `ima2 status` | Show config and OAuth status |
| `ima2 doctor` | Diagnose Node, package, config, and auth |
| `ima2 open` | Open the web UI |
| `ima2 reset` | Remove saved config |

### Client

| Command | Description |
|---|---|
| `ima2 gen <prompt>` | Generate from the CLI |
| `ima2 edit <file> --prompt <text>` | Edit an existing image |
| `ima2 multimode <prompt>` | Multi-image SSE generation |
| `ima2 video <prompt>` | Video generation via Grok |
| `ima2 ls [--session <id>] [--favorites]` | List recent history |
| `ima2 show <name> [--metadata]` | Reveal a generated asset |
| `ima2 prompt ls -q <search>` | Search the prompt library |
| `ima2 inflight ls [--terminal]` | List active jobs |
| `ima2 config set <key> <value>` | Write to config |
| `ima2 ping` | Health-check the running server |

Full reference: [docs/CLI.md](docs/CLI.md).

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 make g++ ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g ima2-gen

ENV IMA2_HOST=0.0.0.0
ENV IMA2_PORT=3333

EXPOSE 3333

CMD ["ima2", "serve"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  ima2:
    build: .
    ports:
      - "3333:3333"
    volumes:
      - ima2-data:/root/.ima2
    environment:
      - IMA2_HOST=0.0.0.0
      - IMA2_PORT=3333
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped

volumes:
  ima2-data:
```

### Run

```bash
docker compose up -d
# or
docker build -t ima2-gen .
docker run -p 3333:3333 -v ima2-data:/root/.ima2 ima2-gen
```

### Notes

- Mount `~/.ima2` as a volume to persist generated images and config across container restarts.
- Set `IMA2_HOST=0.0.0.0` so the server is accessible from outside the container.
- For OAuth authentication, complete `ima2 setup` before starting the container, or mount the existing `~/.ima2` directory.
- The bundled Grok proxy (progrok) runs inside the container on `127.0.0.1:18645` by default.

## Integration with CreatorHub

ima2-gen can be integrated into CreatorHub as an image/video generation backend.

### API Integration

```bash
# Generate an image via API
curl -X POST http://localhost:3333/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a futuristic city skyline", "provider": "oauth", "model": "gpt-5.4"}'

# Generate a video via API
curl -X POST http://localhost:3333/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "camera pans across the city", "provider": "grok", "duration": 5}'

# Check health
curl http://localhost:3333/api/health
```

### SSE Event Streaming

Connect to `GET /api/events` for real-time generation progress:

```javascript
const events = new EventSource("http://localhost:3333/api/events");

events.addEventListener("phase", (e) => {
  const data = JSON.parse(e.data);
  console.log(`Job ${data.jobId}: ${data.phase}`);
});

events.addEventListener("done", (e) => {
  const data = JSON.parse(e.data);
  console.log(`Complete: ${data.filename}`);
});
```

### ComfyUI Bridge

ima2-gen includes a ComfyUI bridge at `integrations/comfyui/`. See `integrations/comfyui/ima2_gen_bridge/README.md` for setup.

## Troubleshooting

**`ima2 ping` says the server is unreachable**
Start `ima2 serve`, then check `~/.ima2/server.json`. You can also run `ima2 ping --server http://localhost:3333`.

**GPT OAuth login does not work**
Re-run `ima2 setup` (option 1), confirm `ima2 status`, then restart `ima2 serve`.

**`fetch failed` repeats on a proxy/VPN network**
Check that the local OAuth proxy is reachable. On networks that require a proxy, enable your proxy client's TUN/TURN-style mode, then retry `openai-oauth --port 10531`. If it still fails, set `HTTP_PROXY` and `HTTPS_PROXY` in the same terminal that runs `ima2 serve`. On Windows, check for auto-start network interception tools (including DNS/fragmentation bypass tools such as SecretDNS).

**Images fail with `API_KEY_REQUIRED`**
Set `OPENAI_API_KEY` or configure an API key before using `provider: "api"`. The default GPT OAuth path still works without an API key.

**Image generation returns `EMPTY_RESPONSE` or no image data**
Run `ima2 doctor image-probe --json > ima2-image-probe.json` and attach the safe JSON when opening an issue. For GPT OAuth cases, also capture:
```bash
ima2 gen "고양이" --no-web-search --json > ima2-cat-no-search.json
ima2 gen "고양이" --json > ima2-cat-current.json
```
Do not share ChatGPT cookies, OAuth token files, API keys, raw upstream responses, prompt history, or generated base64.

**A large reference image fails**
The app compresses large JPEG/PNG references before upload. Convert HEIC/HEIF files to JPEG or PNG before attaching.

**Old gallery images are missing after updating**
Run `ima2 doctor` and see [Recover old images](docs/RECOVER_OLD_IMAGES.md).

**`gpt-5.5` fails but other models work**
Update Codex CLI first, then retry. Use `gpt-5.4` as the stable fallback.

**The app opened on a different port**
If port `3333` is busy, `ima2-gen` falls back to the next available port. Check `~/.ima2/server.json`. Override with `IMA2_PORT=3333 ima2 serve`.

**Port `10531` is already used on Windows**
Some Windows security tools occupy the default OAuth proxy port. Override with `IMA2_OAUTH_PROXY_PORT=11531 ima2 serve`.

For more answers, see [docs/FAQ.md](docs/FAQ.md).

## Development

```bash
git clone https://github.com/lidge-jun/ima2-gen.git
cd ima2-gen
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

`npm run dev` builds the UI and starts the TypeScript server entry with `--watch` and verbose diagnostics.

## Contributors

- [@lidge-jun](https://github.com/lidge-jun) — maintainer
- [@ree9622](https://github.com/ree9622) — moderation controls, Windows fixes, structured logging
- [@Charley-Peng](https://github.com/Charley-Peng) — API cache fix (#74)
- [@philiptaron](https://github.com/philiptaron) — Nix flake (#81)
- [@aorying](https://github.com/aorying) — upstream validation error surfacing
- [@PARKJONGMlN](https://github.com/PARKJONGMlN) — batch comparison matrix design (#80)

## License

MIT
