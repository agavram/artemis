import { Link, useLocation, useNavigate } from 'solid-app-router';
import { children, Component, JSX } from 'solid-js';
import { ANIMATION_DELAY } from '../helpers/Constants';

interface DelayLinkProps {
  children: JSX.Element;
  link: string;
  setShouldNavigate: (_: boolean) => void;
}

export const DelayLink = (props: DelayLinkProps) => {
  const { link, setShouldNavigate } = props;
  const navigate = useNavigate();
  const loc = useLocation();

  return (
    <Link
      href={encodeURI(link)}
      onClick={(e) => {
        setShouldNavigate(true);
        setTimeout(() => {
          navigate(encodeURI(link), { scroll: true });

          if (link == loc.pathname) {
            setShouldNavigate(false);
          }
        }, ANIMATION_DELAY);
        e.preventDefault();
      }}
    >
      {children(() => props.children)}
    </Link>
  );
};
