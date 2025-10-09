export const ColorPicker = ({
  colors,
  selectedColor,
  onColorSelect,
}: {
  colors: string[];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}) => (
  <div className="flex items-center gap-2">
    {colors.map((color) => (
      <div
        key={color}
        className={`h-6 w-6 rounded-2xs cursor-pointer border p-0.5 flex items-center justify-center ${
          selectedColor === color
            ? "border-primary-light-400"
            : "border-transparent"
        }`}
        onClick={() => onColorSelect(color)}
      >
        <div
          className="h-5 w-6 rounded-md"
          style={{ backgroundColor: color }}
        />
      </div>
    ))}
  </div>
);
