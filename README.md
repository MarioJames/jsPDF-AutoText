# jsPDF-AutoText

一个可以根据文字长度自行计算文字位置/行数并渲染在 jsPDF 创建的文件中的 jsPDF 拓展库。

## 使用方法

### 简单例子

```js
  const pdfFile = new jsPDF();

  const RenderText = new AutoText({ pdfFile });

  RenderText.render('使用jsPDF-AutoText帮助更好的渲染文字');
```
### render 方法

目前 `render` 方法接受两种类型的参数：配置对象或字符串，如果调用 `Render` 方法时传递的是数组则可以混合使用

```javascript
// 纯字符串
AutoText.render('纯字符串调用');

// 配置对象调用
AutoText.render({ text: "配置对象调用", indent: 10 })

// 字符串数组
AutoText.render([
    "字符串调用1",
    "字符串调用2"
])

// 配置对象数组
AutoText.render([
    { text: "配置对象调用", indent: 10 }
    { text: "配置对象调用", indent: 10 }
])

// 混合调用
AutoText.render([
    "混合调用纯字符串"
    { text: "配置对象调用", indent: 10 }
])
```

## 配置项

### 渲染文字对象配置

配置对象的配置格式有以下几个：

| key    | 名称                             | 必填 / 默认值 | 数据类型 | 描述 |
| ------ | -------------------------------- | ------------- | -------- | ---- |
| text   | 文字内容                         | Y             | string   | -    |
| indent | 缩进数量                         | N             | number   | -    |
| ...... | 请参照 jsPDF 中 Text Option 选项 |               |          |      |

### 实例化 AutoText 配置项

以下默认值均是在 A4 纸情况下的默认，A4 纸的标注宽度为 210 毫米，高度为 297 毫米，所以以下值的单位也均为毫米

| key                    | 名称                               | 必填 / 默认值 | 数据类型       | 描述                                       |
| ---------------------- | ---------------------------------- | ------------- | -------------- | ------------------------------------------ |
| pdfFile                | jsPDF 实例                         | Y             | jsPDF instance | -                                          |
| TEXT_LINE_MAX_WIDTH    | 每一行文字的最大宽度，超过换行     | N / 190       | number         | -                                          |
| INITIAL_POSITION_X     | 每一行文字的起始 X 坐标            | N / 10        | number         | 页面上文字的起点与纸张左侧的距离           |
| INITIAL_POSITION_Y     | 每一页文字的起始 Y 坐标            | N / 10        | number         | 每页第一行文字顶部与纸张顶部的距离         |
| EVERY_PAGE_MAX_HEIGHT  | 每一页最高渲染多高的文字，超过换页 | N / 280       | number         | -                                          |
| EVERY_INDENT_WIDTH     | 每一个缩进的缩进量                 | N / 5         | number         | -                                          |
| EVERY_TEXT_LINE_HEIGHT | 每一行文字的行高                   | N / 6         | number         | 以宋体/10 号字为基准，不同字体需要自行配置 |