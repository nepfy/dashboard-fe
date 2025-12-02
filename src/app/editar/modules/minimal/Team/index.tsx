"use client";

import { useState } from "react";
import Image from "next/image";
import { TeamMember, TeamSection, Result } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalTeamProps extends TeamSection {
  mainColor?: string;
}

export default function MinimalTeam({
  title,
  members,
  hideSection,
  mainColor = "#000000",
}: MinimalTeamProps) {
  const { updateTeam, updateTeamMember, reorderTeamMembers } =
    useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  if (hideSection || !members || members.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section_team {
          position: relative;
          background-color: ${mainColor};
          color: var(--white);
          padding: 8rem 0;
        }
        
        .padding-global {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        
        .container-large {
          width: 100%;
          max-width: 90rem;
          margin-left: auto;
          margin-right: auto;
        }
        
        .team-heading {
          margin-bottom: 4rem;
        }
        
        .text-style-allcaps {
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .text-size-small {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, .6);
        }
        
        .heading-style-h2 {
          color: var(--white);
          margin: 1rem 0 0;
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.3;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .team-card {
          cursor: pointer;
          transition: transform .3s;
        }
        
        .team-card:hover {
          transform: translateY(-4px);
        }
        
        .team-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, .05);
          margin-bottom: 1rem;
          position: relative;
        }
        
        .text-weight-medium {
          font-weight: 500;
        }
        
        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.5;
        }
        
        .text-size-regular {
          font-size: 1rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, .7);
          margin-top: 0.5rem;
        }
        
        .edit-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, .1);
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: .5rem;
          padding: .5rem .75rem;
          cursor: pointer;
          opacity: 0;
          transition: opacity .2s, background .2s;
          z-index: 100;
        }
        
        .section_team:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .section_team {
            padding: 5rem 0;
          }
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section_team">
        <div className="padding-global">
          <div className="container-large">
            {title && (
              <div className="team-heading">
                <div className="text-style-allcaps text-size-small">The Team</div>
                <EditableText
                  value={title}
                  onChange={(newTitle: string) => updateTeam({ title: newTitle })}
                  className="heading-style-h2"
                  editingId="team-title"
                />
              </div>
            )}
            <div className="team-grid">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="team-card relative"
                >
                  <div 
                    className="team-image cursor-pointer"
                    onClick={() => setOpenModalId(member?.id ?? null)}
                  >
                    {!member.hidePhoto && member.image && (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        style={{ objectFit: "cover" }}
                        priority={(member?.sortOrder ?? 0) < 3}
                      />
                    )}
                    <div 
                      className={`absolute inset-0 z-10 rounded-[1rem] border border-transparent transition-all hover:border-[#0170D6] hover:bg-[#0170D666] ${
                        openModalId === member.id
                          ? "border-[#0170D6] bg-[#0170D666]"
                          : ""
                      }`}
                    />
                  </div>
                  <p className="text-size-medium text-weight-medium">
                    {member.name}
                  </p>
                  <p className="text-size-regular">
                    {member.role}
                  </p>
                  <EditableImage
                    isModalOpen={openModalId === member.id}
                    setIsModalOpen={(isOpen) =>
                      setOpenModalId(isOpen ? (member?.id ?? null) : null)
                    }
                    editingId={`team-${member.id}`}
                    itemType="team"
                    items={members || []}
                    currentItemId={member?.id ?? null}
                    onUpdateItem={updateTeamMember}
                    onReorderItems={
                      reorderTeamMembers as (items: TeamMember[] | Result[]) => void
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
