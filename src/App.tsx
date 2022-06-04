import _ from 'lodash';
import { Route, Routes, useLocation } from 'solid-app-router';
import { Component, createSignal, JSX, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import styles from './App.module.css';
import { FileViewer } from './components/FileViewer';
import { MarkdownRender } from './components/MarkdownRender';
import { Notes } from './helpers/Interfaces';
import notes from './notes/notes.json';
import { Motion, Presence } from '@motionone/solid';
import { BreadCrumbs } from './components/Breadcrumbs';

const App: Component = () => {
  const [field, setField] = createSignal('');
  const [dirs, setDirs] = createStore(notes);

  function generateRoutes(root: Notes) {
    let res: JSX.Element[] = [];
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
        start = _.get(dirs, p);
      } else {
        start = dirs;
      }

      res.push(
        <Route
          path={path}
          element={() => {
            const [shouldNavigate, setShouldNavigate] = createSignal(false);
            const pathSplit = path.split('/');

            return (
              <div>
                <Presence>
                  <Show when={!shouldNavigate()}>
                    <Motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h1>{useLocation().pathname}</h1>
                      <BreadCrumbs
                        pathSplit={pathSplit}
                        notes={notes}
                        setShouldNavigate={setShouldNavigate}
                      ></BreadCrumbs>
                      <input
                        type="text"
                        value={field()}
                        placeholder="Search"
                        onInput={(e) => {
                          setField(e.target.value);
                          recursiveSearch(notes, field().trim());
                        }}
                      />
                      <FileViewer
                        root={start}
                        path={path}
                        setShouldNavigate={setShouldNavigate}
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
              path={path + '/' + k}
              element={() => {
                const [shouldNavigate, setShouldNavigate] = createSignal(false);
                return (
                  <div>
                    <Presence>
                      <Show when={!shouldNavigate()}>
                        <Motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MarkdownRender
                            source={v.content!}
                            notes={notes}
                            path={path + '/' + k}
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

  function recursiveSearch(root: any, search: string, path: string[] = []) {
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
