import type { Meta, StoryObj } from "@storybook/react";
import { ButtonSecondary } from "../../compoments/inputs/buttons";
const meta = {
  title: "Example/Buttons",
  component: ButtonSecondary,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonSecondary>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const Secondary: Story = {
  args: {
    id: "button",
    children: <p>Secondary</p>,
    onClick: click,
  },
};
