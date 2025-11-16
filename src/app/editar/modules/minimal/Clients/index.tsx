"use client";

import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";
import type { ClientsSection } from "#/types/template-data";

interface MinimalClientsProps extends ClientsSection {}

export default function MinimalClients({
  hideSection,
  title,
  description,
  paragraphs,
  items,
}: MinimalClientsProps) {
  const { updateClients, activeEditingId } = useEditor();
  const canEdit = activeEditingId === null;

  if (hideSection) {
    return null;
  }

  const safeParagraphs = paragraphs && paragraphs.length > 0 ? paragraphs : ["", ""];

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...safeParagraphs];
    updated[index] = value;
    updateClients({ paragraphs: updated });
  };

  const handleLogoNameChange = (id: string | undefined, value: string, sortOrder?: number) => {
    if (!items) return;
    const updated = items.map((logo) =>
      logo.id === id
        ? {
            ...logo,
            name: value,
          }
        : logo
    );
    updateClients({ items: updated });
  };

  const logos = items && items.length > 0 ? items : [];

  return (
    <>
      <style jsx global>{`
        .section_partners {
          background-color: #fbfbfb;
          color: #040404;
          padding: 8rem 0;
        }

        .partners-component {
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .partners-heading {
          max-width: 980px;
          padding-bottom: 2rem;
        }

        .partners-paragraph {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 1rem;
          max-width: 100%;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .partners-logo {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dcdcdc;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .partners-logo .logo-embed {
          width: 100%;
          max-width: 120px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .partners-logo .logo-text {
          font-size: 1.1rem;
        }

        @media screen and (max-width: 991px) {
          .section_partners {
            padding: 6rem 0;
          }
        }

        @media screen and (max-width: 767px) {
          .section_partners {
            padding: 5rem 0;
          }
          .partners-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
      <section className="section_partners section_partners--dynamic">
        <div className="padding-global">
          <div className="container-large">
            <div className="partners-component">
              <div className="partners-heading">
                <EditableText
                  value={title || "Empresas que já confiaram no nosso trabalho"}
                  onChange={(newTitle) => updateClients({ title: newTitle })}
                  editingId="clients-title"
                  className="heading-style-h2 text-weight-normal"
                  canEdit={canEdit}
                />
                <EditableText
                  value={
                    description ||
                    "Construímos parcerias de longo prazo com empresas que valorizam estratégia, clareza e performance."
                  }
                  onChange={(newDescription) =>
                    updateClients({ description: newDescription })
                  }
                  editingId="clients-description"
                  className="text-size-medium text-weight-light mt-4 block max-w-[42rem]"
                  canEdit={canEdit}
                />
              </div>
              <div className="partners-paragraph">
                <div className="flex max-w-[45rem] flex-col items-end justify-end gap-6">
                  <EditableText
                    value={
                      safeParagraphs[0] ||
                      "Na União Co., cuidamos dos bastidores da sua presença online com o mesmo cuidado que você dedica aos seus clientes."
                    }
                    onChange={(value) => handleParagraphChange(0, value)}
                    editingId="clients-paragraph-1"
                    className="text-size-medium text-right"
                    canEdit={canEdit}
                  />
                  <EditableText
                    value={
                      safeParagraphs[1] ||
                      "Unimos estratégia, design e performance para transformar sua comunicação em uma ferramenta poderosa de atração e relacionamento."
                    }
                    onChange={(value) => handleParagraphChange(1, value)}
                    editingId="clients-paragraph-2"
                    className="text-size-medium text-right"
                    canEdit={canEdit}
                  />
                </div>
              </div>
              <div className="partners-grid">
                {logos.length > 0 ? (
                  logos
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map((logo) => (
                      <div className="partners-logo" key={logo.id || logo.name}>
                        <span className="logo-embed w-embed flex max-h-[50px] max-w-[100px] items-center justify-center overflow-hidden">
                          <img
                            src="/images/templates/flash/placeholder.png"
                            alt=""
                            className="logo-img hidden"
                          />
                          <EditableText
                            value={logo.name}
                            onChange={(value) =>
                              handleLogoNameChange(
                                logo.id,
                                value,
                                logo.sortOrder
                              )
                            }
                            editingId={`clients-logo-${logo.id}`}
                            className="logo-text text-center text-[1.1rem] font-medium uppercase tracking-wide"
                            canEdit={canEdit}
                          />
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="partners-logo">
                    <span className="text-size-medium text-weight-light">
                      Adicione marcas na seção Clients
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

