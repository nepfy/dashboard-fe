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
  title,
  hideTitle,
  paragraphs,
  items,
}: MinimalClientsProps) {
  const { updateClients, activeEditingId } = useEditor();
  const canEdit = activeEditingId === null;

  // Force clients section to always show
  // if (hideSection) {
  //   return null;
  // }

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

  // DEBUG: Log incoming data from AI
  console.log("🔍 MinimalClients - Incoming Props:", {
    hasTitle: !!title,
    titleLength: title?.length || 0,
    titlePreview: title?.substring(0, 50),
    hasParagraphs: !!paragraphs,
    paragraphsCount: paragraphs?.length || 0,
    paragraph1Preview: paragraphs?.[0]?.substring(0, 50),
    paragraph2Preview: paragraphs?.[1]?.substring(0, 50),
    itemsCount: items?.length || 0,
    hideSection,
    hideTitle,
  });

  // Always ensure we have 12 clients for 2x6 grid
  const logoDefaults =
    logos.length === 0
      ? [
          {
            id: "client-1",
            name: "ARMANDO MEDICINA",
            sortOrder: 1,
            logo: null,
          },
          {
            id: "client-2",
            name: "TECH INNOVATIONS",
            sortOrder: 2,
            logo: null,
          },
          {
            id: "client-3",
            name: "DIGITAL SOLUTIONS",
            sortOrder: 3,
            logo: null,
          },
          { id: "client-4", name: "CREATIVE STUDIO", sortOrder: 4, logo: null },
          { id: "client-5", name: "BRAND MAKERS", sortOrder: 5, logo: null },
          { id: "client-6", name: "GROWTH PARTNERS", sortOrder: 6, logo: null },
          { id: "client-7", name: "SMART AGENCY", sortOrder: 7, logo: null },
          { id: "client-8", name: "NEXUS GROUP", sortOrder: 8, logo: null },
          { id: "client-9", name: "VELOCITY BRANDS", sortOrder: 9, logo: null },
          {
            id: "client-10",
            name: "PRIME VENTURES",
            sortOrder: 10,
            logo: null,
          },
          { id: "client-11", name: "FUSION LABS", sortOrder: 11, logo: null },
          { id: "client-12", name: "APEX DIGITAL", sortOrder: 12, logo: null },
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

        .partners-component {
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .partners-header-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          grid-template-rows: auto auto;
          gap: 4rem 6rem;
          margin-bottom: 6rem;
        }

        .partners-heading {
          grid-column: 1;
          grid-row: 1;
          align-self: start;
          max-width: 100%;
          padding-right: 2rem;
        }

        .partners-heading .heading-style-h2 {
          font-size: 3rem;
          line-height: 1.15;
          font-weight: 400;
          color: #000;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .partners-paragraph {
          grid-column: 2;
          grid-row: 2;
          align-self: end;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 100%;
        }

        .partners-paragraph .text-size-medium {
          font-size: 1rem;
          line-height: 1.65;
          color: rgba(0, 0, 0, 0.65);
          margin: 0;
        }

        .partners-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 2rem;
        }

        .partners-logo {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          transition: all 0.2s ease;
          width: 100%;
          max-width: 180px;
          max-height: 180px;
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
          .partners-header-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            gap: 3rem;
            margin-bottom: 4rem;
          }
          .partners-heading {
            grid-column: 1;
            grid-row: 1;
            padding-right: 0;
          }
          .partners-heading .heading-style-h2 {
            font-size: 2.25rem;
          }
          .partners-paragraph {
            grid-column: 1;
            grid-row: 2;
            align-self: start;
          }
          .partners-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
          .partners-logo {
            max-width: 150px;
            max-height: 150px;
          }
        }

        @media screen and (max-width: 767px) {
          .section_partners {
            padding: 5rem 0;
          }
          .partners-header-grid {
            gap: 2rem;
            margin-bottom: 3rem;
          }
          .partners-heading .heading-style-h2 {
            font-size: 1.75rem;
          }
          .partners-paragraph {
            gap: 1.5rem;
          }
          .partners-paragraph .text-size-medium {
            font-size: 0.9375rem;
            line-height: 1.6;
          }
          .partners-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .partners-logo {
            max-width: 120px;
            max-height: 120px;
          }
        }
      `}</style>
      <section className="section_partners section_partners--dynamic">
        <div className="padding-global">
          <div className="container-large">
            <div className="partners-component">
              {/* Two-column header layout */}
              <div className="partners-header-grid">
                {/* Left column - Title */}
                <div className="partners-heading">
                  {!hideTitle && (
                    <EditableText
                      value={title || ""}
                      onChange={(newTitle) =>
                        updateClients({ title: newTitle })
                      }
                      editingId="clients-title"
                      className="heading-style-h2"
                      placeholder="Clique para adicionar um título sobre sua proposta de valor"
                      canEdit={canEdit}
                    />
                  )}
                </div>

                {/* Right column - Paragraphs */}
                <div className="partners-paragraph">
                  <EditableText
                    value={safeParagraphs[0] || ""}
                    onChange={(value) => handleParagraphChange(0, value)}
                    editingId="clients-paragraph-1"
                    className="text-size-medium"
                    placeholder="Clique para adicionar o primeiro parágrafo sobre como você ajuda seus clientes"
                    canEdit={canEdit}
                  />
                  <EditableText
                    value={safeParagraphs[1] || ""}
                    onChange={(value) => handleParagraphChange(1, value)}
                    editingId="clients-paragraph-2"
                    className="text-size-medium"
                    placeholder="Clique para adicionar o segundo parágrafo sobre sua filosofia de trabalho"
                    canEdit={canEdit}
                  />
                </div>
              </div>

              {/* Clients grid */}
              <ClientsGrid
                items={logoDefaults as Client[] | null}
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
