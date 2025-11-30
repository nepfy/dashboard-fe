"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import EditableText from "#/app/editar/components/EditableText";
import EditableClients from "#/app/editar/components/EditableClients";
import type { Client } from "#/types/template-data";

interface GridConfig {
  rows: number;
  colsPerRow: number[];
  boxWidths: number[];
}

function calculateGridConfig(count: number): GridConfig {
  switch (count) {
    case 12:
      return { rows: 2, colsPerRow: [6, 6], boxWidths: [180, 180] };
    case 11:
      return { rows: 2, colsPerRow: [6, 5], boxWidths: [180, 216] };
    case 10:
      return { rows: 2, colsPerRow: [5, 5], boxWidths: [216, 216] };
    case 9:
      return { rows: 2, colsPerRow: [5, 4], boxWidths: [216, 273] };
    case 8:
      return { rows: 2, colsPerRow: [4, 4], boxWidths: [273, 273] };
    case 7:
      return { rows: 2, colsPerRow: [4, 3], boxWidths: [273, 366] };
    case 6:
      return { rows: 2, colsPerRow: [3, 3], boxWidths: [366, 366] };
    case 5:
      return { rows: 1, colsPerRow: [5], boxWidths: [216] };
    case 4:
      return { rows: 1, colsPerRow: [4], boxWidths: [273] };
    case 3:
      return { rows: 1, colsPerRow: [3], boxWidths: [366] };
    case 2:
      return { rows: 1, colsPerRow: [2], boxWidths: [554] };
    case 1:
      return { rows: 1, colsPerRow: [1], boxWidths: [116] };
    default:
      return { rows: 1, colsPerRow: [Math.min(count, 6)], boxWidths: [180] };
  }
}

interface ClientsGridProps {
  items: Client[];
  onLogoNameChange?: (
    id: string | undefined,
    value: string,
    sortOrder?: number
  ) => void;
  onReorderClients?: (clients: Client[]) => void;
  canEdit?: boolean;
}

export default function ClientsGrid({
  items,
  onLogoNameChange,
  onReorderClients,
  canEdit = false,
}: ClientsGridProps) {
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const previousItemsRef = useRef<Client[]>(items);
  const wasSavingRef = useRef(false);

  // Close modal if items changed after a save operation
  useEffect(() => {
    if (
      wasSavingRef.current &&
      previousItemsRef.current.length !== items.length
    ) {
      setOpenModalId(null);
      wasSavingRef.current = false;
    }
    previousItemsRef.current = items;
  }, [items]);

  const handleReorderClients = useCallback(
    (clients: Client[]) => {
      wasSavingRef.current = true;
      onReorderClients?.(clients);
    },
    [onReorderClients]
  );

  const count = items.length;
  const config = calculateGridConfig(count);

  // Split items into rows
  const rows: Client[][] = [];
  let currentIndex = 0;
  for (let i = 0; i < config.rows; i++) {
    const colsInRow = config.colsPerRow[i] || config.colsPerRow[0];
    rows.push(items.slice(currentIndex, currentIndex + colsInRow));
    currentIndex += colsInRow;
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        width: "100%",
        backgroundColor: "white",
        margin: "0 auto",
      }}
    >
      <style jsx>{`
        .clients-grid-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .clients-grid-desktop {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .clients-grid-mobile {
          display: none;
        }

        .clients-row {
          display: grid;
          gap: 16px;
          width: 100%;
          justify-content: center;
          grid-template-columns: var(--grid-cols, repeat(6, minmax(0, 180px)));
          max-width: var(--max-width, 1200px);
        }

        .client-box {
          height: 180px;
          max-width: 100%;
          width: 100%;
          background-color: rgba(51, 48, 48, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .client-box:hover {
          background-color: rgba(51, 48, 48, 0.1);
        }

        .client-box.editing {
          border: 2px solid #0170d6;
          background-color: rgba(1, 112, 214, 0.1);
        }

        .client-logo-container {
          position: relative;
          width: 80%;
          height: 80%;
        }

        .client-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #000;
          text-align: center;
          padding: 0 16px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Tablet styles */
        @media screen and (max-width: 991px) {
          .clients-grid-desktop {
            display: none;
          }
          .clients-grid-mobile {
            display: grid;
            grid-template-columns: repeat(auto-fill, 150px);
            gap: 12px;
            justify-content: center;
            width: 100%;
          }
          .client-box {
            width: 150px;
            max-width: 150px;
          }
        }

        /* Mobile styles */
        @media screen and (max-width: 767px) {
          .clients-grid-mobile {
            grid-template-columns: repeat(auto-fill, 140px);
            gap: 8px;
          }
          .client-box {
            height: 120px;
            width: 140px;
            max-width: 140px;
          }
          .client-text {
            font-size: 0.75rem;
            padding: 0 8px;
          }
        }

        /* Small mobile styles */
        @media screen and (max-width: 480px) {
          .clients-grid-mobile {
            grid-template-columns: repeat(auto-fill, 100%);
            gap: 8px;
            max-width: 100%;
            width: 100%;
          }
          .client-box {
            height: 100px;
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
      <div className="clients-grid-container">
        {/* Desktop: Render with rows */}
        <div className="clients-grid-desktop">
          {rows.map((row, rowIndex) => {
            const colsInRow =
              config.colsPerRow[rowIndex] || config.colsPerRow[0];
            const boxWidth = config.boxWidths[rowIndex] || config.boxWidths[0];
            const totalGap = (colsInRow - 1) * 16;
            const maxRowWidth = colsInRow * boxWidth + totalGap;

            return (
              <div
                key={rowIndex}
                className="clients-row"
                style={
                  {
                    "--grid-cols": `repeat(${colsInRow}, minmax(0, ${boxWidth}px))`,
                    "--max-width": `${maxRowWidth}px`,
                  } as React.CSSProperties
                }
              >
                {row.map((client) => (
                  <div
                    key={client.id || client.name}
                    className={`client-box relative border border-transparent ${openModalId === client.id ? "editing" : ""} ${canEdit ? "" : "cursor-not-allowed"}`}
                    onClick={() => {
                      if (canEdit || openModalId === client.id) {
                        setOpenModalId(client.id || null);
                      }
                    }}
                  >
                    {client.logo ? (
                      <div className="client-logo-container">
                        <Image
                          src={client.logo}
                          alt={client.name || "Client logo"}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <EditableText
                        value={client.name}
                        onChange={(value) =>
                          onLogoNameChange?.(client.id, value, client.sortOrder)
                        }
                        editingId={`client-${client.id || client.name}`}
                        className="client-text"
                        canEdit={canEdit}
                      />
                    )}
                    {onReorderClients && (
                      <EditableClients
                        isModalOpen={openModalId === client.id}
                        setIsModalOpen={(isOpen) => {
                          if (!isOpen) {
                            setOpenModalId(null);
                          } else {
                            setOpenModalId(client.id || null);
                          }
                        }}
                        editingId={`client-${client.id || client.name}`}
                        items={items}
                        currentItemId={client.id || null}
                        onReorderItems={handleReorderClients}
                        onClose={() => setOpenModalId(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Tablet/Mobile: Single wrapping container */}
        <div className="clients-grid-mobile">
          {items.map((client) => (
            <div
              key={client.id || client.name}
              className={`client-box relative border border-transparent ${openModalId === client.id ? "editing" : ""} ${canEdit ? "" : "cursor-not-allowed"}`}
              onClick={() => {
                if (canEdit || openModalId === client.id) {
                  setOpenModalId(client.id || null);
                }
              }}
            >
              {client.logo ? (
                <div className="client-logo-container">
                  <Image
                    src={client.logo}
                    alt={client.name || "Client logo"}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <EditableText
                  value={client.name}
                  onChange={(value) =>
                    onLogoNameChange?.(client.id, value, client.sortOrder)
                  }
                  editingId={`client-${client.id || client.name}`}
                  className="client-text"
                  canEdit={canEdit}
                />
              )}
              {onReorderClients && (
                <EditableClients
                  isModalOpen={openModalId === client.id}
                  setIsModalOpen={(isOpen) => {
                    if (!isOpen) {
                      setOpenModalId(null);
                    } else {
                      setOpenModalId(client.id || null);
                    }
                  }}
                  editingId={`client-${client.id || client.name}`}
                  items={items}
                  currentItemId={client.id || null}
                  onReorderItems={handleReorderClients}
                  onClose={() => setOpenModalId(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
