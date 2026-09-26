# codeSmith ⚒️

Lightweight jQuery Code Editor Helper for `<textarea>`

codeSmith is a lightweight jQuery plugin that adds VSCode-like editing
features to a simple `<textarea>`. It is designed for learning tools,
demos, prototypes, and lightweight code editors.

------------------------------------------------------------------------

## ✨ Features

-   Auto pair insertion: (), {}, ""
-   Smart Enter with auto indent
-   Tab / Shift+Tab for indent control (multi-line supported)
-   Auto snippet expansion (customizable)
-   Comment toggle with Ctrl + / (JS/CSS: /\* \*/, HTML:
    `<!-- -->`{=html})
-   Line delete with Ctrl + K
-   Move lines with Alt + ↑ / ↓
-   Duplicate lines with Alt + Shift + ↑ / ↓
-   Multi-line operations supported
-   Language-aware comment style (js, css, html)

------------------------------------------------------------------------

## 📦 Installation

### npm で使う

```bash
npm install @goonruntongue/codesmith jquery
```

ビルドツールを使う場合は、プロジェクト内で jQuery を読み込んだ後に、パッケージの配布ファイルを読み込みます。

### CDN で使う

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@goonruntongue/codesmith@1.0.1/dist/jquery.codesmith.min.js"></script>
```

UNPKG: <code>https://unpkg.com/@goonruntongue/codesmith@1.0.1/dist/jquery.codesmith.min.js</code>


------------------------------------------------------------------------

## 🚀 Basic Usage

```{=html}
<textarea class="editor" data-code="css"></textarea>


<script>
  $(".editor").codeSmith();
</script>
```

------------------------------------------------------------------------

## ⚙️ Options

```
$(".editor").codeSmith({ 
    lang: "css",
    indentUnit: " ",
    autoComplete:{
      ".sli": ".slider",
      "pos": "position:",
      "rel": "relative;",
      "abs":"absolute;",
      "top": "top:",
      "bot": "bottom:", 
      "lef": "left:",
      "rig":"right:",
      "0": "0;", 
    } 
});
```

You can add as many keywords as you like to the autoComplete option.

------------------------------------------------------------------------

## ⌨️ Keyboard Shortcuts

Tab: Increase indent\
Shift + Tab: Decrease indent\
Enter: Smart indent & block formatting\
Ctrl + K: Delete current line\
Alt + ↑ / ↓: Move line\
Alt + Shift + ↑ / ↓: Duplicate line\
Ctrl + /: Toggle comment

------------------------------------------------------------------------

## 🧑‍💻 Author

Katsuyori Murakami 

------------------------------------------------------------------------

## 📄 License

MIT License Copyright (c) 2025 Katsuyori Murakami
