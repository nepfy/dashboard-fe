import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CurrencyInput from "./index";

interface HarnessProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

function CurrencyInputHarness({
  initialValue = "",
  onChange,
}: HarnessProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <CurrencyInput
      value={value}
      placeholder="0,00"
      onChange={(nextValue) => {
        setValue(nextValue);
        onChange?.(nextValue);
      }}
    />
  );
}

describe("CurrencyInput", () => {
  it("formats the initial value using Brazilian Real currency convention", () => {
    render(
      <CurrencyInputHarness
        initialValue="1234.56"
      />
    );

    const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
    expect(input).toHaveValue("R$ 1.234,56");
  });

  it("keeps zero values visible without requiring focus", () => {
    render(
      <CurrencyInputHarness
        initialValue="0"
      />
    );

    const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;
    expect(input).toHaveValue("R$ 0,00");
  });

  it("normalizes user input and applies currency formatting on blur", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <CurrencyInputHarness
        initialValue=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;

    await user.click(input);
    await user.type(input, "1234,56");
    expect(input).toHaveValue("1234,56");

    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledWith("1234.56");
    await waitFor(() =>
      expect(input).toHaveValue("R$ 1.234,56")
    );
  });

  it("accepts thousand separators and currency symbol while preserving numeric meaning", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <CurrencyInputHarness
        initialValue=""
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;

    await user.click(input);
    await user.type(input, "R$ 12.345,67");

    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledWith("12345.67");
    await waitFor(() =>
      expect(input).toHaveValue("R$ 12.345,67")
    );
  });

  it("flags invalid values and restores the previous value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <CurrencyInputHarness
        initialValue="500"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("0,00") as HTMLInputElement;

    // initial formatting after mount
    expect(input).toHaveValue("R$ 500,00");

    await user.click(input);
    await user.clear(input);
    await user.type(input, "abc");

    fireEvent.blur(input);

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByText("Valor inválido")).toBeInTheDocument();
    expect(input).toHaveValue("R$ 500,00");
  });
});

