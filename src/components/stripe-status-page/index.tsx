import { ConfettiAnimation } from "./confetti-animation";
import { StatusIcon } from "./status-icon";

interface StripeStatusPageProps {
  type: "success" | "error" | "cancel";
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  showConfetti?: boolean;
}

export function StripeStatusPage({
  type,
  title,
  description,
  buttonText,
  buttonHref,
  showConfetti = false,
}: StripeStatusPageProps) {
  return (
    <div className="relative min-h-screen bg-white">
      {showConfetti && <ConfettiAnimation />}

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center">
            <StatusIcon type={type} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base leading-relaxed text-gray-600 md:text-lg">
            {description}
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <button className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl">
              <a href={buttonHref}>{buttonText}</a>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-gray-500">
          Enviamos o recibo para seu e-mail de cadastro.
        </p>
        <p className="mt-2 text-xs text-gray-400">© 2025, Nepfy.</p>
      </footer>
    </div>
  );
}
