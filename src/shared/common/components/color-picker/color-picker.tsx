import React, { useRef, FC, useState, useCallback } from "react";
import { HexColorPicker } from "react-colorful";
import { styled } from "onefx/lib/styletron-react";
import { HexColorInput } from "./hex-color-input";
import { useClickOutside } from "../hooks/use-click-outside";

/**
 * container or wrapper
 * @see https://stackoverflow.com/a/33404137/8537000
 */
const ColorPickerContainer = styled("div", {
  position: "relative",
});

const ColorPickerWrapper = styled("div", {
  display: "flex",
  alignItems: "center",
});

const SwatchPicker = styled("div", (props: { color: string }) => ({
  backgroundColor: props.color,
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "1px solid #fff",
  boxShadow: "0 0 0 1px rgba(0,0,0,0.1) inset 0 0 0 1px rgba(0,0,0,0.1)",
  cursor: "pointer",
  position: "absolute",
  left: "4px",
  zIndex: 10,
}));

export type ColorPickerProps = {
  color: string;
  onChange: (newColor: string) => void;
};

/**
 * Popover that shows a color picker for `hex` color values (support `alpha` channel).
 */
export const ColorPicker: FC<ColorPickerProps> = ({
  color,
  onChange,
}): JSX.Element => {
  const popover = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(popover, close);

  return (
    <ColorPickerContainer>
      <ColorPickerWrapper>
        <SwatchPicker color={color} onClick={open} />
        <HexColorInput
          color={color}
          onChange={onChange}
          placeholder="Type a color"
        />
      </ColorPickerWrapper>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: "0",
            borderRadius: "9px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
            zIndex: 1,
          }}
          ref={popover}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </ColorPickerContainer>
  );
};
