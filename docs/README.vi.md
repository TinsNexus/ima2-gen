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

> **Sử dụng npx?** Xem [docs/NPX_QUICKSTART.md](NPX_QUICKSTART.md) cho quy trình `npx ima2-gen serve`.

### Cài đặt bằng một cú nhấp (không cần npm)

Không có Node.js hoặc npm? Sử dụng script cài đặt theo nền tảng — nó sẽ phát hiện môi trường, cài Node LTS nếu cần, sau đó cài ima2-gen.

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

### Thiết lập

`ima2 setup` cung cấp bốn lựa chọn xác thực:

1. **GPT OAuth** — đăng nhập bằng tài khoản ChatGPT (miễn phí, chỉ tạo ảnh)
2. **Grok OAuth** — đăng nhập bằng tài khoản xAI/Grok (ảnh + video)
3. **Cả hai** — GPT OAuth + Grok OAuth (truy cập đầy đủ tính năng)
4. **Thiết lập Web** — cấu hình mọi thứ trong giao diện web

Tạo video yêu cầu Grok OAuth (lựa chọn 2 hoặc 3). Chạy `ima2 grok login` riêng nếu bạn đã có GPT OAuth và muốn thêm hỗ trợ video.

### Cập nhật

Dừng server đang chạy bằng Ctrl+C, sau đó:

```bash
npm install -g ima2-gen@latest
```

Ctrl+C thực hiện tắt sạch — đóng database, dừng tiến trình con, và giải phóng khóa tệp.

## Tính năng

- **Classic mode**: tạo, chỉnh sửa, tái sử dụng ảnh hiện tại, dán ảnh tham chiếu, và tiếp tục từ lịch sử.
- **Node mode**: phân nhánh một ảnh tốt thành nhiều hướng mà không mất ảnh gốc.
- **Multimode batches**: khởi tạo nhiều kết quả Classic từ một prompt, theo dõi tiến trình từng slot, và tiếp tục từ kết quả tốt nhất.
- **Tạo video**: tạo video ngắn từ văn bản, một ảnh, hoặc nhiều ảnh tham chiếu qua mô hình video Grok. SSE streaming hiển thị lập kế hoạch → đã gửi → tiến trình % → hoàn thành.
- **Storyboard mode**: chuyển đổi storyboard trong composer để duy trì sự liên tục nhân vật và cảnh qua các frame liên tiếp.
- **Canvas Mode**: zoom, pan, đánh dấu, xóa, làm sạch nền, xem trước trong suốt, và xuất phiên bản alpha hoặc matte-backed.
- **Gallery cục bộ**: lưu ảnh tạo trên máy với lịch sử theo session. Mặc định gallery hiển thị session hiện tại và toggle Tất cả ảnh hiển thị toàn bộ lịch sử.
- **Ảnh tham chiếu**: kéo, thả, dán, và đính kèm tối đa 5 ảnh tham chiếu (ảnh) hoặc 7 ảnh tham chiếu (video).
- **Thư viện prompt**: import pack prompt cục bộ, thư mục GitHub, và gợi ý prompt GPT-image vào thư viện prompt tích hợp.
- **Di động**: sử dụng app bar, compose sheet, và toggle cài đặt trên màn hình nhỏ.

### SSE Multiplexing

Giao diện web sử dụng một kết nối Server-Sent Events `GET /api/events` cho tất cả tiến trình tạo. Yêu cầu multimode, node, và video được gửi bất đồng bộ (202 { requestId }) và sự kiện tiến trình được multiplex qua event bus chung.

## Các nhà cung cấp

Tạo ảnh có thể chạy qua đường dẫn OAuth Codex/ChatGPT cục bộ, API key OpenAI đã cấu hình, nhà cung cấp Grok tích hợp, hoặc nhà cung cấp Gemini qua Antigravity CLI.

- `provider: "oauth"` sử dụng proxy Codex OAuth cục bộ.
- `provider: "api"` gọi OpenAI Responses API với tool `image_generation`.
- `provider: "grok"` khởi chạy `progrok` tích hợp trên `127.0.0.1:18645`, chạy tìm kiếm xAI bắt buộc và planner pass, sau đó gọi xAI Images API qua proxy cục bộ.
- `provider: "gemini-api"` gọi trực tiếp Google Generative Language API. Hỗ trợ hai mô hình: `nano-banana-2` và `nano-banana-pro`.

## Hướng dẫn mô hình

Ứng dụng mặc định sử dụng **`gpt-5.4-mini`** để lặp nhanh. Chuyển sang **`gpt-5.4`** khi bạn muốn quy trình ảnh cân bằng an toàn nhất.

- `gpt-5.4` — lựa chọn cân bằng được khuyến nghị.
- `gpt-5.4-mini` — mô hình mặc định hiện tại và draft nhanh hơn.
- `gpt-5.5` — tùy chọn chất lượng mạnh nhất khi backend Codex CLI/OAuth hỗ trợ.

## Quy trình làm việc

### Classic Mode

Sử dụng Classic khi bạn muốn một kết quả mạnh nhanh chóng.

1. Viết prompt.
2. Đính kèm hoặc dán ảnh tham chiếu nếu cần.
3. Chọn mô hình, chất lượng, kích thước, định dạng, và kiểm duyệt.
4. Tạo một ảnh, hoặc bật multimode để tạo nhiều ứng viên từ cùng prompt.
5. Sao chép, tải xuống, tiếp tục từ kết quả, hoặc gửi vào Canvas Mode.

### Node Mode

Sử dụng Node mode khi bạn muốn khám phá các nhánh.

Mỗi node giữ prompt và kết quả riêng. Node gốc có thể đính kèm ảnh tham chiếu cục bộ; node con sử dụng ảnh cha làm nguồn.

### Canvas Mode

Sử dụng Canvas Mode khi ảnh tạo gần xong nhưng cần chỉnh sửa trước prompt tiếp theo.

- Phân biệt viewfinder panning và selection để di chuyển quanh ảnh zoom mà không thay đổi đánh dấu.
- Sử dụng annotation, eraser, multiselect, grouping, undo/redo, và sticky notes.
- Phát hiện ảnh trong suốt và hiển thị xem trước checkerboard; xuất với alpha được bảo trì.

### Thư viện Prompt và Import

Thư viện prompt có thể được lấp đầy từ tệp cục bộ, thư mục GitHub, nguồn đã tuyển chọn, và gói gợi ý prompt GPT-image.

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

Các lệnh này yêu cầu `ima2 serve` đang chạy. CLI bao gồm tất cả route của server.

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
| `ima2 config set <key> <value>` | Ghi vào `~/.ima2/config.json` |
| `ima2 ping` | Kiểm tra sức khỏe server |

Tham khảo đầy đủ: [docs/CLI.md](CLI.md).

## Cấu hình

Ưu tiên cấu hình:

```text
biến môi trường > ~/.ima2/config.json > giá trị mặc định
```

| Biến | Mặc định | Mô tả |
|---|---:|---|
| `IMA2_PORT` / `PORT` | `3333` | Port web server |
| `IMA2_HOST` | `127.0.0.1` | Host bind web server |
| `IMA2_OAUTH_PROXY_PORT` / `OAUTH_PORT` | `10531` | Port OAuth proxy |
| `IMA2_SERVER` | — | CLI target override |
| `IMA2_CONFIG_DIR` | `~/.ima2` | Vị trí config và SQLite |
| `IMA2_GENERATED_DIR` | `~/.ima2/generated` | Thư mục ảnh đã tạo |
| `IMA2_IMAGE_MODEL_DEFAULT` | `gpt-5.4-mini` | Mô hình ảnh fallback |
| `OPENAI_API_KEY` | — | API key cho Responses API |

## Tham khảo

- [Tài liệu developer](https://lidge-jun.github.io/ima2-gen/docs) — Tổng quan, Bắt đầu nhanh, Kiến trúc, Chế độ, Nhà cung cấp, CLI, Config, và Server API
- [Tham khảo CLI](CLI.md)
- [Tham khảo API](API.md)
- [Hướng dẫn Prompt Studio](PROMPT_STUDIO.md)
- [FAQ](FAQ.md)
- [README tiếng Việt](README.vi.md) ← bạn đang đọc
- [README tiếng Hàn](README.ko.md)
- [README tiếng Nhật](README.ja.md)
- [README tiếng Trung](README.zh-CN.md)

## Khắc phục sự cố

**`ima2 ping` nói server không thể truy cập**
Khởi chạy `ima2 serve`, sau đó kiểm tra `~/.ima2/server.json`.

**Đăng nhập GPT OAuth không hoạt động**
Chạy lại `ima2 setup` (lựa chọn 1), xác nhận `ima2 status`, sau đó khởi động lại `ima2 serve`.

**`fetch failed` lặp lại trên mạng proxy/VPN**
Kiểm tra proxy cục bộ có thể truy cập được không. Trên mạng yêu cầu proxy, bật chế độ TUN/TURN, sau đó thử lại.

**Ảnh thất bại với `API_KEY_REQUIRED`**
Đặt `OPENAI_API_KEY` hoặc cấu hình API key trước khi sử dụng `provider: "api"`.

**Ảnh tạo trả về `EMPTY_RESPONSE` hoặc không có dữ liệu ảnh**
Chạy `ima2 doctor image-probe --json` và đính kèm JSON an toàn khi tạo issue.

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

## Contributors

- [@lidge-jun](https://github.com/lidge-jun) — maintainer
- [@ree9622](https://github.com/ree9622) — moderation controls, Windows fixes, structured logging
- [@Charley-Peng](https://github.com/Charley-Peng) — API cache fix (#74)
- [@philiptaron](https://github.com/philiptaron) — Nix flake (#81)
- [@aorying](https://github.com/aorying) — upstream validation error surfacing
- [@PARKJONGMlN](https://github.com/PARKJONGMlN) — batch comparison matrix design (#80)

## Giấy phép

MIT
