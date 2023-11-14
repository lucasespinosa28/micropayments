import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../compoments/inputs/Input";
const meta = {
  title: "Example/Inputs",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const DateTime: Story = {
  args: {
    id: "button",
    children: <p>Primary</p>,
    onClick: click,
  },
};
