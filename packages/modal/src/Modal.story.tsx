import React, { useState } from 'react';
import Button from '@leafygreen-ui/button';
import { css } from '@leafygreen-ui/emotion';
import Modal from '.';
import { Select, Option, OptionGroup } from '@leafygreen-ui/select';
import { Subtitle, Body } from '@leafygreen-ui/typography';
import Copyable from '@leafygreen-ui/copyable';
import Code from '@leafygreen-ui/code';
import { ComponentStory, Meta } from '@storybook/react';
import { ModalProps } from './Modal';

export default {
  title: 'Components/Modals/Modal',
  component: Modal,
  argTypes: {
    open: {
      control: false,
    },
    setOpen: {
      control: false,
    },
    children: {
      control: false,
    },
  },
} as Meta<typeof Modal>;

const ControlledTemplate: ComponentStory<typeof Modal> = (args: ModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(!open)}>Open Modal</Button>
      <Modal {...args} open={open} setOpen={setOpen} />
    </>
  );
};

export const Controlled = ControlledTemplate.bind({});
Controlled.args = {
  children: (
    <>
      <Subtitle>Base modal</Subtitle>
      <Body>Modal Content goes here.</Body>
    </>
  ),
};

export const Scroll = ControlledTemplate.bind({});
Scroll.args = {
  children: (
    <div
      className={css`
        height: 200vh;
      `}
    >
      Modal Content goes here.
    </div>
  ),
};

export const Interactive = ControlledTemplate.bind({});
Interactive.args = {
  children: (
    <div>
      <Button>Click me, I will not close the modal!</Button>
    </div>
  ),
};

export const DefaultSelect = (args: ModalProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('cat');
  const [valueB, setValueB] = useState('smallCat');

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Open Modal</Button>
      <Modal {...args} open={open} setOpen={setOpen}>
        <div>Modal Content goes here.</div>

        <div>
          <Select
            label="label"
            size="small"
            placeholder="lala"
            name="pets"
            value={value}
            onChange={setValue}
            usePortal={true}
          >
            <OptionGroup label="Common">
              <Option value="dog">Dog</Option>
              <Option value="cat">Cat</Option>
            </OptionGroup>
          </Select>
        </div>

        <div>
          <Select
            label="label2"
            size="small"
            placeholder="second one"
            name="cats"
            value={valueB}
            onChange={setValueB}
            usePortal={true}
          >
            <OptionGroup label="Common">
              <Option value="smallCat">smallCat</Option>
              <Option value="largeCat">largeCat</Option>
              <Option value="mediumCat">mediumCat</Option>
            </OptionGroup>
          </Select>
        </div>
      </Modal>
    </>
  );
};

export function CopyableModal(args: ModalProps) {
  const [open, setOpen] = useState(false);

  const jsSnippet = `

const myVar = 42;

var myObj = {
  someProp: ['arr', 'ay'],
  regex: /([A-Z])w+/
}

export default class myClass {
  constructor(){
    // access properties
    this.myProp = false
  }
}

function greeting(entity) {
  return \`Hello, \${entity}! Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper.\`;
}
 
console.log(greeting('World'));

`;

  return (
    <>
      <Button onClick={() => setOpen(!open)}>Open Modal</Button>
      <Modal {...args} open={open} setOpen={setOpen}>
        <div>Modal Content goes here.</div>
        <Copyable>Hello world in a modal</Copyable>

        <Code copyable={true} language="javascript">
          {jsSnippet}
        </Code>
      </Modal>
    </>
  );
}
