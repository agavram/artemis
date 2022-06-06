import * as fs from 'fs-extra';
import glob from 'glob';
import hljs from 'highlight.js';
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
const tm = require('markdown-it-texmath');
import pluginRewriteAll from 'vite-plugin-rewrite-all';

export default defineConfig({
  plugins: [
    solidPlugin(),
    pluginRewriteAll(),
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
    //   });

    //   const IN = '/Users/adrianavram/Documents/Nota/';

    //   const BASE: any = {
    //     hidden: false,
    //     isDirectory: true,
    //     sub: {},
    //   };

    //   const renderedFs = _.cloneDeep(BASE);
    //   const rawFs = _.cloneDeep(BASE);

    //   glob(IN + '**/*.md', function (er, files) {
    //     for (const file of files) {
    //       let loc = file.slice(IN.length);
    //       loc = loc.substring(0, loc.lastIndexOf('.'));

    //       const locs = loc.split(path.sep);
    //       let renderedHead = renderedFs;
    //       let rawHead = rawFs;

    //       for (let i = 0; i < locs.length; i++) {
    //         const l = locs[i];
    //         if (i == locs.length - 1) {
    //           renderedHead['sub'][l] = _.cloneDeep(BASE);
    //           renderedHead['sub'][l]['isDirectory'] = false;
    //           renderedHead['sub'][l]['content'] = md.render(
    //             fs.readFileSync(file, 'utf-8')
    //           );

    //           rawHead['sub'][l] = _.cloneDeep(BASE);
    //           rawHead['sub'][l]['isDirectory'] = false;
    //           rawHead['sub'][l]['content'] = fs
    //             .readFileSync(file, 'utf-8')
    //             .toString();
    //         }
    //         if (!(l in renderedHead.sub)) {
    //           renderedHead['sub'][l] = _.cloneDeep(BASE);
    //           rawHead['sub'][l] = _.cloneDeep(BASE);
    //         }
    //         renderedHead = renderedHead['sub'][l];
    //         rawHead = rawHead['sub'][l];
    //       }
    //     }
    //     fs.writeFileSync('./src/notes/notes.json', JSON.stringify(renderedFs));
    //     fs.writeFileSync('./src/notes/raw_notes.json', JSON.stringify(rawFs));
    //   });
    // },
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
