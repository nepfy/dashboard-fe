import { useState } from "react";
import Image from "next/image";
import { TeamMember, TeamSection, Result } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import EditableImage from "#/app/editar/components/EditableImage";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { getHeroGradientColors } from "#/helpers/colorUtils";

export default function FlashTeam({
  mainColor,
  hideSection,
  title,
  members,
}: TeamSection) {
  const { updateTeam, updateTeamMember, reorderTeamMembers } =
    useEditor();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  // Generate gradient colors for the background
  const defaultColor = mainColor || "#4F21A1";
  const colors = getHeroGradientColors(defaultColor);

  return (
    <>
      {!hideSection && (
        <div className="relative overflow-hidden bg-black pb-20 lg:pb-70">
          <div className="relative z-10 mx-auto mb-20 max-w-[1380px] pt-31 lg:mb-180">
            <div className="px-6 lg:px-0">
              <EditableText
                value={title || ""}
                onChange={(newTitle: string) => updateTeam({ title: newTitle })}
                className="mb-21 w-full max-w-[1200px] text-[32px] text-[#E6E6E6] lg:text-[6rem]"
                editingId="team-title"
              />
            </div>

            <div className="px-6 lg:px-12 xl:px-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-white-neutral-light-100 h-3 w-3 rounded-full" />
                <p className="text-sm font-normal text-white">Time</p>
              </div>

              <div
                className={`mx-auto grid max-w-[1280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 ${
                  (members?.length ?? 0) === 2 || (members?.length ?? 0) === 4
                    ? "justify-items-center"
                    : ""
                }`}
              >
                {/* {(members?.length ?? 0) < 2 && (
                  <EditableText
                    value={title || ""}
                    onChange={(newTitle: string) =>
                      updateTeam({ title: newTitle })
                    }
                    className="max-w-[688px] text-[18px] text-[#E6E6E6] xl:text-[72px]"
                  />
                )} */}
                {members?.map((member) => (
                  <div
                    key={member.id}
                    className={`relative mb-6 flex w-full flex-col items-start rounded-[4px] text-sm font-bold text-[#E6E6E6] lg:mb-0`}
                  >
                    {!member.hidePhoto && member?.image && (
                      <div 
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] cursor-pointer"
                        onClick={() => setOpenModalId(member?.id ?? null)}
                      >
                        <Image
                          src={member.image || ""}
                          alt={member.name || ""}
                          fill
                          className="object-cover"
                          quality={95}
                          priority={(member?.sortOrder ?? 0) < 3}
                        />
                        <div 
                          className={`absolute inset-0 z-10 rounded-[4px] border border-transparent transition-all hover:border-[#0170D6] hover:bg-[#0170D666] ${openModalId === member.id ? "border-[#0170D6] bg-[#0170D666]" : ""}`}
                        />
                      </div>
                    )}
                    <p className="mt-3 p-0 text-[16px] font-light text-[#FFFFFF] lg:text-[20px]">
                      {member.name}
                    </p>
                    <p className="text-[16px] font-light text-[#FFFFFF]/40">
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
                        reorderTeamMembers as (
                          items: TeamMember[] | Result[]
                        ) => void
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet version - md and below */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 flex flex-col items-center justify-start md:hidden"
            style={{
              zIndex: 0,
              height: "10vh",
              marginTop: "-8vh",
            }}
          >
            <div
              className="relative"
              style={{
                transform: "rotate(10deg)",
              }}
            >
              <div
                style={{
                  backgroundImage: `linear-gradient(#0000, ${colors.dark} 23%, ${defaultColor} 52%, ${colors.light} 79%)`,
                  width: "120vw",
                  height: "10vh",
                }}
              />
              <div
                style={{
                  backgroundColor: "#000000",
                  filter: "blur(50px)",
                  borderRadius: "50%",
                  width: "400vw",
                  height: "80vh",
                  marginTop: "-32vw",
                  marginLeft: "22vw",
                  position: "relative",
                  boxShadow: `0 -6vw 70px 20px ${colors.light}`,
                }}
              />
            </div>
          </div>

          {/* Desktop version - lg and above */}
          <div
            className="pointer-events-none absolute right-0 bottom-0 left-0 hidden flex-col items-center justify-start md:flex"
            style={{
              zIndex: 0,
              height: "90vh",
              marginTop: "-30vh",
            }}
          >
            <div
              className="relative"
              style={{
                transform: "rotate(7deg)",
              }}
            >
              <div
                style={{
                  backgroundImage: `linear-gradient(#0000, ${colors.dark} 23%, ${defaultColor} 52%, ${colors.light} 79%)`,
                  width: "160vw",
                  height: "80vh",
                }}
              />
              <div
                style={{
                  backgroundColor: "#000000",
                  filter: "blur(50px)",
                  borderRadius: "50%",
                  width: "200vw",
                  height: "70vw",
                  marginTop: "-19vw",
                  marginLeft: "-50vw",
                  position: "relative",
                  boxShadow: `0 -6vw 70px 20px ${colors.light}`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
