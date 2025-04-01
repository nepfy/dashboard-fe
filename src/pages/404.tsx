import Link from "next/link";
import "../styles/404.css";

export default function Custom404() {
  return (
    <div className="error-container font-satoshi">
      <div className="error-content">
        <div className="error-wrapper">
          <div className="error-text-container">
            <h2 className="error-title">
              Página que você procura não foi encontrada
            </h2>
            <p className="error-description">
              Verifique se o endereço está correto ou entre em contato com o
              suporte.
              <Link href="/" className="error-link">
                Voltar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
