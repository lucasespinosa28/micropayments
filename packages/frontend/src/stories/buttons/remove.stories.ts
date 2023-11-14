import type { Meta, StoryObj } from "@storybook/react";
import { Remove } from "../../compoments/inputs/remove";
const meta = {
  title: "Example/Buttons",
  component: Remove,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Remove>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const X: Story = {
  args: {
    id: "button",
    onClick: click,
  },
};
