# 学生评价自动评分插件

**English:** One-click auto-fill for course evaluation forms — supports all rating levels and automatically fills the last two text fields with placeholders.  
**中文：** 一键批量填写课程评价表 — 支持所有评分等级，并自动在最后两个文本框中填入占位符。

---

## 功能特点

- 支持四种批量填充等级：非常认同、较为认同、一般认同、不认同/非常不认同  
- 自动识别“听课投入情况”、“兴趣程度”等特殊选项并正确映射  
- 自动定位最后两个可见的输入框（`<input>` 或 `<textarea>`），填入占位符 ``  
- 悬浮控制面板，可手动关闭  

## 安装步骤

1. 将 `manifest.json` 和 `content.js` 保存到同一文件夹  
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`  
3. 开启右上角 **开发者模式**  
4. 点击 **加载已解压的扩展程序**，选择该文件夹  
5. 登录上海交通大学教务系统 → 学生评价页面，点击任意教学班进入评价界面，右下角出现悬浮按钮即可使用  

## 使用方法

1. 点击左侧课程列表，加载评价内容  
2. 根据意愿点击悬浮按钮：  
   - 绿色：全部非常认同  
   - 蓝色：全部较为认同  
   - 橙色：全部一般认同  
   - 红色：全部不认同/非常不认同  
3. 插件自动填充所有客观题，并在最后两个主观题文本框填入 ``  
4. 检查后手动提交  

## 文件说明

| 文件 | 作用 |
|------|------|
| `manifest.json` | Chrome 扩展清单，定义权限与匹配 URL |
| `content.js` | 核心脚本，实现界面、匹配逻辑和占位符填充 |

## 自定义配置

- **修改匹配网址**：编辑 `manifest.json` 中的 `matches` 字段  
- **更换占位符**：修改 `content.js` 中的 `placeholder` 变量  
- **调整按钮样式**：修改 `createControlPanel` 中的 CSS  

## 注意事项

- 请根据真实体验选择选项，提交前务必检查  
- 插件不会自动提交，仅辅助填写  
- 如遇匹配错误，可更新 `LEVEL_KEYWORDS` 对象中的关键词  

## 本插件仅为方便打分使用，请认真评教! 
