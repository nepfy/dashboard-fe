"use client";

import { AboutUsSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "../../../contexts/EditorContext";

interface MinimalAboutUsProps extends AboutUsSection {
  mainColor?: string;
}

export default function MinimalAboutUs({
  title,
  subtitle,
  hideSection,
  mainColor = "#000000",
}: MinimalAboutUsProps) {
  const { updateAboutUs } = useEditor();

  if (hideSection || !title) return null;

  return (
    <>
      <style jsx>{`
        .section_about {
          position: relative;
          background-color: ${mainColor};
          color: var(--white);
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
          padding-top: 8rem;
          padding-bottom: 8rem;
        }
        
        .about_component {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        
        .about-heading {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
        }
        
        .about-heading_left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .text-weight-light {
          font-weight: 300;
        }
        
        .text-size-regular {
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .text-color-grey {
          color: rgba(255, 255, 255, .5);
        }
        
        .about-heading_title {
          display: flex;
          align-items: flex-start;
        }
        
        .heading-style-h1 {
          color: var(--white);
          margin: 0;
          font-size: 3.5rem;
          font-weight: 300;
          line-height: 1.2;
        }
        
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .about-text {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .8);
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
        
        .section_about:hover .edit-button {
          opacity: 1;
        }
        
        .edit-button:hover {
          background: rgba(255, 255, 255, .2);
        }
        
        @media screen and (max-width: 991px) {
          .about-heading {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .about-content {
            grid-template-columns: 1fr;
          }
          .heading-style-h1 {
            font-size: 2.5rem;
          }
        }
        
        @media screen and (max-width: 767px) {
          .padding-global {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
          .container-large {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
          .heading-style-h1 {
            font-size: 2rem;
          }
        }
      `}</style>

      <section className="section_about">
        <div className="padding-global">
          <div className="container-large">
            <div className="about_component">
              <div className="about-heading">
                <div className="about-heading_left">
                  <div className="text-weight-light text-size-regular">
                    Proposal — <span className="text-color-grey">June 22, 2025</span>
                  </div>
                  {subtitle && !hideSection && (
                    <EditableText
                      value={subtitle}
                      onChange={(newSubtitle: string) =>
                        updateAboutUs({ subtitle: newSubtitle })
                      }
                      className="text-size-medium"
                      editingId="aboutUs-subtitle"
                    />
                  )}
                </div>
                <div className="about-heading_title">
                  <EditableText
                    value={title || ""}
                    onChange={(newTitle: string) =>
                      updateAboutUs({ title: newTitle })
                    }
                    className="heading-style-h1 text-weight-light"
                    editingId="aboutUs-title"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
