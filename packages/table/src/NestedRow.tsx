import React from 'react';
import { css, cx } from '@leafygreen-ui/emotion';
import Row, { RowProps } from './Row';
import { tdInnerDiv } from './Cell';
import { TransitionStatus } from 'react-transition-group/Transition';
import { useEffect, useRef, useState } from 'react';
import { useDarkModeContext } from './DarkModeContext';

const transitionTime = 200;

const nestedRowInitialStyle = css`
  position: relative;
  opacity: 0;
  transform-origin: 50% 0%;
  transition: ${transitionTime}ms ease-in-out;
  transition-property: outline-color, opacity;

  // This makes it so that any tall nested rows appear "below" the parents
  // This may cause issues if there are multiple levels of nesting
  // that all have more than one line of text. However this scenario is unlikely
  z-index: 0;

  & > :is(td, th) {
    transition: ${transitionTime}ms ease-in-out;
    transition-property: padding-block;

    & > ${tdInnerDiv.selector} {
      transition: ${transitionTime}ms ease-in-out;
      transition-property: min-height, max-height;
    }
  }
`;

const hiddenRowStyles = css`
  opacity: 0;
  outline-color: transparent;

  & > :is(td, th) {
    padding-block: 0;

    & > ${tdInnerDiv.selector} {
      min-height: 0px;
      max-height: 0px;
    }
  }
`;

const nestedRowTransitionStyles = (
  state: TransitionStatus,
  height?: number,
): string => {
  switch (state) {
    case 'entered':
      return css`
        opacity: 1;
        & > :is(td, th) {
          & > ${tdInnerDiv.selector} {
            --lg-cell-max-height: max(var(--lg-cell-min-height), ${height}px);
            min-height: var(--lg-cell-min-height);
            max-height: var(--lg-cell-max-height);
          }
        }
      `;
    default:
      return hiddenRowStyles;
  }
};

interface NestedRowProps extends RowProps {
  state: TransitionStatus;
}

const NestedRow = ({ ref, className, state, ...rest }: NestedRowProps) => {
  const [nestedRowHeight, setNestedRowHeight] = useState(0);
  const darkMode = useDarkModeContext();
  const nestedRowNodeRef = useRef<HTMLTableRowElement>(null);

  const calculateRowContentHeight = () => {
    if (nestedRowNodeRef && nestedRowNodeRef.current) {
      const innerSpan: HTMLSpanElement | null =
        nestedRowNodeRef.current.querySelector(`${tdInnerDiv.selector} > span`);

      if (innerSpan && innerSpan.offsetHeight) {
        setNestedRowHeight(innerSpan.offsetHeight);
      }
    }
  };

  useEffect(() => {
    calculateRowContentHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nestedRowNodeRef.current]);

  return (
    <Row
      {...rest}
      ref={nestedRowNodeRef}
      className={cx(
        nestedRowInitialStyle,
        nestedRowTransitionStyles(state, nestedRowHeight),
        {
          // TODO: Refresh - remove dark mode overrides
          [css`
            --lg-cell-min-height: 24px;
          `]: darkMode,
        },
        className,
      )}
    />
  );
};

export default NestedRow;
