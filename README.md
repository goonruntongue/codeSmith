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

### 1. Load jQuery

```{=html}
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```
### 2. Load codeSmith

```{=html}
<script src="jquery.codesmith.js"></script>
```
<br>
if you use CDN

```html
<script src="https://cdn.jsdelivr.net/gh/goonruntongue/codeSmith@v1.0.0/dist/jquery.codesmith.min.js"></script>
```


------------------------------------------------------------------------

## 🚀 Basic Usage

```{=html}
<textarea class="editor" data-code="css"></textarea>
```

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
