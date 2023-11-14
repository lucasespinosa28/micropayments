import type { Meta, StoryObj } from "@storybook/react";
import { ButtonWarning } from "../../compoments/inputs/buttons";
import Countdown from "react-countdown";
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

export const Timer: Story = {
  args: {
    id: "button",
    children: <Countdown date={Date.now() + 1000 ** 3} />,
    onClick: click,
  },
};
