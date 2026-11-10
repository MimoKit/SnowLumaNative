# SnowLumaNative

SnowLuma 的原生产物存档仓。

SnowLuma 通过注入 QQ 客户端进程读取协议数据，这部分能力全部由预编译的原生模块提供：
`.so` / `.dll` 负责注入到 QQ 进程，`.node` 是主程序通过 `process.dlopen` 加载的接口。
这些模块的源码从未公开（内部仓 `nnphook`），因此**本仓只能保存成品，无法提供源码**。

## 这里面是什么

```
native/                 SnowLuma 运行必需的原生模块（注入 + Node 接口）
  snowluma-linux-x64.node
  snowluma-linux-x64.so
  snowluma-linux-arm64.node
  snowluma-linux-arm64.so
  snowluma-win32-x64.node
  snowluma-win32-x64.dll
  websocket-*.node      WebSocket 原生加速
  ffmpeg/ffmpegAddon.*  FFmpeg 绑定（语音/视频处理）
SHA256SUMS.txt          与上文一一对应的校验值
scripts/install-into-snowluma.mjs   把它们复制进一份 SnowLuma 检出
```

后两类（`websocket-*`、`ffmpeg/*`）原属主仓 `packages/runtime/native/`，一起放进本仓是为了让整套原生产物集中存活。

## 来源与版本

| 项 | 值 |
| --- | --- |
| 上游版本 | SnowLuma v2.4.2（2026-11-07） |
| 构建批次 | `native-de06ed1` |
| 上游原生构建仓 | `SnowLuma/SnowLumaNative`（已于 2026-11-09 转为私有） |
| 主仓镜像来源 | `TomyJan/SnowLuma` |

上游主仓在 2026-11-09 转为私有，本仓的文件取自公开镜像中 `packages/runtime/native/`
的最后一版，逐字节与 GitHub 记录一致（见 `SHA256SUMS.txt`）。

## 使用

复制到一份 SnowLuma 检出里：

```bash
node scripts/install-into-snowluma.mjs /path/to/SnowLuma
```

然后按主仓的构建流程打包即可。发行包本来就直接带这些文件，所以只有从源码自行构建时才需要这一步。

## 许可

原生模块属于 SnowLuma 项目产物，随 `LICENSE`（SnowLuma Source-Available
Non-Commercial License）分发：仅允许非商业使用与自托管，不得发布修改版。
本仓不对这些二进制做任何修改，仅做保存与分发。
