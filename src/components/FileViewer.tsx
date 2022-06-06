import { For, splitProps } from 'solid-js';
import styles from '../App.module.css';
import { DocumentText, Folder } from '../assets/Icons';
import { Notes } from '../helpers/Interfaces';
import { DelayLink } from './DelayLink';

interface FileViewerProps {
  root: Notes;
  path: string;
  setShouldNavigate: (_: boolean) => void;
}

export const FileViewer = (props: FileViewerProps) => {
  const [{ root, path }, others] = splitProps(props, ['root', 'path']);

  return (
    <ul>
      <For each={Object.entries(root.sub)}>
        {([k, v]) =>
          !root.sub[k].isDirectory ? (
            <li
              class={styles.file}
              classList={{ [styles.clear]: root.sub[k].hidden }}
            >
              <DelayLink link={path + '/' + k} {...others}>
                {k}
              </DelayLink>
            </li>
          ) : (
            <>
              <li
                class={styles.file}
                classList={{ [styles.clear]: root.sub[k].hidden }}
              >
                <DelayLink link={path + '/' + k} {...others}>
                  {k}
                </DelayLink>
              </li>
              <FileViewer
                path={path + '/' + k}
                root={root.sub[k]}
                {...others}
              ></FileViewer>
            </>
          )
        }
      </For>
    </ul>
  );
};
