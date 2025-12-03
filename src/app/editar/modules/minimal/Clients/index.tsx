"use client";

import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";
import type { ClientsSection, Client } from "#/types/template-data";
import ClientsGrid from "./clientsGrid";

interface MinimalClientsProps extends ClientsSection {
  canEdit?: boolean;
}

export default function MinimalClients({
  hideSection,
  subtitle,
  hideSubtitle,
  title,
  hideTitle,
  description,
  hideDescription,
  paragraphs,
  items,
}: MinimalClientsProps) {
  const { updateClients, activeEditingId } = useEditor();
  const canEdit = activeEditingId === null;

  if (hideSection) {
    return null;
  }

  const safeParagraphs =
    paragraphs && paragraphs.length > 0 ? paragraphs : ["", ""];

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...safeParagraphs];
    updated[index] = value;
    updateClients({ paragraphs: updated });
  };

  const handleLogoNameChange = (
    id: string | undefined,
    value: string,
    sortOrder?: number
  ) => {
    if (!items) return;
    const updated = items.map((logo) =>
      logo.id === id
        ? {
            ...logo,
            name: value,
            sortOrder: sortOrder,
          }
        : logo
    );
    updateClients({ items: updated });
  };

  const reorderClients = (clients: Client[]) => {
    updateClients({ items: clients });
  };

  const logos = items && items.length > 0 ? items : [];

  // DEBUG: Log to understand why only 4 clients show
  console.log('🐛 MinimalClients Debug:', {
    itemsProp: items?.length || 0,
    logosLength: logos.length,
    hideSection,
    hideSubtitle,
    firstItemName: items?.[0]?.name,
  });

  const logoDefaults =
    logos.length === 0
      ? [
          { id: "1", name: "Ino", sortOrder: 1 },
          { id: "2", name: "Circle", sortOrder: 2 },
          { id: "3", name: "Nova", sortOrder: 3 },
          { id: "4", name: "Acme", sortOrder: 4 },
        ]
      : logos;

  return (
    <>
      <style jsx global>{`
        .section_partners {
          background-color: #fff;
          color: #000;
          padding: 8rem 0;
        }

        .w-layout-grid {
          grid-row-gap: 16px;
          grid-column-gap: 16px;
          grid-template-rows: auto auto;
          grid-template-columns: 1fr 1fr;
          grid-auto-columns: 1fr;
          display: grid;
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

        .partners-subtitle {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 1em;
          font-weight: 500;
          color: #000;
          opacity: 0.6;
          margin-bottom: 1rem;
        }

        .partners-paragraph {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 1rem;
          max-width: 100%;
          font-size: 1.25rem;
          line-height: 1.5;
          color: #000;
        }

        .partners-grid {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .partners-logo {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: whitesmoke;
          transition: all 0.2s ease;
          max-width: 228px;
          max-height: 228px;
        }

        .partners-logo:hover {
          background: #e7e9ec;
        }

        .partners-logo .logo-embed {
          width: 100%;
          max-width: 80px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .partners-logo .logo-text {
          font-size: 0.75rem;
          line-height: 1.2;
          color: #000;
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
            gap: 0.75rem;
          }
        }

        @media screen and (min-width: 768px) and (max-width: 991px) {
          .partners-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          }
        }
      `}</style>
      <section className="section_partners section_partners--dynamic">
        <div className="padding-global">
          <div className="container-large">
            <div className="partners-component">
              <div className="partners-heading">
                {!hideSubtitle && (
                  <EditableText
                    value={subtitle || "PARCEIROS QUE CONFIAM"}
                    onChange={(newSubtitle) =>
                      updateClients({ subtitle: newSubtitle })
                    }
                    editingId="clients-subtitle"
                    className="partners-subtitle"
                    canEdit={canEdit}
                  />
                )}
                {!hideTitle && (
                  <EditableText
                    value={
                      title || "Marcas que já confiaram no nosso trabalho"
                    }
                    onChange={(newTitle) =>
                      updateClients({ title: newTitle })
                    }
                    editingId="clients-title"
                    className="heading-style-h2 text-weight-normal"
                    canEdit={canEdit}
                  />
                )}
                {!hideDescription && (
                  <EditableText
                    value={
                      description ||
                      "Construímos parcerias de longo prazo com empresas que valorizam estratégia, clareza e performance."
                    }
                    onChange={(newDescription) =>
                      updateClients({ description: newDescription })
                    }
                    editingId="clients-description"
                    className="mt-4 block max-w-[42rem] text-4xl text-black opacity-80"
                    canEdit={canEdit}
                  />
                )}
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
                    className="text-size-medium text-start text-black opacity-70"
                    canEdit={canEdit}
                  />
                  <EditableText
                    value={
                      safeParagraphs[1] ||
                      "Unimos estratégia, design e performance para transformar sua comunicação em uma ferramenta poderosa de atração e relacionamento."
                    }
                    onChange={(value) => handleParagraphChange(1, value)}
                    editingId="clients-paragraph-2"
                    className="text-size-medium text-start text-black opacity-70"
                    canEdit={canEdit}
                  />
                </div>
              </div>
              <ClientsGrid
                items={logoDefaults}
                onLogoNameChange={handleLogoNameChange}
                onReorderClients={reorderClients}
                canEdit={canEdit}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
