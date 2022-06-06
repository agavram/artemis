import { splitProps } from 'solid-js';
import { Notes } from '../helpers/Interfaces';
import { BreadCrumbs } from './Breadcrumbs';

interface MarkdownRenderProps {
  notes: Notes;
  source: string;
  path: string;
  setShouldNavigate: (_: boolean) => void;
}

export const MarkdownRender = (props: MarkdownRenderProps) => {
  const [{ source, path }, others] = splitProps(props, ['source', 'path']);
  const pathSplit = path.split('/');

  return (
    <>
      <BreadCrumbs {...others} pathSplit={pathSplit}></BreadCrumbs>
      <div innerHTML={source}></div>
    </>
  );
};
