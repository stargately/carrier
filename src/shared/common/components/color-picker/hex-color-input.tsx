import React, { FC, useCallback } from "react";
import { ColorInput } from "./color-input";
import { ColorInputBaseProps } from "./types";
import { isValidHex } from "./utils";

type HexColorInputProps = ColorInputBaseProps;

const prefix = (value: string) => `#${value}`;

/**
 * the color input component also supports `alpha` channel and prefix default.
 */
export const HexColorInput: FC<HexColorInputProps> = ({
  ...rest
}): JSX.Element => {
  // escape all non-hexdecimal characters including #.
  const escape = useCallback(
    (value: string) => value.replace(/[^0-9A-F]/gi, "").substr(0, 8),
    []
  );

  // validate hexidecimal strings.
  const validate = useCallback((value: string) => isValidHex(value, true), []);

  return (
    <ColorInput
      {...rest}
      escape={escape}
      format={prefix}
      process={prefix}
      validate={validate}
    />
  );
};
