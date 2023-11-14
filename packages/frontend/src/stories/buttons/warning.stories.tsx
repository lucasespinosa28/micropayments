import type { Meta, StoryObj } from "@storybook/react";
import { ButtonWarning } from "../../compoments/inputs/buttons";
const meta = {
  title: "Example/Buttons",
  component: ButtonWarning,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const Warning: Story = {
  args: {
    id: "button",
    children: <p>Warning</p>,
    onClick: click,
  },
};
