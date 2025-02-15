import React from 'react';
import Badge, { Variant } from '@leafygreen-ui/badge';
import LiveExample, { KnobsConfigInterface } from 'components/live-example';

const knobsConfig: KnobsConfigInterface<{
  variant: Variant;
  children: string;
  darkMode: boolean;
}> = {
  variant: {
    type: 'select',
    options: Object.values(Variant),
    default: Variant.Blue,
    label: 'Variant',
  },
  children: {
    type: 'text',
    default: 'Sandbox',
    label: 'Children',
  },
  darkMode: {
    type: 'boolean',
    default: false,
    label: 'Dark Mode',
  },
};

export default function BadgeLiveExample() {
  return (
    <LiveExample knobsConfig={knobsConfig}>
      {props => <Badge {...props} />}
    </LiveExample>
  );
}
