import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { AlertTranscation } from "../../compoments/statics/alert";
const meta = {
  title: "Example/Alert",
  component: AlertTranscation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AlertTranscation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sucess: Story = {
  args: {
    status: "success",
    hash: faker.string.hexadecimal({
      length: { min: 40, max: 100 },
    }) as `0x${string}`,
  },
};

export const Reverted: Story = {
  args: {
    status: "reverted",
    hash: faker.string.hexadecimal({
      length: { min: 40, max: 100 },
    }) as `0x${string}`,
  },
};
