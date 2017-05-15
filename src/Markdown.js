/* Markdown.js -- interface for https://github.com/chjj/marked with custom renderer
 *
 * Copyright (C) 201y Tomasz Nowakowski
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */
const marked = require('marked');


class Markdown {
  constructor() {
    this.marked = marked;
    this.renderer = new marked.Renderer();

    function escapeHTML(text) {
      return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    this.renderer.code = function(code, lang, escaped) {
      if (this.options.highlight) {
        const out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
          escaped = true;
          code = out;
        }
      }

      if (!lang) {
        return '<pre class="SG-markdown-code"><code>'
          + (escaped ? code : escapeHTML(code))
          + '\n</code></pre>';
      }

      return '<pre class="SG-markdown-code"><code class="'
        + this.options.langPrefix
        + escapeHTML(lang)
        + '">'
        + (escaped ? code : escapeHTML(code))
        + '\n</code></pre>\n';
    };
    this.renderer.blockquote = (quote) => `<div class="SG-blockquote">${quote}</div>`;
    this.renderer.heading = (text, level) => `<div class="SG-h${level}">${text}</div>`;
    this.renderer.hr = () => '<div class="SG-hr"></div>';
    this.renderer.list = function(body, ordered) {
      const type = ordered ? 'ol' : 'ul';
      return `<div class="SG-${type}">${body}</div>`;
    };
    this.renderer.listitem = (text) => `<div class="SG-li">${text}</div>`;
    this.renderer.paragraph = (text) => `<div class="SG-p">${text}</div>`;
    this.renderer.table = function(header, body) {
      return `
<div class="SG-mtable">
  <div class="SG-mthead">
    ${header}
  </div>
  <div class="SG-mtbody">
    ${body}
  </div>
</div>`;
    };
    this.renderer.tablerow = (content) => `<div class="SG-mtr">${content}</div>`;
    this.renderer.tablecell = function (content, flags) {
      const type = flags.header ? 'th' : 'td';
      const tag = flags.align ? `<div class="SG-m${type} SG-m${type}--right">` : `<div class="SG-m${type}">`;
      return `${tag}${content}</div>`;
    };

    this.renderer.strong = (text) => `<span class="SG-strong">${text}</span>`;
    this.renderer.em = (text) => `<span class="SG-i">${text}</span>`;
    this.renderer.codespan = (code) => `<span class="SG-code">${code}</span>`;
    this.renderer.del = (text) => `<span class="SG-del">${text}</span>`;
  }

  render(str) {
    return this.marked(str, { renderer: this.renderer });
  }
}

module.exports = new Markdown();
