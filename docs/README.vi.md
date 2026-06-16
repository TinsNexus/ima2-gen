# ima2-gen

<p align="center">
  <img src="../assets/logo.png" alt="ima2-gen logo" width="240">
</p>

[![npm version](https://img.shields.io/npm/v/ima2-gen)](https://www.npmjs.com/package/ima2-gen)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../LICENSE)

> **Đọc bằng ngôn ngữ khác**: [English](../README.md) · [한국어](README.ko.md) · [日本語](README.ja.md) · [简体中文](README.zh-CN.md)

`ima2-gen` là ứng dụng tạo ảnh cục bộ dành cho những ai muốn trải nghiệm quy trình tạo ảnh ChatGPT/Codex trên ứng dụng web giống desktop.

Cài toàn cục, đăng nhập bằng ChatGPT OAuth hoặc Grok OAuth, và bắt đầu tạo ảnh và video. Tối ưu với lịch sử, ảnh tham chiếu, nhánh node, lô multimode, Canvas Mode để chỉnh sửa, và tạo video Grok. Không cần API key — ChatGPT OAuth miễn phí và gói SuperGrok subscription bao gồm tất cả.

## Tính năng

- **Classic mode**: tạo, chỉnh sửa, tái sử dụng ảnh hiện tại, dán ảnh tham chiếu, và tiếp tục từ lịch sử.
- **Node mode**: phân nhánh một ảnh tốt thành nhiều hướng mà không mất ảnh gốc.
- **Multimode batches**: khởi tạo nhiều kết quả Classic từ một prompt, theo dõi tiến trình từng slot, và tiếp tục từ kết quả tốt nhất.
- **Tạo video**: tạo video ngắn từ văn bản, một ảnh, hoặc nhiều ảnh tham chiếu qua mô hình video Grok. SSE streaming hiển thị lập kế hoạch → đã gửi → tiến trình % → hoàn thành.
- **Storyboard mode**: duy trì sự liên tục nhân vật và cảnh qua các frame liên tiếp cho sản xuất video.
- **Canvas Mode**: zoom, pan, đánh dấu, xóa, làm sạch nền, xem trước trong suốt, và xuất phiên bản alpha hoặc matte-backed.
- **Gallery cục bộ**: lịch sử theo session với metadata thời gian tạo và nỗ lực suy luận.
- **Ảnh tham chiếu**: kéo, thả, dán, tối đa 5 ảnh tham chiếu (ảnh) hoặc 7 ảnh (video); ảnh lớn được nén trước khi tải lên.
- **Thư viện prompt**: import pack prompt cục bộ, thư mục GitHub, và gợi ý prompt GPT-image.
- **Di động**: app bar, compose sheet, và toggle cài đặt trên màn hình nhỏ.
- **Observable jobs**: job đang hoạt động và gần đây được theo dõi với log an toàn và request IDs.
- **SSE Multiplexing**: kênh `GET /api.events` duy nhất loại bỏ giới hạn kết nối 6 của trình duyệt khi tạo đồng thời.

## Bắt đầu nhanh

```bash
npm install -g ima2-gen
ima2 setup
ima2 serve
```

Sau đó mở `http://localhost:3333`.

Để tạo video từ CLI:

```bash
ima2 video "mèo chơi đàn piano" --duration 5 --resolution 720p
ima2 video "animate this scene" --ref photo.png --duration 10
```

Nếu `3333` đã bị chiếm, `ima2-gen` sẽ tự động chọn port tiếp theo và ghi URL thực tế vào `~/.ima2/server.json`. Sử dụng `ima2 open` hoặc URL hiển thị trên terminal thay vì giả định port.

### Cài đặt bằng một cú nhấp (không cần npm)

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

Mỗi script sẽ kiểm tra nvm/fnm/brew/winget, cài Node LTS qua phương pháp khả dụng tốt nhất, và tự động xử lý dọn dẹp tiến trình cũ.

### Sử dụng npx

```bash
npx ima2-gen serve
```

Xem [docs/NPX_QUICKSTART.md](NPX_QUICKSTART.md) cho quy trình `npx` đầy đủ.

## Hướng dẫn cài đặt từng bước

### Yêu cầu

- **Node.js >= 20** (khuyến nghị LTS)
- **npm** (đi kèm Node.js)
- **Tài khoản ChatGPT** (cho GPT OAuth) hoặc **tài khoản xAI/Grok** (cho Grok OAuth)

### Cài đặt

```bash
npm install -g ima2-gen
```

### Xác thực

```bash
ima2 setup
```

Bốn lựa chọn:

1. **GPT OAuth** — đăng nhập bằng tài khoản ChatGPT (miễn phí, chỉ tạo ảnh)
2. **Grok OAuth** — đăng nhập bằng tài khoản xAI/Grok (ảnh + video)
3. **Cả hai** — GPT OAuth + Grok OAuth (truy cập đầy đủ tính năng)
4. **Thiết lập Web** — cấu hình mọi thứ trong giao diện web

Tạo video yêu cầu Grok OAuth (lựa chọn 2 hoặc 3). Chạy `ima2 grok login` riêng nếu bạn đã có GPT OAuth và muốn thêm hỗ trợ video.

### Khởi chạy Server

```bash
ima2 serve
```

### Xác minh

```bash
ima2 status
ima2 ping
```

### Cập nhật

```bash
npm install -g ima2-gen@latest
```

Ctrl+C thực hiện tắt sạch — đóng database, dừng tiến trình con, và giải phóng khóa tệp.

## Cấu hình

Ưu tiên cấu hình:

```text
biến môi trường > ~/.ima2/config.json > giá trị mặc định
```

### Biến môi trường

| Biến | Mặc định | Mô tả |
|---|---:|---|
| `IMA2_PORT` / `PORT` | `3333` | Port web server |
| `IMA2_HOST` | `127.0.0.1` | Host bind web server |
| `IMA2_OAUTH_PROXY_PORT` / `OAUTH_PORT` | `10531` | Port OAuth proxy |
| `IMA2_SERVER` | — | CLI target override |
| `IMA2_CONFIG_DIR` | `~/.ima2` | Vị trí config và SQLite |
| `IMA2_ADVERTISE_FILE` | `~/.ima2/server.json` | Runtime discovery file |
| `IMA2_GENERATED_DIR` | `~/.ima2/generated` | Thư mục ảnh đã tạo |
| `IMA2_IMAGE_MODEL_DEFAULT` | `gpt-5.4-mini` | Mô hình ảnh fallback |
| `IMA2_REASONING_EFFORT` | `medium` | Nỗ lực suy luận mặc định cho GPT OAuth (`none`, `low`, `medium`, `high`, `xhigh`) |
| `IMA2_NO_OAUTH_PROXY` | — | Đặt `1` để tắt OAuth proxy tự khởi động |
| `IMA2_LOG_LEVEL` | `info` | Mức log: `debug`, `info`, `warn`, `error`, `silent` |
| `IMA2_INFLIGHT_TERMINAL_TTL_MS` | `300000` | Thời gian giữ job terminal gần đây |
| `IMA2_MAX_PARALLEL` | `24` | Số job tạo đồng thời tối đa |
| `OPENAI_API_KEY` | — | API key cho `provider: "api"` Responses API |
| `IMA2_API_IMAGE_MODEL_DEFAULT` | `gpt-5.4-mini` | Mô hình mặc định cho `provider: "api"` |
| `IMA2_API_REASONING_EFFORT` | `low` | Nỗ lực suy luận mặc định cho `provider: "api"` |
| `IMA2_API_IMAGE_SIZE` | `1024x1024` | Kích thước mặc định cho `provider: "api"` |
| `IMA2_API_ALLOW_WEB_SEARCH` | `true` | Bật/tắt web search cho `provider: "api"` |
| `IMA2_GROK_PROXY_HOST` | `127.0.0.1` | Host cho progrok proxy tích hợp |
| `IMA2_GROK_PROXY_PORT` | `18645` | Port cho progrok proxy tích hợp |
| `IMA2_NO_GROK_PROXY` | — | Đặt `1` để tắt progrok tự khởi động |
| `IMA2_GROK_PLANNER_MODEL` | `grok-4.3` | Mô hình search/planner Grok |
| `IMA2_GROK_PLANNER_TIMEOUT_MS` | `60000` | Timeout cho search và planner Grok |
| `IMA2_GROK_IMAGE_MODEL_DEFAULT` | `grok-imagine-image` | Mô hình ảnh Grok mặc định |
| `IMA2_GROK_GENERATION_TIMEOUT_MS` | `120000` | Timeout cho Grok Images API |
| `GEMINI_API_KEY` | — | API key cho `provider: "gemini-api"` trực tiếp |
| `VERTEX_SERVICE_ACCOUNT_JSON` | — | JSON service account Google cho Vertex AI |

### File cấu hình

File cấu hình nằm tại `~/.ima2/config.json`. Các khóa có thể chỉnh sửa:

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

Quản lý từ CLI:

```bash
ima2 config ls --effective        # hiển thị config hiệu lực
ima2 config get log.level          # đọc một khóa cụ thể
ima2 config set imageModels.reasoningEffort high
ima2 config keys --json            # liệt kê tất cả khóa có thể ghi
```

### Chế độ Logging

- **Bình thường**: `ima2 serve` — yên lặng theo mặc định (URL khởi động, cảnh báo, lỗi hiển thị)
- **Chế độ dev**: `ima2 serve --dev` hoặc `npm run dev` — chi tiết nâng cao với request IDs, OAuth streams, node generation phases
- **Rõ ràng**: `IMA2_LOG_LEVEL=debug ima2 serve`

## Các nhà cung cấp

| Provider | Xác thực | Tính năng | Ghi chú |
|---|---|---|---|
| `oauth` | ChatGPT OAuth | Ảnh (tạo, chỉnh sửa, multimode, node) | Đường dẫn mặc định, không cần API key |
| `api` | `OPENAI_API_KEY` | Ảnh (tạo, chỉnh sửa, multimode, node) | OpenAI Responses API |
| `grok` | Grok OAuth (progrok) | Ảnh + Video | xAI Web Search bắt buộc + planner `grok-4.3` |
| `grok-api` | `XAI_API_KEY` | Ảnh + Video | xAI API trực tiếp, cùng pipeline với `grok` |
| `agy` | Antigravity CLI login | Chỉ ảnh | Cố định 1024x1024 JPEG, tối đa 3 refs |
| `gemini-api` | `GEMINI_API_KEY` hoặc Vertex AI JSON | Chỉ ảnh | Mô hình: `nano-banana-2`, `nano-banana-pro` |

### Hướng dẫn mô hình

- `gpt-5.4` — lựa chọn cân bằng được khuyến nghị
- `gpt-5.4-mini` — mô hình mặc định hiện tại, draft nhanh hơn
- `gpt-5.5` — tùy chọn chất lượng mạnh nhất (yêu cầu Codex CLI hỗ trợ)

## Quy trình làm việc

### Classic Mode

1. Viết prompt.
2. Đính kèm hoặc dán ảnh tham chiếu nếu cần.
3. Chọn mô hình, chất lượng, kích thước, định dạng, và kiểm duyệt.
4. Tạo một ảnh, hoặc bật multimode để tạo nhiều ứng viên.
5. Sao chép, tải xuống, tiếp tục từ kết quả, hoặc gửi vào Canvas Mode.

Xem [hướng dẫn Prompt Studio](PROMPT_STUDIO.md) cho các điều khiển chi tiết.

### Node Mode

Mỗi node giữ prompt và kết quả riêng. Node gốc có thể đính kèm ảnh tham chiếu cục bộ; node con sử dụng ảnh cha làm nguồn. Job hoàn thành được ghép nối lại với node qua request ID.

### Canvas Mode

Zoom, pan, đánh dấu, xóa, multiselect, grouping, undo/redo, và sticky notes. Phát hiện ảnh trong suốt, xem trước checkerboard, và xuất với alpha được bảo trì hoặc màu matte.

### Tạo Video

Ba chế độ tự động phát hiện từ số lượng ảnh tham chiếu:
- **Text-to-video** (0 refs): 1–15s
- **Image-to-video** (1 ref): 1–15s
- **Reference-to-video** (2–7 refs): 1–10s

SSE events: `planning` → `submitted` → `progress` → `done` hoặc `error`.

### Thư viện Prompt

Import từ tệp cục bộ, thư mục GitHub, nguồn đã tuyển chọn, và gói gợi ý prompt GPT-image. Prompt đã import được lập chỉ mục cục bộ.

## Tham khảo API

Danh sách endpoint đầy đủ tại [docs/API.md](API.md). Các endpoint chính:

| Phương thức | Đường dẫn | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Sức khỏe server, phiên bản |
| `GET` | `/api/providers` | Tình trạng nhà cung cấp |
| `POST` | `/api/generate` | Tạo ảnh từ văn bản |
| `POST` | `/api/edit` | Chỉnh sửa ảnh |
| `POST` | `/api/generate/multimode` | Tạo multi-image SSE |
| `POST` | `/api/node/generate` | Tạo node-mode |
| `POST` | `/api/video/generate` | Tạo video (SSE) |
| `GET` | `/api/events` | Kênh SSE multiplex |
| `GET` | `/api/history` | Liệt kê ảnh đã tạo |
| `GET` | `/api/inflight` | Job đang hoạt động |
| `GET` | `/api/quota` | Quota/billing nhà cung cấp |

### Tạo bất đồng bộ

Tất cả endpoint tạo hỗ trợ chế độ `async: true`:

```json
{
  "async": true,
  "requestId": "req_xxx",
  "...": "các trường route khác"
}
```

Trả về `202 { requestId }` ngay lập tức. Sự kiện tiến trình đến qua `GET /api/events`.

## Lệnh CLI

### Server

| Lệnh | Mô tả |
|---|---|
| `ima2 serve [--dev]` | Khởi chạy server web cục bộ |
| `ima2 setup` | Cấu hình lại xác thực đã lưu |
| `ima2 status` | Hiển thị trạng thái config và OAuth |
| `ima2 doctor` | Chẩn đoán Node, package, config, và auth |
| `ima2 open` | Mở giao diện web |
| `ima2 reset` | Xóa config đã lưu |

### Client

| Lệnh | Mô tả |
|---|---|
| `ima2 gen <prompt>` | Tạo từ CLI |
| `ima2 edit <file> --prompt <text>` | Chỉnh sửa ảnh hiện có |
| `ima2 multimode <prompt>` | Tạo multi-image SSE |
| `ima2 video <prompt>` | Tạo video qua Grok |
| `ima2 ls [--session <id>] [--favorites]` | Liệt kê lịch sử gần đây |
| `ima2 show <name> [--metadata]` | Hiển thị ảnh đã tạo |
| `ima2 prompt ls -q <search>` | Tìm kiếm thư viện prompt |
| `ima2 inflight ls [--terminal]` | Liệt kê job đang hoạt động |
| `ima2 config set <key> <value>` | Ghi vào config |
| `ima2 ping` | Kiểm tra sức khỏe server |

Tham khảo đầy đủ: [docs/CLI.md](CLI.md).

## Triển khai Docker

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

### Chạy

```bash
docker compose up -d
# hoặc
docker build -t ima2-gen .
docker run -p 3333:3333 -v ima2-data:/root/.ima2 ima2-gen
```

### Lưu ý

- Mount `~/.ima2` sebagai volume để lưu trữ ảnh đã tạo và config qua các lần khởi động lại container.
- Đặt `IMA2_HOST=0.0.0.0` để server có thể truy cập từ bên ngoài container.
- Để xác thực OAuth, hoàn thành `ima2 setup` trước khi khởi động container, hoặc mount thư mục `~/.ima2` hiện có.
- Grok proxy tích hợp (progrok) chạy bên trong container trên `127.0.0.1:18645` theo mặc định.

## Tích hợp với CreatorHub

ima2-gen có thể được tích hợp vào CreatorHub làm backend tạo ảnh/video.

### Tích hợp API

```bash
# Tạo ảnh qua API
curl -X POST http://localhost:3333/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "a futuristic city skyline", "provider": "oauth", "model": "gpt-5.4"}'

# Tạo video qua API
curl -X POST http://localhost:3333/api/video/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "camera pans across the city", "provider": "grok", "duration": 5}'

# Kiểm tra sức khỏe
curl http://localhost:3333/api/health
```

### SSE Event Streaming

Kết nối với `GET /api/events` để nhận tiến trình tạo real-time:

```javascript
const events = new EventSource("http://localhost:3333/api/events");

events.addEventListener("phase", (e) => {
  const data = JSON.parse(e.data);
  console.log(`Job ${data.jobId}: ${data.phase}`);
});

events.addEventListener("done", (e) => {
  const data = JSON.parse(e.data);
  console.log(`Hoàn thành: ${data.filename}`);
});
```

### ComfyUI Bridge

ima2-gen bao gồm ComfyUI bridge tại `integrations/comfyui/`. Xem `integrations/comfyui/ima2_gen_bridge/README.md` để thiết lập.

## Khắc phục sự cố

**`ima2 ping` nói server không thể truy cập**
Khởi chạy `ima2 serve`, sau đó kiểm tra `~/.ima2/server.json`. Bạn cũng có thể chạy `ima2 ping --server http://localhost:3333`.

**Đăng nhập GPT OAuth không hoạt động**
Chạy lại `ima2 setup` (lựa chọn 1), xác nhận `ima2 status`, sau đó khởi động lại `ima2 serve`.

**`fetch failed` lặp lại trên mạng proxy/VPN**
Kiểm tra proxy cục bộ có thể truy cập được không. Trên mạng yêu cầu proxy, bật chế độ TUN/TURN, sau đó thử lại `openai-oauth --port 10531`. Nếu vẫn lỗi, đặt `HTTP_PROXY` và `HTTPS_PROXY` trong cùng terminal chạy `ima2 serve`. Trên Windows, kiểm tra các công cụ chặn mạng tự khởi động (bao gồm công cụ bypass DNS/fragmentation như SecretDNS).

**Ảnh thất bại với `API_KEY_REQUIRED`**
Đặt `OPENAI_API_KEY` hoặc cấu hình API key trước khi sử dụng `provider: "api"`. Đường dẫn GPT OAuth mặc định vẫn hoạt động không cần API key.

**Ảnh tạo trả về `EMPTY_RESPONSE` hoặc không có dữ liệu ảnh**
Chạy `ima2 doctor image-probe --json > ima2-image-probe.json` và đính kèm JSON an toàn khi tạo issue. Với GPT OAuth, cũng chụp:
```bash
ima2 gen "고양이" --no-web-search --json > ima2-cat-no-search.json
ima2 gen "고양이" --json > ima2-cat-current.json
```
Không chia sẻ cookie ChatGPT, file token OAuth, API keys, raw upstream response, lịch sử prompt, hoặc base64 ảnh đã tạo.

**Ảnh tham chiếu lớn bị lỗi**
Ứng dụng nén ảnh JPEG/PNG lớn trước khi tải lên. Chuyển đổi HEIC/HEIF sang JPEG hoặc PNG trước khi đính kèm.

**Ảnh gallery cũ bị thiếu sau khi cập nhật**
Chạy `ima2 doctor` và xem [Khôi phục ảnh cũ](RECOVER_OLD_IMAGES.md).

**`gpt-5.5` lỗi nhưng các mô hình khác hoạt động**
Cập nhật Codex CLI trước, sau đó thử lại. Sử dụng `gpt-5.4` làm phương án thay thế ổn định.

**Ứng dụng mở trên port khác**
Nếu port `3333` bị chiếm, `ima2-gen` chuyển sang port khả dụng tiếp theo. Kiểm tra `~/.ima2/server.json`. Ghi đè với `IMA2_PORT=3333 ima2 serve`.

**Port `10531` đã bị sử dụng trên Windows**
Một số công cụ bảo mật Windows chiếm port OAuth proxy mặc định. Ghi đè với `IMA2_OAUTH_PROXY_PORT=11531 ima2 serve`.

Xem thêm câu trả lời tại [docs/FAQ.md](FAQ.md).

## Phát triển

```bash
git clone https://github.com/lidge-jun/ima2-gen.git
cd ima2-gen
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

`npm run dev` build UI và khởi chạy TypeScript server entry với `--watch` và chi tiết nâng cao.

## Contributors

- [@lidge-jun](https://github.com/lidge-jun) — maintainer
- [@ree9622](https://github.com/ree9622) — moderation controls, Windows fixes, structured logging
- [@Charley-Peng](https://github.com/Charley-Peng) — API cache fix (#74)
- [@philiptaron](https://github.com/philiptaron) — Nix flake (#81)
- [@aorying](https://github.com/aorying) — upstream validation error surfacing
- [@PARKJONGMlN](https://github.com/PARKJONGMlN) — batch comparison matrix design (#80)

## Giấy phép

MIT
