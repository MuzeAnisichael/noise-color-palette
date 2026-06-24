# Contributing

[简体中文](#简体中文) | [English](#english)

## 简体中文

谢谢你考虑贡献。这个项目目前是无依赖静态应用，优先保持简单、可读、可直接在浏览器运行。

### 开发流程

1. Fork 仓库并创建功能分支。
2. 修改 `index.html`、`styles.css`、`app.js` 或文档。
3. 运行静态检查：

```powershell
node --check app.js
```

4. 在浏览器中打开本地服务验证交互和导出：

```powershell
python -m http.server 5173
```

5. 提交 PR，并说明变更、验证方式和兼容性影响。

## English

Thanks for considering a contribution. This project is currently a dependency-free static app, so simplicity, readability, and direct browser execution are priorities.

### Workflow

1. Fork the repository and create a feature branch.
2. Edit `index.html`, `styles.css`, `app.js`, or documentation.
3. Run the static check:

```powershell
node --check app.js
```

4. Verify interaction and export in a browser:

```powershell
python -m http.server 5173
```

5. Open a PR describing the change, verification steps, and compatibility impact.
