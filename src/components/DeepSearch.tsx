import { Motion, Presence } from '@motionone/solid';
import { clone, debounce, escape } from 'lodash';
import { createSignal, For, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import styles from '../App.module.css';
import {
  ANIMATION_DEFAULTS,
  ANIMATION_DELAY,
  FS_BASE,
} from '../helpers/Constants';
import { Notes } from '../helpers/Interfaces';
import raw_notes from '../notes/raw_notes.json';
import { DelayLink } from './DelayLink';

interface SearchResult {
  path: string[];
  matches: string[];
}
const [field, setField] = createSignal('');

export const DeepSearch = () => {
  const [searchResults, setSearchResults] = createStore<SearchResult[]>([]);
  const [showResults, setShouldShowResults] = createSignal(false);
  const [shouldNavigate, setShouldNavigate] = createSignal(false);

  let input: HTMLInputElement;
  onMount(() => {
    setTimeout(() => {
      setField(input.value);
      setShouldShowResults(true);
      setSearchResults(recursiveHelper());
    }, 0);
  });

  function recursiveHelper() {
    const f = field();
    let res: SearchResult[] = [];
    if (f) recursiveContentSearch(raw_notes, escape(f.toLowerCase()), res);
    return res;
  }

  function recursiveContentSearch(
    root: Notes,
    search: string,
    res: SearchResult[],
    path: string[] = []
  ) {
    path.push('/');
    for (let [k, v] of Object.entries(root.sub)) {
      path.push(k);
      if (v.isDirectory) {
        recursiveContentSearch(v, search, res, path);
      } else {
        const lines = v.content!.split('\n');
        const matches: string[] = [];

        let c = 0;
        for (let line of lines) {
          if (c > 5) break;
          line = escape(line);
          let i = line.toLowerCase().indexOf(search);
          if (i - 150 > 0) {
            line = line.substring(i - 150);
            line = '...' + line;
            i = 153;
          }
          if (i + search.length + 150 < line.length) {
            line = line.substring(0, i + search.length + 150);
            line += '...';
          }

          if (i != -1) {
            c++;
            while (i != -1) {
              let replace = `<span class="${styles.highlight}">${line.substring(
                i,
                i + search.length
              )}</span>`;
              line =
                line.substring(0, i) +
                replace +
                line.substring(i + search.length);
              i = line.indexOf(search, i + replace.length);
            }
            matches.push(line);
          }
        }

        if (matches.length) {
          const searchRes = {
            path: clone(path),
            matches,
          };
          res.push(searchRes);
        }
      }
      path.pop();
    }
    path.pop();
  }

  const search = debounce((e) => {
    setField(e.target.value);
    if (searchResults.length) {
      setShouldShowResults(false);
      setTimeout(() => {
        setSearchResults(recursiveHelper());
        setShouldShowResults(true);
      }, ANIMATION_DELAY);
    } else {
      setSearchResults(recursiveHelper());
      setShouldShowResults(true);
    }
  }, ANIMATION_DELAY);

  return (
    <div>
      <Presence>
        <Show when={!shouldNavigate()}>
          <Motion.div {...ANIMATION_DEFAULTS}>
            <h1>SEARCH ALL FILES</h1>
            <input
              ref={input!}
              type="text"
              placeholder="Search"
              value={field()}
              onInput={search}
              maxLength={50}
            />
            <div class={styles.resultsContainer}>
              <For each={searchResults.slice(0, 10)}>
                {(res, i) => {
                  const path = res.path.join('');
                  return (
                    <Presence>
                      <Show when={showResults()}>
                        <Motion {...ANIMATION_DEFAULTS}>
                          <DelayLink
                            link={FS_BASE + path}
                            setShouldNavigate={setShouldNavigate}
                          >
                            <div class={styles.result}>
                              <h4>{path}</h4>
                              <For each={res.matches}>
                                {(match, j) => <div class={styles.miniResult} innerHTML={match}></div>}
                              </For>
                            </div>
                          </DelayLink>
                        </Motion>
                      </Show>
                    </Presence>
                  );
                }}
              </For>
            </div>
          </Motion.div>
        </Show>
      </Presence>
    </div>
  );
};
