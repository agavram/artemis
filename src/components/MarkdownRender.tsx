import { Notes } from '../helpers/Interfaces';
import { BreadCrumbs } from './Breadcrumbs';

interface MarkdownRenderProps {
  notes: Notes;
  source: string;
  path: string;
  setShouldNavigate: (_: boolean) => void;
}

export const MarkdownRender = ({
  notes,
  source,
  path,
  setShouldNavigate,
}: MarkdownRenderProps) => {
  const pathSplit = path.split('/');

  return (
    <>
      <BreadCrumbs
        setShouldNavigate={setShouldNavigate}
        notes={notes}
        pathSplit={pathSplit}
      ></BreadCrumbs>
      <div innerHTML={source}></div>
    </>
  );
};
