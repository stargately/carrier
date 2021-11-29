import { Meta } from "@storybook/react";
import React from "react";
import { themeDecorator } from "@/shared/common/storybook-utils";

import { ColorPicker } from "./color-picker";

export default {
  title: "ColorPicker",
  component: ColorPicker,
  decorators: [themeDecorator()],
} as Meta;

export const HexColorPicker = (): JSX.Element => {
  const [color, setColor] = React.useState("#000000");

  return <ColorPicker color={color} onChange={setColor} />;
};
