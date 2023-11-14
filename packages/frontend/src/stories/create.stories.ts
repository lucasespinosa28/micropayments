import { within, userEvent } from "@storybook/testing-library";
import { InputCreator } from "../app/create/InputCreator";
import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { generateRandomHex } from "../../../contract/test/generateRandomHex";
const meta = {
  title: "Example/Creator",
  component: InputCreator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputCreator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = {
  args: {
    inputValues: [],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Create inputs", async () => {
      for (let index = 0; index < 10; index++) {
        await userEvent.click(canvas.getByTestId("add"));
      }
    });
    await step("add receiver", async () => {
      for (let index = 0; index < 10; index++) {
        await userEvent.type(
          canvas.getByTestId(`Receiver${index}`),
          generateRandomHex(),
        );
      }
    });
    await step("add amounts", async () => {
      for (let index = 0; index < 10; index++) {
        await userEvent.type(
          canvas.getByTestId(`Amount${index}`),
          faker.number.float({ min: 0.5, max: 10, precision: 0.01 }).toString(),
        );
      }
    });
    await step("add datetimne", async () => {
      for (let index = 0; index < 10; index++) {
        await userEvent.type(canvas.getByTestId(`Date${index}`), "2023-11-12");
      }
    });
  },
};
