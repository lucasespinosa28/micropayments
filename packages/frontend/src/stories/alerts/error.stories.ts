import type { Meta, StoryObj } from "@storybook/react";
import { AlertError } from "../../compoments/statics/alert";
const meta = {
  title: "Example/Alert",
  component: AlertError,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    error: { name: "error", message: "error message" },
  },
};
