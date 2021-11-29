import { styled } from "onefx/lib/styletron-react";

import { colorHover } from "./color-hover";
import { colors } from "./styles/style-color";

export const Fa = styled("i", (props: Record<string, unknown>) => ({
  fontSize: "24px!important",
  ...colorHover(colors.primary),
  ...props,
}));
