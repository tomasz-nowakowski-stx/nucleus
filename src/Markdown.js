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

    // this.renderer.code = function(code, lang, escaped) {
    //   if (this.options.highlight) {
    //     var out = this.options.highlight(code, lang);
    //     if (out != null && out !== code) {
    //       escaped = true;
    //       code = out;
    //     }
    //   }
    //
    //   if (!lang) {
    //     return '<pre><code>'
    //       + (escaped ? code : escape(code, true))
    //       + '\n</code></pre>';
    //   }
    //
    //   return '<pre><code class="'
    //     + this.options.langPrefix
    //     + escape(lang, true)
    //     + '">'
    //     + (escaped ? code : escape(code, true))
    //     + '\n</code></pre>\n';
    // };
    // this.renderer.blockquote = (quote) => `<div class="SG-blockquote">${quote}</div>`;
    this.renderer.heading = (text, level) => `<div class="SG-h${level}">${text}</div>`;
    this.renderer.hr = () => '<div class="SG-hr"></div>';
    this.renderer.list = function(body, ordered) {
      const type = ordered ? 'ol' : 'ul';
      //return '<' + type + '>\n' + body + '</' + type + '>\n';
      return `<div class="SG-${type}">${body}</div>`;
    };
    this.renderer.listitem = (text) => `<div class="SG-li">${text}</div>`;
    this.renderer.paragraph = (text) => `<div class="SG-p">${text}</div>`;
    //this.renderer.table = (header, body) => ``;
    //this.renderer.tablerow = (content) => ``;
    //this.renderer.tablecell = (content, flags) => ``;

    this.renderer.strong = (text) => `<span class="SG-strong">${text}</span>`;
    this.renderer.em = (text) => `<span class="SG-i">${text}</span>`;
    this.renderer.codespan = (code) => `<span class="SG-code">${code}</span>`;
    //this.renderer.br = () => ``;
    this.renderer.del = (text) => `<span class="SG-del">${text}</span>`;
    //this.renderer.link = (href, title, text) => ``;
    //this.renderer.image = (href, title, text) => ``;
  }

  render(str) {
    return this.marked(str, { renderer: this.renderer });
  }
}

module.exports = new Markdown();
