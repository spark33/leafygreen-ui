import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { cx } from '@leafygreen-ui/emotion';
import { useIdAllocator, useValidation } from '@leafygreen-ui/hooks';
import {
  Description,
  Label,
  bodyTypeScaleStyles,
  useUpdatedBaseFontSize,
} from '@leafygreen-ui/typography';
import Warning from '@leafygreen-ui/icon/dist/Warning';
import { State, TextAreaProps } from './types';
import {
  containerStyles,
  textAreaStyle,
  colorSets,
  errorMessageStyle,
  errorIconStyle,
  errorMessageLabelStyles,
} from './styles';
import { useDarkMode } from '@leafygreen-ui/leafygreen-provider';

/**
 * # TextArea
 *
 * TextArea component
 *
 * ```
<TextArea label='Input Label' onChange={() => execute when value of input field changes}/>
```
 * @param props.id ID associated with the TextArea component.
 * @param props.label Text shown in bold above the input element.
 * @param props.description Text that gives more detail about the requirements for the input.
 * @param props.disabled Whether or not the field is currently disabled.
 * @param props.onChange Callback to be executed when the value of the input field changes.
 * @param props.onBlur Callback to be executed when the input stops being focused.
 * @param props.placeholder The placeholder text shown in the input field before the user begins typing.
 * @param props.errorMessage The error message shown below the input element if the value is invalid.
 * @param props.state The current state of the TextArea. This can be `none` or `error`.
 * @param props.value The current value of the input field. If a value is passed to this prop, component will be controlled by consumer.
 * @param props.className ClassName supplied to the TextArea container.
 * @param props.darkMode Determines whether or not the component appears in dark theme.
 * @param props.handleValidation Validation callback used to validate input.
 * @param props.baseFontSize Override the global `baseFontSize` set in LeafygreenProvider. This will only change the font size of the input text, not the label or description.
 */

const TextArea: React.ComponentType<React.PropsWithRef<TextAreaProps>> =
  React.forwardRef(function TextArea(
    {
      label,
      description,
      className,
      errorMessage,
      darkMode: darkModeProp,
      disabled = false,
      state = State.None,
      id: idProp,
      value: controlledValue,
      onChange,
      onBlur,
      handleValidation,
      'aria-labelledby': ariaLabelledby,
      baseFontSize: baseFontSizeProp,
      ...rest
    }: TextAreaProps,
    forwardedRef: React.Ref<HTMLTextAreaElement>,
  ) {
    const baseFontSize = useUpdatedBaseFontSize(baseFontSizeProp);
    const errorBaseFontSize = useUpdatedBaseFontSize();
    const id = useIdAllocator({ prefix: 'textarea', id: idProp });
    const { darkMode, theme } = useDarkMode(darkModeProp);

    const isControlled = typeof controlledValue === 'string';
    const [uncontrolledValue, setValue] = useState('');
    const value = isControlled ? controlledValue : uncontrolledValue;

    // Validation
    const validation = useValidation<HTMLTextAreaElement>(handleValidation);

    const onBlurHandler: React.FocusEventHandler<HTMLTextAreaElement> = e => {
      if (onBlur) {
        onBlur(e);
      }

      validation.onBlur(e);
    };

    const onValueChange: React.ChangeEventHandler<HTMLTextAreaElement> = e => {
      if (onChange) {
        onChange(e);
      }

      if (!isControlled) {
        setValue(e.target.value);
      }

      validation.onChange(e);
    };

    if (!label && !ariaLabelledby) {
      console.error(
        'For screen-reader accessibility, label or aria-labelledby must be provided to TextArea.',
      );
    }

    return (
      <div className={cx(containerStyles, className)}>
        {label && (
          <Label darkMode={darkMode} htmlFor={id} disabled={disabled}>
            {label}
          </Label>
        )}
        {description && (
          <Description darkMode={darkMode} disabled={disabled}>
            {description}
          </Description>
        )}
        <textarea
          {...rest}
          ref={forwardedRef}
          title={label != null ? label : undefined}
          id={id}
          className={cx(
            textAreaStyle,
            bodyTypeScaleStyles[baseFontSize],
            colorSets[theme].textArea,
            {
              [colorSets[theme].errorBorder]:
                state === State.Error && !disabled,
            },
          )}
          disabled={disabled}
          onChange={onValueChange}
          onBlur={onBlurHandler}
          value={value}
        />
        {!disabled && state === State.Error && errorMessage && (
          <div className={cx(errorMessageStyle, colorSets[theme].errorMessage)}>
            <Warning className={errorIconStyle} />
            <label
              className={cx(
                bodyTypeScaleStyles[errorBaseFontSize],
                errorMessageLabelStyles,
              )}
            >
              {errorMessage}
            </label>
          </div>
        )}
      </div>
    );
  });

TextArea.displayName = 'TextArea';

TextArea.propTypes = {
  id: PropTypes.string,
  darkMode: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  errorMessage: PropTypes.string,
  state: PropTypes.oneOf(Object.values(State)),
};

export default TextArea;
