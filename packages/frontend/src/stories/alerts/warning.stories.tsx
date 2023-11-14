import type { Meta, StoryObj } from "@storybook/react";
import { AlertWarning } from "../../compoments/statics/alert";
const meta = {
  title: "Example/Alert",
  component: AlertWarning,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    children: <p>Warning</p>,
  },
};
