import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { createDataProp, getNodeTextContent } from '@leafygreen-ui/lib';
import { cx } from '@leafygreen-ui/emotion';
import { useUsingKeyboardContext } from '@leafygreen-ui/leafygreen-provider';
import Box, { BoxProps, ExtendableBox } from '@leafygreen-ui/box';
import {
  menuItemContainerStyle,
  menuItemContainerThemeStyle,
  activeMenuItemContainerStyle,
  disabledMenuItemContainerThemeStyle,
  focusedMenuItemContainerStyle,
  linkStyle,
  disabledTextStyle,
  mainIconStyle,
  activeIconStyle,
  disabledIconStyle,
  titleTextStyle,
  activeTitleTextStyle,
  descriptionTextThemeStyle,
  linkDescriptionTextStyle,
  activeDescriptionTextStyle,
  textContainer,
  menuItemHeight,
  getFocusedStyles,
  getHoverStyles,
} from './styles';
import { Size } from './types';
import MenuContext from './MenuContext';

const menuItemContainer = createDataProp('menu-item-container');
interface BaseMenuItemProps {
  /**
   * Determines whether or not the MenuItem is active.
   */
  active?: boolean;

  /**
   * Description element displayed below title in MenuItem.
   */
  description?: React.ReactNode;

  /**
   * Determines whether or not the MenuItem is disabled.
   */
  disabled?: boolean;

  /**
   * Slot to pass in an Icon rendered to the left of `MenuItem` text.
   */
  glyph?: React.ReactElement;

  /**
   * Size of the MenuItem component, can be `default` or `large`
   */
  size?: Size;

  /**
   * className applied to  `li` element
   */
  className?: string;

  /**
   * Content to appear inside of `<MenuItem />` component
   */
  children?: React.ReactNode;

  href?: string;
}

const MenuItem: ExtendableBox<
  BaseMenuItemProps & { ref?: React.Ref<any> },
  'button'
> = React.forwardRef(
  (
    {
      disabled = false,
      active = false,
      size = Size.Default,
      className,
      children,
      description,
      glyph,
      ...rest
    }: BaseMenuItemProps,
    ref: React.Ref<any>,
  ) => {
    const { theme } = useContext(MenuContext);
    const { usingKeyboard: showFocus } = useUsingKeyboardContext();
    const hoverStyles = getHoverStyles(menuItemContainer.selector, theme);
    const focusStyles = getFocusedStyles(menuItemContainer.selector, theme);

    const isAnchor = typeof rest.href === 'string';

    const updatedGlyph =
      glyph &&
      React.cloneElement(glyph, {
        role: 'presentation',
        className: cx(
          mainIconStyle,
          {
            [activeIconStyle[theme]]: active,
            [focusStyles.iconStyle]: showFocus,
            [disabledIconStyle[theme]]: disabled,
          },
          glyph.props?.className,
        ),
      });

    const boxProps = {
      ...menuItemContainer.prop,
      ref,
      role: 'menuitem',
      tabIndex: disabled ? -1 : undefined,
      'aria-disabled': disabled,
      'aria-current': active ?? undefined,
      // only add a disabled prop if not an anchor
      ...(!isAnchor && { disabled }),
    };

    const anchorProps = isAnchor
      ? {
          target: '_self',
          rel: '',
        }
      : {};

    const content = (
      <>
        {updatedGlyph}
        <div className={textContainer}>
          <div
            // Add text as data attribute to ensure no layout shift on hover
            data-text={getNodeTextContent(children)}
            className={cx(titleTextStyle, hoverStyles.text, {
              [activeTitleTextStyle[theme]]: active,
              [hoverStyles.activeText]: active,
              [disabledTextStyle[theme]]: disabled,
              [focusStyles.textStyle]: showFocus,
            })}
          >
            {children}
          </div>
          {description && (
            <div
              className={cx(descriptionTextThemeStyle[theme], {
                [activeDescriptionTextStyle[theme]]: active,
                [disabledTextStyle[theme]]: disabled,
                [focusStyles.descriptionStyle]: showFocus,
                [linkDescriptionTextStyle]: typeof rest.href === 'string',
              })}
            >
              {description}
            </div>
          )}
        </div>
      </>
    );

    const as = isAnchor ? 'a' : 'button';

    return (
      <li role="none">
        <Box
          as={as}
          {...boxProps}
          {...anchorProps}
          {...rest}
          className={cx(
            menuItemContainerStyle,
            menuItemContainerThemeStyle[theme],
            menuItemHeight(size),
            linkStyle,
            {
              [activeMenuItemContainerStyle[theme]]: active,
              [disabledMenuItemContainerThemeStyle[theme]]: disabled,
              [focusedMenuItemContainerStyle[theme]]: showFocus,
            },
            className,
          )}
        >
          {content}
        </Box>
      </li>
    );
  },
);

MenuItem.displayName = 'MenuItem';

MenuItem.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  description: PropTypes.node,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.node,
};

export default MenuItem;

export type MenuItemElement = React.ReactComponentElement<
  typeof MenuItem,
  BoxProps<'button', BaseMenuItemProps & { ref?: React.Ref<any> }>
>;
