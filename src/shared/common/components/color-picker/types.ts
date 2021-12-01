export type ColorInputBaseProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "size"
> & {
  color?: string;
  onChange: (newColor: string) => void;
};
