import { computePosition, shift } from '@floating-ui/dom';
import { get, truncate } from 'lodash';
import { For, onMount, splitProps } from 'solid-js';
import styles from '../App.module.css';
import { ChevronRight, Home } from '../assets/Icons';
import { FS_BASE } from '../helpers/Constants';
import { interleave } from '../helpers/Functions';
import { Notes } from '../helpers/Interfaces';
import { DelayLink } from './DelayLink';

interface BreadCrumbsProps {
  pathSplit: string[];
  notes: Notes;
  setShouldNavigate: (_: boolean) => void;
}

export const BreadCrumbs = (props: BreadCrumbsProps) => {
  const [{ pathSplit, notes, setShouldNavigate }, others] = splitProps(props, [
    'pathSplit',
    'notes',
    'setShouldNavigate',
  ]);

  if (pathSplit.length <= 1) {
    return <h1>NOTES</h1>;
  }

  return (
    <div class={styles.crumbIndicator}>
      <DelayLink link={FS_BASE} setShouldNavigate={setShouldNavigate}>
        <Home></Home>
      </DelayLink>
      <For each={pathSplit.slice(1)}>
        {(l, i) => {
          let anchor: HTMLSpanElement;
          let popup: HTMLDivElement;

          onMount(() => {
            computePosition(anchor, popup, {
              middleware: [shift({ padding: 12 })],
            }).then(({ x, y }) => {
              Object.assign(popup.style, {
                left: `${x}px`,
                top: `${y}px`,
              });
            });
          });

          return (
            <>
              <span
                tabindex="0"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={(e) => e.target.focus()}
                class={styles.crumbItem}
                ref={anchor}
              >
                <div class={styles.drop} ref={popup}>
                  <For
                    each={Object.keys(
                      get(notes, interleave(pathSplit.slice(1, i() + 1), 'sub'))
                    )}
                  >
                    {(k, j) => (
                      <li>
                        <DelayLink
                          link={
                            FS_BASE +
                            pathSplit.slice(0, i() + 1).join('/') +
                            '/' +
                            k
                          }
                          setShouldNavigate={setShouldNavigate}
                        >
                          {truncate(k, { length: 24, separator: ' ' })}
                        </DelayLink>
                      </li>
                    )}
                  </For>
                </div>
                {truncate(l, { length: 24, separator: ' ' })}
                <ChevronRight></ChevronRight>
              </span>
            </>
          );
        }}
      </For>
    </div>
  );
};
