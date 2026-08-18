# deepseek-harness-luvian-ui-wallpaper

一个为 DeepSeek Harness Web UI 制作的图片/视频壁纸插件。它可以分别定制中间区域、
侧栏、输入卡片、主页标题和侧栏按钮，并在 React 重建对话 DOM 时自动重新绑定样式。

> 非 DeepSeek 官方项目。插件依赖 Harness 当前的 Client 插件接口和 DOM 结构；Harness
> 更新后，选择器可能需要同步调整。

## 效果预览

### 空白主页

![空白主页效果](docs/screenshots/home.png)

### 对话内容页

![对话内容页效果](docs/screenshots/conversation.png)

截图仅用于展示效果，截图中的人物图片、视频和按钮素材不包含在仓库中。请使用你拥有
使用权的素材。

## 已实现功能

- Middle Area 循环播放 MP4/WebM 视频壁纸。
- Sidebar 使用独立图片背景。
- Input Card 在主页使用透明玻璃效果，发送消息后切换为图片背景。
- 自定义品牌 Logo、主页 Hero Logo 和侧栏按钮图案。
- 切换/新建对话时复用已加载的视频节点，避免重新加载和闪烁测试色。
- MutationObserver 持续跟踪 React DOM，被替换后自动恢复主题。
- 图片和视频在 bundle 阶段转为 data URL，运行时不需要额外静态文件服务器。

## 环境要求

- 已能正常运行的 DeepSeek Harness 源码工作区。
- Node.js `^22.19.0` 或 `>=24.0.0`。
- pnpm（Harness 当前工作区使用 pnpm 11）。
- Windows、macOS 或 Linux；本文命令以 Windows PowerShell 为例。

## 安装

### 1. 放入 Harness 工作区

仓库必须位于 Harness 的二级 package 目录中：

```text
deepseek-harness-master/
└─ packages/
   └─ Luvian/
      └─ ui-wallpaper/
```

可以在 Harness 根目录执行：

```powershell
New-Item -ItemType Directory -Force packages\Luvian | Out-Null
git clone https://github.com/EnernityLune/deepseek-harness-luvian-ui-wallpaper.git packages\Luvian\ui-wallpaper
```

如果该目录已经存在，请先备份自己的版本，再决定合并或换名，不要直接覆盖未保存的修改。

### 2. 准备自定义素材

将自己的素材放进：

```text
packages/Luvian/ui-wallpaper/src/client/assets/
```

必须使用下列文件名：

| 文件名 | 用途 | 建议 |
| --- | --- | --- |
| `wallpaper.mp4` | 中间动态壁纸 | MP4/H.264，16:9 或接近屏幕比例 |
| `sidebar.jpg` | 左侧栏背景 | 竖图，建议至少 800×1600 |
| `input-card.png` | 内容页输入卡片 | 横图，建议约 4:1，PNG/JPG 均可转为 PNG 文件 |
| `brand-logo.png` | 左上角及主页品牌图 | 透明 PNG，建议约 7.58:1 |
| `new-session.png` | “新会话”整按钮背景 | 透明 PNG，横向构图 |
| `collapse.png` | 收起/展开侧栏 | 透明正方形 PNG |
| `search.png` | 搜索按钮 | 透明正方形 PNG |
| `filter.png` | 筛选按钮 | 透明正方形 PNG |
| `add-workspace.png` | 添加工作区 | 透明正方形 PNG |
| `settings-16@2x.png` | 展开状态设置按钮 | 32×32 透明 PNG，显示为 16px |
| `settings-18@2x.png` | 收起状态设置按钮 | 36×36 透明 PNG，显示为 18px |

注意：设计软件中的灰白棋盘格只是“透明区域提示”。如果导出的 PNG 实际带有棋盘格像素，
页面上也会看到方块。可用图片属性或图像工具确认 PNG 带 Alpha 通道。

### 3. 安装依赖并打包

在 Harness 根目录运行：

```powershell
pnpm install
pnpm --filter @luvian/dsh-ui-wallpaper bundle
```

成功后会生成：

```text
packages/Luvian/ui-wallpaper/lib/client.js
```

所有素材都会被内嵌进这个文件，因此素材越大，`client.js` 越大。不要把生成的
`lib/client.js.map` 提交到 GitHub。

### 4. 启动 Harness

在 Harness 根目录运行：

```powershell
pnpm run dev:web
```

打开 `http://127.0.0.1:3080`。如果页面已经打开，按 `Ctrl + F5` 强制刷新。

可以访问 `http://127.0.0.1:3080/__DSH_BOOT__`，确认其中存在：

```text
@luvian/dsh-ui-wallpaper
```

## 修改主题参数

主题配置集中在：

```text
src/client/theme/config.ts
```

常用参数：

- `middleArea.video.opacity`：视频透明度，`1` 为完全可见。
- `middleArea.video.object-fit`：通常使用 `cover` 铺满区域。
- `inputCard.opacity`：内容页卡片整体透明度。降低它会让文字和按钮一起变淡。
- `inputCard.hero.background`：主页输入卡片背景。默认是 8% 白色薄层。
- `inputCard.hero.blur`：主页玻璃模糊，`0px` 会直接透出视频。
- `sideBar.icons.*.width/height`：按钮显示尺寸。
- `hero.titleLogo.width/height`：主页品牌 Logo 尺寸。

如果只想让背景变透明，不要降低整个 Input Card 的 `opacity`，应调整背景颜色的 Alpha：

```ts
hero: {
  background: 'rgba(255, 255, 255, 0.08)',
  opacity: '1',
  blur: '0px',
}
```

每次修改配置或替换素材后，都需要重新运行 bundle 并刷新浏览器。

## 常见问题

### 新建对话后主题消失

本插件已经持续监听动态 DOM 并自动重新绑定。如果仍然发生，先确认浏览器加载的是最新
bundle，再按一次 `Ctrl + F5`。Harness 大版本更新后也可能需要更新选择器。

### 进入对话时出现纯色块

Middle Area 的兜底背景默认是透明色，并复用已加载的视频元素。如果换成其他颜色，它会在
视频解码前短暂显示。

### 视频无法播放

- 优先使用 MP4/H.264。
- 保持视频无声音或允许静音自动播放。
- 压缩分辨率和码率，避免生成过大的 bundle。

### 图标跑到文字右边

当前实现会把替换图片插入原 SVG 的位置。若 Harness 更新了按钮 DOM，需要更新
`src/client/components/sideBar.ts` 中的定位逻辑。

### GitHub 提示文件过大

不要提交 `lib/`、私人素材和大型视频。本仓库的 `.gitignore` 默认忽略
`src/client/assets/*`，只保留素材说明。需要公开素材时，请确认版权并考虑 Git LFS 或
GitHub Releases。

## 卸载

停止 Harness 后移走 `packages/Luvian/ui-wallpaper` 目录，再重新启动 Harness。不要在有
未备份修改时直接删除目录。

## 路线图

- 一键素材检查与自动 bundle 脚本。
- 不改 TypeScript 即可选择图片/视频的用户配置文件。
- 更多稳定的 data 属性选择器，降低 Harness 更新带来的兼容成本。

## 许可证

源码采用 MIT License。示例截图中的第三方素材不随仓库授权，版权归各自权利人所有。

