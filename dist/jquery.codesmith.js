/*!
 * codeSmith - jQuery code editor helper plugin
 * https://github.com/goonruntongue/codeSmith
 *
 * MIT License
 *
 * Copyright (c) 2025 Katsuyori Murakami
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function($) {
    $.fn.codeSmith = function(options) {
        const defaults = {
            lang: "js", // "js" | "css" | "html"
            autoComplete: {}, // { short: full, ... }
            indentUnit: "    ", // インデント単位（デフォルト4スペース）
        };

        const settings = $.extend(true, {}, defaults, options);
        const indentUnit = settings.indentUnit;

        // -------- autoComplete 用ルール生成 ----------
        function buildRules(obj) {
            const rules = [];
            Object.keys(obj).forEach((short) => {
                const full = obj[short];
                let offset = 0;

                // 末尾が () / {} なら、最後のカッコ内にカーソル
                if (full.endsWith("()")) {
                    offset = -1; // (... )| → (...|)
                } else if (full.endsWith("{}")) {
                    offset = -1; // {...}| → {...|}
                }

                rules.push({ short, full, offset });
            });
            return rules;
        }

        // 現在行のインデント取得
        function getCurrentLineIndent(text, pos) {
            const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
            const line = text.slice(lineStart, pos);
            const m = line.match(/^[\t ]*/);
            return m ? m[0] : "";
        }

        // 選択がかかっている「行ブロック」の範囲を返す
        function getSelectedLineBlockRange(text, start, end) {
            const firstLineStart = text.lastIndexOf("\n", start - 1) + 1;
            let lastLineBreak = text.indexOf("\n", end);
            if (lastLineBreak === -1) lastLineBreak = text.length;

            let blockEnd = lastLineBreak;
            if (blockEnd < text.length) blockEnd += 1; // 改行も含める

            return {
                blockStart: firstLineStart,
                blockEnd: blockEnd,
            };
        }

        return this.each(function() {
            const el = this;
            const $el = $(this);

            // lang を data-code にも反映（HTML側で data-code があればそちら優先）
            const langAttr = $el.data("code") || settings.lang;
            $el.attr("data-code", langAttr);

            // このインスタンス用 autoComplete ルール
            const autoCompleteRules = buildRules(settings.autoComplete);

            // -----------------------------
            // keydown ハンドラ
            // -----------------------------
            $el.on("keydown", function(e) {
                const value = el.value;
                const start = el.selectionStart;
                const end = el.selectionEnd;

                // 共通挿入ヘルパー
                const insertText = (text, caretOffsetFromStart) => {
                    const before = value.slice(0, start);
                    const after = value.slice(end);
                    el.value = before + text + after;
                    const caretPos = before.length + caretOffsetFromStart;
                    el.selectionStart = el.selectionEnd = caretPos;
                };

                // ------------------------------
                // Tab / Shift+Tab でインデント増減
                // ------------------------------
                if (e.key === "Tab") {
                    e.preventDefault();

                    const text = el.value;
                    let s = el.selectionStart;
                    let t = el.selectionEnd;

                    // Shiftなし → インデント追加
                    if (!e.shiftKey) {
                        // カーソルのみ
                        if (s === t) {
                            const before = text.slice(0, s);
                            const after = text.slice(t);
                            el.value = before + indentUnit + after;
                            const pos = s + indentUnit.length;
                            el.selectionStart = el.selectionEnd = pos;
                            return;
                        }

                        // 複数行 → 各行の先頭に indentUnit を追加
                        const lineStart = text.lastIndexOf("\n", s - 1) + 1;
                        let lineEnd = text.indexOf("\n", t);
                        if (lineEnd === -1) lineEnd = text.length;

                        const beforeBlock = text.slice(0, lineStart);
                        const block = text.slice(lineStart, lineEnd);
                        const afterBlock = text.slice(lineEnd);

                        const modified = block.replace(/^/gm, indentUnit);
                        el.value = beforeBlock + modified + afterBlock;

                        const lineCount = block.split("\n").length;
                        const totalAdded = indentUnit.length * lineCount;

                        const newStart = s + indentUnit.length;
                        const newEnd = t + totalAdded;
                        el.selectionStart = newStart;
                        el.selectionEnd = newEnd;
                        return;
                    }

                    // Shift+Tab → インデント減
                    const text2 = el.value;
                    let s2 = el.selectionStart;
                    let t2 = el.selectionEnd;

                    const lineStart2 = text2.lastIndexOf("\n", s2 - 1) + 1;
                    let lineEnd2 = text2.indexOf("\n", t2);
                    if (lineEnd2 === -1) lineEnd2 = text2.length;

                    const beforeBlock2 = text2.slice(0, lineStart2);
                    const block2 = text2.slice(lineStart2, lineEnd2);
                    const afterBlock2 = text2.slice(lineEnd2);

                    const modified2 = block2.replace(/^ {1,4}/gm, "");
                    el.value = beforeBlock2 + modified2 + afterBlock2;

                    el.selectionStart = lineStart2;
                    el.selectionEnd = lineStart2 + modified2.length;
                    return;
                }

                // ------------------------------
                // Alt+↑ / Alt+↓ : 行ブロック入れ替え
                // Alt+Shift+↑ / Alt+Shift+↓ : 行ブロック複製
                // ------------------------------
                if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                    e.preventDefault();

                    const text = el.value;
                    const s = el.selectionStart;
                    const t = el.selectionEnd;

                    const range = getSelectedLineBlockRange(text, s, t);
                    const blockStart = range.blockStart;
                    const blockEnd = range.blockEnd;

                    const block = text.slice(blockStart, blockEnd);
                    const blockLen = blockEnd - blockStart;

                    // Alt+Shift+↑ / Alt+Shift+↓ → 複製
                    if (e.shiftKey) {
                        const beforeBlock = text.slice(0, blockStart);
                        const afterBlock = text.slice(blockEnd);

                        const newText = beforeBlock + block + block + afterBlock;
                        el.value = newText;

                        if (e.key === "ArrowUp") {
                            // 上にコピーされたブロックを選択（先頭側）
                            el.selectionStart = blockStart;
                            el.selectionEnd = blockStart + blockLen;
                        } else {
                            // 下のブロック（2つ目）を選択
                            const newStart = blockStart + blockLen;
                            el.selectionStart = newStart;
                            el.selectionEnd = newStart + blockLen;
                        }
                        return;
                    }

                    // Alt+↑ : ブロックを一つ上の行と入れ替え
                    if (e.key === "ArrowUp") {
                        if (blockStart === 0) return; // 一番上は動かせない

                        const prevLineBreak = text.lastIndexOf("\n", blockStart - 2);
                        const prevStart =
                            prevLineBreak === -1 ?
                            0 :
                            text.lastIndexOf("\n", prevLineBreak - 1) + 1;
                        const prevEnd = blockStart;

                        const beforePrev = text.slice(0, prevStart);
                        const prevBlock = text.slice(prevStart, prevEnd);
                        const afterAll = text.slice(blockEnd);

                        const newText = beforePrev + block + prevBlock + afterAll;
                        el.value = newText;

                        const offsetStartInBlock = s - blockStart;
                        const offsetEndInBlock = t - blockStart;
                        const newStart = prevStart + offsetStartInBlock;
                        const newEnd = prevStart + offsetEndInBlock;
                        el.selectionStart = newStart;
                        el.selectionEnd = newEnd;
                        return;
                    }

                    // Alt+↓ : ブロックを一つ下の行と入れ替え
                    if (e.key === "ArrowDown") {
                        if (blockEnd >= text.length) return; // 最終行は動かせない

                        const nextStart = blockEnd;
                        let nextBreak = text.indexOf("\n", nextStart);
                        if (nextBreak === -1) nextBreak = text.length;
                        let nextEnd = nextBreak;
                        if (nextEnd < text.length) nextEnd += 1;

                        const beforeAll = text.slice(0, blockStart);
                        const nextBlock = text.slice(nextStart, nextEnd);
                        const afterNext = text.slice(nextEnd);

                        const newText = beforeAll + nextBlock + block + afterNext;
                        el.value = newText;

                        const shift = nextBlock.length;
                        const newStart = s + shift;
                        const newEnd = t + shift;
                        el.selectionStart = newStart;
                        el.selectionEnd = newEnd;
                        return;
                    }
                }

                // ------------------------------
                // Ctrl + K : 行削除（複数行対応）
                // ------------------------------
                if (e.ctrlKey && e.key.toLowerCase() === "k") {
                    e.preventDefault();

                    const text = el.value;
                    let s = el.selectionStart;
                    let t = el.selectionEnd;

                    const firstLineStart = text.lastIndexOf("\n", s - 1) + 1;
                    let lastLineEnd = text.indexOf("\n", t);
                    if (lastLineEnd === -1) lastLineEnd = text.length;

                    let deleteStart = firstLineStart;
                    let deleteEnd = lastLineEnd;

                    if (deleteEnd < text.length) {
                        deleteEnd += 1; // 行末の改行も含めて消す
                    } else {
                        // 最終行の場合は、前の改行ごと消して空行を残さない
                        if (deleteStart > 0 && text[deleteStart - 1] === "\n") {
                            deleteStart -= 1;
                        }
                    }

                    const before = text.slice(0, deleteStart);
                    const after = text.slice(deleteEnd);
                    el.value = before + after;

                    el.selectionStart = el.selectionEnd = deleteStart;
                    return;
                }

                // ------------------------------
                // () の自動補完
                // ------------------------------
                if (e.key === "(") {
                    e.preventDefault();
                    insertText("()", 1);
                    return;
                }

                // {} の自動補完
                // ------------------------------
                if (e.key === "{") {
                    e.preventDefault();
                    insertText("{}", 1);
                    return;
                }

                // " の自動補完
                // ------------------------------
                if (e.key === '"') {
                    e.preventDefault();
                    const before = value.slice(0, start);
                    const selected = value.slice(start, end);
                    const after = value.slice(end);

                    if (start === end) {
                        el.value = before + '""' + after;
                        const pos = before.length + 1;
                        el.selectionStart = el.selectionEnd = pos;
                    } else {
                        el.value = before + '"' + selected + '"' + after;
                        const posStart = before.length + 1;
                        const posEnd = posStart + selected.length;
                        el.selectionStart = posStart;
                        el.selectionEnd = posEnd;
                    }
                    return;
                }

                // ------------------------------
                // Enter でインデント & ブロック内改行
                // ------------------------------
                if (e.key === "Enter") {
                    e.preventDefault();

                    const before = value.slice(0, start);
                    const after = value.slice(end);
                    const indent = getCurrentLineIndent(value, start);
                    const prevChar = before.slice(-1);
                    const nextChar = after.slice(0, 1);

                    const isBraceBlock = prevChar === "{" && nextChar === "}";
                    const isParenBlock = prevChar === "(" && nextChar === ")";

                    if (isBraceBlock || isParenBlock) {
                        const innerIndent = indent + indentUnit;
                        const insert = "\n" + innerIndent + "\n" + indent;
                        el.value = before + insert + after;

                        const caretPos = before.length + 1 + innerIndent.length;
                        el.selectionStart = el.selectionEnd = caretPos;
                        return;
                    }

                    const insert = "\n" + indent;
                    el.value = before + insert + after;
                    const caretPos = before.length + 1 + indent.length;
                    el.selectionStart = el.selectionEnd = caretPos;
                    return;
                }

                // ------------------------------
                // Ctrl + / : コメントトグル + 行コメント
                // ------------------------------
                if (e.ctrlKey && e.key === "/") {
                    e.preventDefault();

                    let start2 = el.selectionStart;
                    let end2 = el.selectionEnd;
                    const value2 = el.value;

                    const lang2 = el.dataset.code || "js";

                    let commentStart = "";
                    let commentEnd = "";

                    if (lang2 === "html") {
                        commentStart = "<!--";
                        commentEnd = "-->";
                    } else {
                        commentStart = "/*";
                        commentEnd = "*/";
                    }

                    let before = value2.slice(0, start2);
                    let selected = value2.slice(start2, end2);
                    let after = value2.slice(end2);

                    const hasStart = before.endsWith(commentStart);
                    const hasEnd = after.startsWith(commentEnd);

                    // 1) すでにコメントで囲まれている → アンコメント
                    if (hasStart && hasEnd) {
                        const newBefore = before.slice(
                            0,
                            before.length - commentStart.length
                        );
                        const newAfter = after.slice(commentEnd.length);

                        el.value = newBefore + selected + newAfter;

                        const newStart = newBefore.length;
                        const newEnd = newStart + selected.length;
                        el.selectionStart = newStart;
                        el.selectionEnd = newEnd;
                        return;
                    }

                    // 2) 選択なし → 行コメント or 空行にコメントペア
                    if (start2 === end2) {
                        const lineStart = value2.lastIndexOf("\n", start2 - 1) + 1;
                        let lineEnd = value2.indexOf("\n", start2);
                        if (lineEnd === -1) lineEnd = value2.length;

                        const lineText = value2.slice(lineStart, lineEnd);

                        if (lineText.length === 0) {
                            const insert = commentStart + commentEnd;
                            el.value = before + insert + after;

                            const newPos = before.length + commentStart.length;
                            el.selectionStart = el.selectionEnd = newPos;
                            return;
                        } else {
                            start2 = lineStart;
                            end2 = lineEnd;

                            before = value2.slice(0, start2);
                            selected = value2.slice(start2, end2);
                            after = value2.slice(end2);
                        }
                    }

                    // 3) 選択あり → コメントアウト
                    const wrapped = commentStart + selected + commentEnd;
                    el.value = before + wrapped + after;

                    const newStart = before.length + commentStart.length;
                    const newEnd = newStart + selected.length;
                    el.selectionStart = newStart;
                    el.selectionEnd = newEnd;
                    return;
                }
            }); // keydown end

            // -----------------------------
            // input: 自動補完
            // -----------------------------
            $el.on("input", function(e) {
                const text = el.value;
                const pos = el.selectionStart;

                const inputType = e.originalEvent && e.originalEvent.inputType;
                if (inputType && inputType.startsWith("delete")) {
                    return;
                }

                for (const rule of autoCompleteRules) {
                    const shortLen = rule.short.length;
                    if (pos >= shortLen) {
                        const tail = text.slice(pos - shortLen, pos);
                        if (tail === rule.short) {
                            const before = text.slice(0, pos - shortLen);
                            const after = text.slice(pos);
                            const nextText = before + rule.full + after;

                            el.value = nextText;

                            const insertLen = rule.full.length;
                            const offset = rule.offset || 0;
                            const newPos = before.length + insertLen + offset;
                            el.selectionStart = el.selectionEnd = newPos;
                            break;
                        }
                    }
                }
            });
        }); // each
    };
})(jQuery);