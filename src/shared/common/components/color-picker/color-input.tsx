import Input from "antd/lib/input";
import React, {
  FC,
  useState,
  FocusEvent,
  useCallback,
  ChangeEvent,
  useEffect,
} from "react";
import { useEventCallback } from "../hooks/use-event-callback";
import { ColorInputBaseProps } from "./types";

type ColorInputProps = ColorInputBaseProps & {
  /** block typing invalid characters and limits string length */
  escape: (value: string) => string;
  /** check if the input is valid color string */
  validate: (value: string) => boolean;
  /** format value before displaying it in the input */
  format?: (value: string) => string;
  /** process value before sending it in `onChange` */
  process?: (value: string) => string;
};

export const ColorInput: FC<ColorInputProps> = (props): JSX.Element => {
  const {
    color = "",
    onChange,
    onBlur,
    escape,
    validate,
    format,
    process,
    ...rest
  } = props;
  const [value, setValue] = useState(() => escape(color));
  const onChangeCallback = useEventCallback<string>(onChange);
  const onBlurCallback = useEventCallback<FocusEvent<HTMLInputElement>>(onBlur);

  // trigger `onChange` handler only if the input value is valid color.
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = escape(e.target.value);
      setValue(inputValue);
      if (validate(inputValue)) {
        onChangeCallback(process ? process(inputValue) : inputValue);
      }
    },
    [escape, onChangeCallback, process, validate]
  );

  // take the color from props if the input value is invalid color.
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (!validate(e.target.value)) {
        setValue(escape(color));
        onBlurCallback(e);
      }
    },
    [color, escape, onBlurCallback, validate]
  );

  // update the local state if the `color` is changed.
  useEffect(() => {
    setValue(escape(color));
  }, [color, escape]);

  return (
    <Input
      {...rest}
      value={format ? format(value) : value}
      spellCheck="false"
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ paddingLeft: "32px" }}
    />
  );
};
