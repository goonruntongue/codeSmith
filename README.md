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

------------------------------------------------------------------------

## 🚀 Basic Usage

```{=html}
<textarea class="editor" data-code="css"></textarea>
```
```{=html}
<script>
  $(".editor").codeSmith();
</script>
```

------------------------------------------------------------------------

## ⚙️ Options

\$(".editor").codeSmith({ 
    &nbsp;&nbsp;&nbsp;&nbsp;lang: "css", 
    &nbsp;&nbsp;&nbsp;&nbsp;indentUnit: " ",
    &nbsp;&nbsp;&nbsp;&nbsp;autoComplete:{
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;".sli": ".slider",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"pos": "position:",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"rel": "relative;",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"abs":"absolute;",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"top": "top:",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"bot": "bottom:", 
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"lef": "left:",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"rig":"right:",
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"0": "0;", 
    &nbsp;&nbsp;&nbsp;&nbsp;} 
});

You can add as many keywords as you like to the autocomplete option.

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
