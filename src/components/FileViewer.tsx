import { For } from 'solid-js';
import styles from '../App.module.css';
import { Notes } from '../helpers/Interfaces';
import { DelayLink } from './DelayLink';

interface FileViewerProps {
  root: Notes;
  path: string;
  setShouldNavigate: (_: boolean) => void;
}

export const FileViewer = ({
  root,
  path,
  setShouldNavigate,
}: FileViewerProps) => {
  return (
    <ul>
      <For each={Object.entries(root.sub)}>
        {([k, v]) =>
          !root.sub[k].isDirectory ? (
            <li
              class={styles.file}
              classList={{ [styles.clear]: root.sub[k].hidden }}
            >
              <DelayLink
                link={path + '/' + k}
                setShouldNavigate={setShouldNavigate}
              >
                {k}
              </DelayLink>
            </li>
          ) : (
            <>
              <li
                class={styles.file}
                classList={{ [styles.clear]: root.sub[k].hidden }}
              >
                <DelayLink
                  link={path + '/' + k}
                  setShouldNavigate={setShouldNavigate}
                >
                  {k}
                </DelayLink>
              </li>
              <FileViewer
                path={path + '/' + k}
                root={root.sub[k]}
                setShouldNavigate={setShouldNavigate}
              ></FileViewer>
            </>
          )
        }
      </For>
    </ul>
  );
};
