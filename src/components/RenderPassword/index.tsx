import React from "react";
import { PasswordStrength } from "../../helpers/evaluatePassword";

type RenderPasswordStrengthMeterProps = {
  password: string;
  passwordStrength: PasswordStrength;
};

const RenderPasswordStrengthMeter: React.FC<
  RenderPasswordStrengthMeterProps
> = ({ password, passwordStrength }) => {
  if (password.length === 0) return null;

  const strengthLabels: Record<"fraca" | "moderada" | "forte", string> = {
    fraca: "Fraca",
    moderada: "Moderada",
    forte: "Forte",
  };

  const strengthColors = {
    fraca: "bg-red-500",
    moderada: "bg-yellow-400",
    forte: "bg-green-500",
  };

  return (
    <div className="mt-1">
      <div className="text-sm">
        {
          strengthLabels[
            passwordStrength.strength as "fraca" | "moderada" | "forte"
          ]
        }
      </div>
      <div className="flex gap-1 mt-1 h-1">
        <div
          className={`w-1/3 rounded ${
            passwordStrength.strength === "fraca"
              ? strengthColors["fraca"]
              : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-1/3 rounded ${
            passwordStrength.strength === "moderada"
              ? strengthColors["moderada"]
              : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`w-1/3 rounded ${
            passwordStrength.strength === "forte"
              ? strengthColors["forte"]
              : "bg-gray-200"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default RenderPasswordStrengthMeter;
