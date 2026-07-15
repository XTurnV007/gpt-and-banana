# GPT & Banana

一个面向 AI 图片生成与编辑的 Web 客户端，支持 OpenAI 兼容的 Images / Responses API、Nano Banana（Gemini 原生接口）、fal.ai 以及自定义服务商。API 配置、任务记录和生成图片默认保存在当前浏览器本地。

## 功能

- 文生图、参考图编辑和多图输入
- 普通生图与 Agent 两种使用模式
- 多套 API 配置快速切换
- 支持 `gpt-image-2`、Nano Banana、fal.ai 和自定义服务商
- 历史任务、收藏、批量下载及数据导入导出
- 深色模式和移动端适配

## 本地运行

建议使用 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

根据终端提示在浏览器中打开本地地址。生产构建命令：

```bash
npm run build
npm run preview
```

构建产物位于 `dist/`。

## API 密钥配置

项目不会在仓库中保存你的密钥。请先在 API 控制台创建令牌，再打开本项目右上角的“设置”，进入“API 配置”填写。

建议为 `image2` 和 `banana` 分别创建独立令牌。两类请求使用的接口和令牌分组不同，不要共用同一枚令牌。

### 1. 创建 image2 令牌

在 API 控制台进入“API 令牌”，点击“添加令牌”，按下面的方式配置：

| 选项 | 设置 |
| --- | --- |
| 名称 | `image2`（名称可自定义） |
| 状态 | 启用 |
| 智能路由 | 手动 |
| 分组 | 同时选择 `Codex专属` 和 `default` |
| 可用模型 | 无限制，或至少允许 `gpt-image-2` |

创建后立即复制生成的 `sk-...` 密钥。控制台通常只会完整展示一次，请妥善保存。

然后在本项目“设置 → API 配置”中选择默认的 `gpt-image-2` 配置，并填写：

| 配置项 | 值 |
| --- | --- |
| 配置名称 | `image2`（可选） |
| 服务商类型 | `OpenAI` |
| API URL | `https://api.cursorai.art/v1` |
| API Key | 刚创建的 `image2` 令牌 |
| API 接口 | `Images API` |
| 模型 ID | `gpt-image-2` |

### 2. 创建 banana 令牌

再次点击“添加令牌”，为 Nano Banana 单独创建一枚令牌：

| 选项 | 设置 |
| --- | --- |
| 名称 | `banana`（名称可自定义） |
| 状态 | 启用 |
| 智能路由 | 手动 |
| 分组 | 同时选择 `特价banana` 和 `优质gemini` |
| 可用模型 | 无限制，或至少允许 `gemini-3.1-flash-image-preview` |

创建后复制这枚令牌。回到本项目“设置 → API 配置”，切换到默认的 `nano-banana-2` 配置并填写：

| 配置项 | 值 |
| --- | --- |
| 配置名称 | `banana`（可选） |
| 服务商类型 | `Nano Banana` |
| API URL | `https://api.cursorai.art` |
| API Key | 刚创建的 `banana` 令牌 |
| 模型 ID | `gemini-3.1-flash-image-preview` |

Nano Banana 配置使用 Gemini 原生 `generateContent` 接口。项目当前按 2K、PNG 输出适配，并可在输入区域选择画面比例和质量。

### 3. 检查配置

1. 在“API 配置”顶部切换到要使用的配置。
2. 输入一个简单提示词并发起生成。
3. 如果提示无权限或模型不可用，回到令牌管理页确认令牌已启用，并检查令牌分组和可用模型。
4. 如果提示鉴权失败，确认没有复制到空格、掩码字符或另一枚令牌。

## 密钥安全

- 不要把真实 API Key 写入 README、源代码、Issue、截图或聊天记录。
- 不要提交包含密钥的配置导出文件。
- 怀疑密钥泄露时，应立即在 API 控制台禁用或删除旧令牌并重新创建。
- 使用共享设备后，请在“设置 → 数据管理”中清理本地配置和任务数据。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查并生成生产构建 |
| `npm run preview` | 本地预览生产构建 |
| `npm test` | 运行测试 |
| `npm run deploy:cf` | 构建并部署到 Cloudflare Workers |

## License

[MIT](./LICENSE)
