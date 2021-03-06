import _ from 'lodash';
import { For, splitProps } from 'solid-js';
import styles from '../App.module.css';
import { Home, ChevronRight } from '../assets/Icons';
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
          return (
            <>
              <span
                tabindex="0"
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={(e) => e.target.focus()}
              >
                <div class={styles.drop}>
                  <For
                    each={Object.keys(
                      _.get(
                        notes,
                        interleave(pathSplit.slice(1, i() + 1), 'sub')
                      )
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
                          {k}
                        </DelayLink>
                      </li>
                    )}
                  </For>
                </div>
                <span>{l}</span>
              </span>
              {i() != pathSplit.length - 1 ? (
                <ChevronRight></ChevronRight>
              ) : (
                <></>
              )}
            </>
          );
        }}
      </For>
    </div>
  );
};
