import type { Meta, StoryObj } from "@storybook/react";
import { ImportFile } from "../app/create/importFile";
const meta = {
  title: "Example/ImportFile",
  component: ImportFile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImportFile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {};
