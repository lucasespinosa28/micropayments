import type { Meta, StoryObj } from "@storybook/react";
import { AlertLoading } from "../../compoments/statics/alert";
const meta = {
  title: "Example/Alert",
  component: AlertLoading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    children: <p>Loading...</p>,
  },
};
