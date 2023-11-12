import { expect } from "@storybook/jest";
import { within, userEvent } from "@storybook/testing-library";
import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { AlertTranscation } from "../compoments/alert";
const meta = {
  title: "Example/AlertTranscation",
  component: AlertTranscation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"]
} satisfies Meta<typeof AlertTranscation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    message: "your approved transaction has been confirmed successfully!",
    type: "success",
    hash:faker.string.hexadecimal() as `0x${string}`
  },
};


export const Error: Story = {
    args: {
      message: "your approved transaction has been confirmed successfully!",
      type: "error",
      hash:faker.string.hexadecimal() as `0x${string}`
    },
  };