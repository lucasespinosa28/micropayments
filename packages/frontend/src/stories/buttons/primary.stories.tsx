import type { Meta, StoryObj } from "@storybook/react";
import { ButtonPrimary } from "../../compoments/inputs/buttons";
const meta = {
  title: "Example/Buttons",
  component: ButtonPrimary,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonPrimary>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const Primary: Story = {
  args: {
    id: "button",
    children: <p>Primary</p>,
    onClick: click,
  },
};
