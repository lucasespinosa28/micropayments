import type { Meta, StoryObj } from "@storybook/react";
import { ButtonError } from "../../compoments/inputs/buttons";
const meta = {
  title: "Example/Buttons",
  component: ButtonError,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ButtonError>;

export default meta;
type Story = StoryObj<typeof meta>;

function click() {
  alert("click!");
}

export const Error: Story = {
  args: {
    id: "button",
    children: <p>Error</p>,
    onClick: click,
  },
};
