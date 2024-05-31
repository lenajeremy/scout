import type { StoryObj, Meta } from "@storybook/react";
import VariableInput from "@/components/variable-input";
import Providers from "@/providers";
import { useAppDispatch } from "@/store";
import { initCollections } from "@/store/actions";
import React from "react";

const meta = {
  component: VariableInput,
  tags: ["autodocs"],
} satisfies Meta<typeof VariableInput>;

export default meta;

export const VariableInputStory = {
  render: (props) => {
    return (
      <Providers>
        <VariableInput {...props} />
      </Providers>
    );
  },
} satisfies StoryObj<typeof VariableInput>;
