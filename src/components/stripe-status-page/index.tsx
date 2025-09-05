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
    <div className="min-h-screen bg-gray-50 relative">
      {showConfetti && <ConfettiAnimation />}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Status Icon */}
          <div className="flex justify-center">
            <StatusIcon type={type} />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            {description}
          </p>

          {/* Action Button */}
          <div className="pt-4">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200">
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
        <p className="text-xs text-gray-400 mt-2">© 2025, Nepfy.</p>
      </footer>
    </div>
  );
}
