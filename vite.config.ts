import * as fs from 'fs-extra';
import glob from 'glob';
import hljs from 'highlight.js';
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
const tm = require('markdown-it-texmath');

export default defineConfig({
  plugins: [
    solidPlugin(),
    // function () {
    //   let md = new MarkdownIt({
    //     breaks: true,
    //     highlight: function (str, lang) {
    //       if (lang && hljs.getLanguage(lang)) {
    //         try {
    //           return hljs.highlight(str, { language: lang }).value;
    //         } catch (__) {}
    //       }

    //       return '';
    //     },
    //   }).use(tm, {
    //     engine: require('katex'),
    //     delimiters: 'dollars',
    //     katexOptions: { macros: { '\\RR': '\\mathbb{R}' } },
    //   });

    //   const IN = '/Users/adrianavram/Documents/Nota/';

    //   const BASE: any = {
    //     hidden: false,
    //     isDirectory: true,
    //     sub: {},
    //   };

    //   const ex = _.cloneDeep(BASE);

    //   glob(IN + '**/*.md', function (er, files) {
    //     for (const file of files) {
    //       let loc = file.slice(IN.length);
    //       loc = loc.substring(0, loc.lastIndexOf('.'));

    //       const locs = loc.split(path.sep);
    //       let head = ex;
    //       for (let i = 0; i < locs.length; i++) {
    //         const l = locs[i];
    //         if (i == locs.length - 1) {
    //           head['sub'][l] = _.cloneDeep(BASE);
    //           head['sub'][l]['isDirectory'] = false;
    //           head['sub'][l]['content'] = md.render(
    //             fs.readFileSync(file, 'utf-8')
    //           );
    //         }
    //         if (!(l in head.sub)) {
    //           head['sub'][l] = _.cloneDeep(BASE);
    //         }
    //         head = head['sub'][l];
    //       }
    //     }
    //     fs.writeFileSync('./src/notes/notes.json', JSON.stringify(ex));
    //   });

    //   return {
    //     name: 'my-example', // this name will show up in warnings and errors
    //     resolveId(source) {
    //       if (source === 'virtual-module') {
    //         return source; // this signals that rollup should not ask other plugins or check the file system to find this id
    //       }
    //       return null; // other ids should be handled as usually
    //     },
    //     load(id) {
    //       if (id === 'virtual-module') {
    //         return 'export default "This is virtual!"'; // the source code for "virtual-module"
    //       }
    //       return null; // other ids should be handled as usually
    //     },
    //   };
    // },
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
