import type { Meta, StoryObj } from "@storybook/react";
import Template from "./templates/select";

const meta = {
  title: "Example/Select",
  component: Template,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Select: Story = {};
