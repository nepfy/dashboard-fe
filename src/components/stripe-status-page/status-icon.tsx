import { Check, X, AlertCircle } from "lucide-react";

interface StatusIconProps {
  type: "success" | "error" | "cancel";
}

export function StatusIcon({ type }: StatusIconProps) {
  const iconConfig = {
    success: {
      icon: Check,
      bgColor: "bg-gradient-to-br from-indigo-500 to-purple-600",
      iconColor: "text-white",
    },
    error: {
      icon: X,
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      iconColor: "text-white",
    },
    cancel: {
      icon: AlertCircle,
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      iconColor: "text-white",
    },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center shadow-lg`}
    >
      <Icon className={`w-10 h-10 ${config.iconColor}`} strokeWidth={3} />
    </div>
  );
}
