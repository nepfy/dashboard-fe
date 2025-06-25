import ExpandIcon from "#/components/icons/ExpandIcon";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";
import TemplatePreviewWrapper, {
  useTemplateColors,
} from "#/app/gerador-de-propostas/components/TemplatePreviewWrapper";

export default function AboutBusinessPreview() {
  const { formData } = useProjectGenerator();
  const { mainColor } = useTemplateColors();

  return (
    <TemplatePreviewWrapper>
      <div className="flex flex-col justify-center items-start h-full p-8">
        <div className="max-w-4xl mx-auto w-full space-y-8">
          {/* Título da seção */}
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
              {formData?.step2?.aboutUsTitle || "Sobre Nossa Empresa"}
            </h2>
            <div
              className="w-24 h-1 mx-auto rounded-full"
              style={{ backgroundColor: mainColor }}
            />
          </div>

          {/* Conteúdo principal */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Lado esquerdo - Texto */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Nossa História
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {formData?.step2?.aboutUsSubtitle1 ||
                    "Conte aqui a história da sua empresa, como ela começou e quais são os valores que norteiam o seu trabalho."}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-white text-xl font-semibold mb-4">
                  Nossa Missão
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {formData?.step2?.aboutUsSubtitle2 ||
                    "Descreva qual é a missão da sua empresa e como vocês ajudam seus clientes a alcançar seus objetivos."}
                </p>
              </div>
            </div>

            {/* Lado direito - Informações visuais */}
            <div className="space-y-6">
              {/* Card de estatísticas */}
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Números que Impressionam
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-white mb-1"
                      style={{ color: mainColor }}
                    >
                      150+
                    </div>
                    <div className="text-white/80 text-sm">Projetos</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-white mb-1"
                      style={{ color: mainColor }}
                    >
                      98%
                    </div>
                    <div className="text-white/80 text-sm">Satisfação</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-white mb-1"
                      style={{ color: mainColor }}
                    >
                      5 anos
                    </div>
                    <div className="text-white/80 text-sm">Experiência</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-white mb-1"
                      style={{ color: mainColor }}
                    >
                      24h
                    </div>
                    <div className="text-white/80 text-sm">Suporte</div>
                  </div>
                </div>
              </div>

              {/* Card de valores */}
              <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/25">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Nossos Valores
                </h3>
                <div className="space-y-3">
                  {["Qualidade", "Inovação", "Transparência", "Resultados"].map(
                    (valor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: mainColor }}
                        />
                        <span className="text-white/90 text-sm">{valor}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de expansão */}
      <button className="absolute bottom-10 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
        <ExpandIcon width="16" height="16" />
      </button>
    </TemplatePreviewWrapper>
  );
}
