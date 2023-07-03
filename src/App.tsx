import { Motion, Presence } from '@motionone/solid';
import { get } from 'lodash';
import { Navigate, Route, Routes } from 'solid-app-router';
import { Component, createSignal, JSX, onMount, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import styles from './App.module.css';
import { BreadCrumbs } from './components/Breadcrumbs';
import { DeepSearch } from './components/DeepSearch';
import { FileViewer } from './components/FileViewer';
import { MarkdownRender } from './components/MarkdownRender';
import { ANIMATION_DEFAULTS, FS_BASE } from './helpers/Constants';
import { Notes } from './helpers/Interfaces';
import notes from './notes/notes.json';

const App: Component = () => {
  const [field, setField] = createSignal('');
  const [dirs, setDirs] = createStore(notes);

  function generateRoutes(root: Notes) {
    let res: JSX.Element[] = [];
    res.push(
      <Route path="/deep-search" element={() => <DeepSearch></DeepSearch>} />
    );
    res.push(
      <Route path={'/'} element={<Navigate href={FS_BASE}></Navigate>}></Route>
    );
    generateRoutesRecursively(root, '', res);
    return res;
  }

  function generateRoutesRecursively(
    root: any,
    path: string,
    res: JSX.Element[]
  ) {
    if (root.isDirectory) {
      const p = path
        .split('/')
        .slice(1)
        .flatMap((v) => (v === '' ? 'sub' : ['sub', v]));
      let start: Notes;
      if (p.length > 1) {
        start = get(dirs, p);
      } else {
        start = dirs;
      }

      res.push(
        <Route
          path={`${FS_BASE}${path}`}
          element={() => {
            const [shouldNavigate, setShouldNavigate] = createSignal(false);
            const pathSplit = path.split('/');

            let input: HTMLInputElement;
            onMount(() => {
              setTimeout(() => {
                setField(input.value);
                recursiveSearch();
              }, 0);
            });

            return (
              <div>
                <Presence>
                  <Show when={!shouldNavigate()}>
                    <Motion.div {...ANIMATION_DEFAULTS}>
                      <BreadCrumbs
                        {...{ pathSplit, notes, setShouldNavigate }}
                      ></BreadCrumbs>
                      <input
                        type="text"
                        ref={input!}
                        value={field()}
                        placeholder="Search"
                        onInput={(e) => {
                          setField(e.currentTarget.value);
                          recursiveSearch();
                        }}
                      />
                      <FileViewer
                        {...{
                          root: start,
                          path: `${FS_BASE}${path}`,
                          setShouldNavigate,
                        }}
                      ></FileViewer>
                    </Motion.div>
                  </Show>
                </Presence>
              </div>
            );
          }}
        ></Route>
      );
      Object.entries<Notes>(root.sub).map(([k, v]) => {
        if (!v.isDirectory) {
          res.push(
            <Route
              path={`${FS_BASE}${path}/${k}`}
              element={() => {
                const [shouldNavigate, setShouldNavigate] = createSignal(false);
                return (
                  <div>
                    <Presence>
                      <Show when={!shouldNavigate()}>
                        <Motion.div {...ANIMATION_DEFAULTS}>
                          <MarkdownRender
                            source={v.content!}
                            notes={notes}
                            path={`${path}/${k}`}
                            setShouldNavigate={setShouldNavigate}
                          ></MarkdownRender>
                        </Motion.div>
                      </Show>
                    </Presence>
                  </div>
                );
              }}
            />
          );
        } else {
          generateRoutesRecursively(v, path + '/' + k, res);
        }
      });
    }
  }

  function recursiveSearch(
    root: any = notes,
    search: string = field().trim(),
    path: string[] = []
  ) {
    let hidden = true;

    path.push('sub');
    for (let [k, v] of Object.entries<any>(root.sub)) {
      path.push(k.toString());
      if (v.isDirectory) {
        if (recursiveSearch(v, search, path)) {
          setDirs(...path, { hidden: true });
        } else {
          setDirs(...path, { hidden: false });
          hidden = false;
        }
      } else if (k.toLowerCase().includes(search.toLowerCase())) {
        setDirs(...path, { hidden: false });
        hidden = false;
      } else {
        setDirs(...path, { hidden: true });
      }
      path.pop();
    }
    path.pop();

    return hidden;
  }

  return (
    <>
      <div class={styles.App}>
        <Routes>{generateRoutes(notes)}</Routes>
      </div>
    </>
  );
};

export default App;
