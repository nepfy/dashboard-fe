"use client";

import { useState } from "react";
import { IntroductionSection } from "#/types/template-data";
import { formatDateToDDDeMonthDeYYYY } from "#/helpers/formatDateAndTime";
import EditableText from "#/app/editar/components/EditableText";
import EditableDate from "#/app/editar/components/EditableDate";
import EditableButton from "#/app/editar/components/EditableButton";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalIntroProps extends IntroductionSection {
  mainColor?: string;
}

export default function MinimalIntro({
  userName,
  title,
  mainColor = "#000000",
}: MinimalIntroProps) {
  const { updateIntroduction, projectData, activeEditingId } = useEditor();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState<boolean>(false);

  const canEdit = activeEditingId === null;

  if (!title) return null;

  return (
    <>
      {/* CSS do Webflow Minimal */}
      <style jsx>{`
        @import url('/template-minimal/css/normalize.css');
        @import url('/template-minimal/css/components.css');
        @import url('/template-minimal/css/empty-studio.css');
        
        .section_hero {
          position: relative;
          background-color: ${mainColor};
        }
        
        .nav_component {
          position: relative;
          z-index: 10;
        }
        
        .padding-global {
          padding-left: 2.5rem;
          padding-right: 2.5rem;
        }
        
        .padding-section-large {
          padding-top: 8rem;
          padding-bottom: 8rem;
        }
        
        .container-large {
          width: 100%;
          max-width: 90rem;
          margin-left: auto;
          margin-right: auto;
        }
        
        .nav_wrap {
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
          display: flex;
        }
        
        .nav_brand {
          z-index: 3;
          position: relative;
        }
        
        .text-weight-medium {
          font-weight: 500;
        }
        
        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.5;
        }
        
        .nav_menu {
          z-index: 2;
          justify-content: space-between;
          align-items: center;
          display: flex;
        }
        
        .btn-animate-chars {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, .2);
          border-radius: .5rem;
          padding: .875rem 1.5rem;
          text-decoration: none;
          display: inline-block;
          transition: border-color .3s;
        }
        
        .btn-animate-chars:hover {
          border-color: rgba(255, 255, 255, .5);
        }
        
        .btn-animate-chars__text {
          position: relative;
          z-index: 2;
          color: var(--white);
          font-size: 1rem;
        }
        
        .hero_component {
          grid-column-gap: 4rem;
          grid-row-gap: 4rem;
          justify-content: space-between;
          align-items: flex-end;
          display: flex;
        }
        
        .hero_left {
          flex: 1;
        }
        
        .heading-wrap {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .heading-style-h1 {
          color: var(--white);
          margin-top: 0;
          margin-bottom: 0;
          font-size: 4.5rem;
          font-weight: 300;
          line-height: 1.2;
        }
        
        .text-weight-light {
          font-weight: 300;
        }
        
        .heading-client-image {
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
        }
        
        .heading-line {
          color: rgba(255, 255, 255, .3);
          margin: 1.5rem 0;
          font-size: 4.5rem;
          font-weight: 300;
          line-height: 1;
        }
        
        .hero_right {
          flex-shrink: 0;
        }
        
        .text-size-regular {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .text-color-grey {
          color: rgba(255, 255, 255, .5);
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
        
        .section_hero:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 991px) {
          .heading-style-h1 {
            font-size: 3.5rem;
          }
          .heading-line {
            font-size: 3.5rem;
          }
          .padding-section-large {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
        }
        
        @media screen and (max-width: 767px) {
          .hero_component {
            flex-direction: column;
            align-items: flex-start;
          }
          .heading-style-h1 {
            font-size: 2.5rem;
          }
          .heading-line {
            font-size: 2.5rem;
            margin: 1rem 0;
          }
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
      `}</style>

      <section className="section_hero">
        {/* Navigation */}
        <div className="nav_component">
          <div className="padding-global">
            <div className="container-large">
              <div className="nav_wrap">
                <div className="nav_brand">
                  <EditableText
                    value={userName || ""}
                    onChange={(newUserName: string) =>
                      updateIntroduction({ userName: newUserName })
                    }
                    className="text-weight-medium text-size-medium"
                    editingId="intro-userName"
                  />
                </div>
                <nav className="nav_menu">
                  <div
                    className={`btn-animate-chars ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canEdit) {
                        setIsButtonModalOpen(true);
                      }
                    }}
                    style={{
                      position: "relative",
                      border: isButtonModalOpen
                        ? "1px solid #0170D6"
                        : "1px solid rgba(255, 255, 255, .2)",
                      background: isButtonModalOpen ? "#0170D666" : "transparent",
                    }}
                  >
                    <span className="btn-animate-chars__text text-size-regular">
                      {projectData?.buttonConfig?.buttonTitle || "Start Project"}
                    </span>
                    <EditableButton
                      isModalOpen={isButtonModalOpen}
                      setIsModalOpen={setIsButtonModalOpen}
                      position="below"
                      editingId="intro-button"
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="padding-global padding-section-large">
          <div className="container-large">
            <div className="hero_component">
              <div className="hero_left">
                <div className="heading-wrap">
                  <h1 className="heading-style-h1 text-weight-light">Hello,</h1>
                  <div className="heading-client-image"></div>
                  <EditableText
                    value={userName || ""}
                    onChange={(newUserName: string) =>
                      updateIntroduction({ userName: newUserName })
                    }
                    className="heading-style-h1 text-weight-light"
                    editingId="intro-userName-hero"
                  />
                </div>
                <h1 className="heading-line">—</h1>
                <EditableText
                  value={title || ""}
                  onChange={(newTitle: string) =>
                    updateIntroduction({ title: newTitle })
                  }
                  className="heading-style-h1 text-weight-light"
                  editingId="intro-title"
                />
              </div>
              <div className="hero_right">
                {projectData?.projectValidUntil && (
                  <div
                    className={`text-size-regular text-weight-light ${canEdit ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canEdit) {
                        setIsDateModalOpen(true);
                      }
                    }}
                    style={{
                      border: isDateModalOpen
                        ? "1px solid #0170D6"
                        : "1px solid transparent",
                      background: isDateModalOpen ? "#0170D666" : "transparent",
                      padding: "4px",
                    }}
                  >
                    Proposal — <span className="text-color-grey">
                      {formatDateToDDDeMonthDeYYYY(
                        projectData.projectValidUntil.toString()
                      )}
                    </span>
                    <EditableDate
                      isModalOpen={isDateModalOpen}
                      setIsModalOpen={setIsDateModalOpen}
                      editingId="intro-date"
                    />
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
