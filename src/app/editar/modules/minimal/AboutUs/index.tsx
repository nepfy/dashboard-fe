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

  if (hideSection) return null;

  return (
    <>
      <style jsx global>{`
        .section_about {
          background-color: ${mainColor};
          color: #fbfbfb;
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
          align-items: flex-start;
        }
        
        .about-heading_left {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .about-heading_title {
          display: flex;
          align-items: flex-start;
        }
        
        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .about-dev,
        .about-design {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .about-video {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 1rem;
          overflow: hidden;
          background: rgba(255, 255, 255, .05);
        }
        
        .about-video img,
        .about-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .about-paragraph {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, .8);
        }
        
        .about-marquee {
          margin-top: 4rem;
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, .1);
          border-bottom: 1px solid rgba(255, 255, 255, .1);
          overflow: hidden;
        }
        
        .about-marquee_text {
          font-size: 1.5rem;
          font-weight: 300;
          color: rgba(255, 255, 255, .6);
          white-space: nowrap;
          animation: marquee 20s linear infinite;
        }
        
        .section_partners {
          background-color: #fbfbfb;
          color: #040404;
          padding: 8rem 0;
        }
        
        .partners-component {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .partners-heading {
          max-width: 50rem;
        }
        
        .heading-style-h2 {
          font-size: 2.5rem;
          font-weight: 400;
          line-height: 1.3;
          margin: 0;
        }
        
        .text-weight-normal {
          font-weight: 400;
        }
        
        .partners-paragraph {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 45rem;
        }
        
        .text-size-medium {
          font-size: 1.125rem;
          line-height: 1.6;
          color: rgba(4, 4, 4, .7);
        }
        
        .partners-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .partners-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          border: 1px solid rgba(4, 4, 4, .1);
          border-radius: .5rem;
          opacity: .6;
          transition: opacity .3s;
        }
        
        .partners-logo:hover {
          opacity: 1;
        }
        
        @media screen and (max-width: 991px) {
          .about-heading {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .about-content {
            grid-template-columns: 1fr;
          }
          .heading-style-h2 {
            font-size: 2rem;
          }
        }
        
        @media screen and (max-width: 767px) {
          .section_partners {
            padding: 5rem 0;
          }
          .heading-style-h2 {
            font-size: 1.75rem;
          }
          .partners-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <section className="section_about">
        <div className="padding-global" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
          <div className="container-large">
            <div className="about_component">
              <div className="about-heading">
                <div className="about-heading_left">
                  <div className="text-size-regular text-weight-light">
                    Proposal — <span className="text-color-grey">June 22, 2025</span>
                  </div>
                  {subtitle && (
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
                    value={title || "Título da seção sobre"}
                    onChange={(newTitle: string) =>
                      updateAboutUs({ title: newTitle })
                    }
                    className="heading-style-h1 text-weight-light"
                    editingId="aboutUs-title"
                  />
                </div>
              </div>

              <div className="about-content">
                <div className="about-dev">
                  <div className="about-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/template-minimal/images/img1.jpg" alt="" />
                  </div>
                  <div className="about-paragraph">
                    <p>We&apos;re a creative studio focused on bringing brands to life through thoughtful design and smart technology.</p>
                  </div>
                </div>
                <div className="about-design">
                  <div className="about-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/template-minimal/images/img2.jpg" alt="" />
                  </div>
                  <div className="about-paragraph">
                    <p>We&apos;re a creative studio focused on bringing brands to life through thoughtful design and smart technology.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-marquee">
          <div className="marquee_content">
            <div className="about-marquee_text">
              Brand Design → Design Systems → UI Design → Webflow Development
            </div>
          </div>
        </div>
      </section>

      <section className="section_partners">
        <div className="padding-global">
          <div className="container-large">
            <div className="partners-component">
              <div className="partners-heading">
                <h2 className="heading-style-h2 text-weight-normal">
                  We recognized a gap in the creative industry—small businesses often struggle to find high-quality, yet affordable, design solutions. That&apos;s why we exist.
                </h2>
              </div>
              <div className="partners-paragraph">
                <p className="text-size-medium">
                  Your website is most likely the first point of contact someone will have with your brand. Cut through the noise and stand out from the crowd by creating a website that will help you achieve your business goals while showing who you are in a way people will not forget.
                </p>
                <p className="text-size-medium">
                  Design is about creating experiences, making the lives of people easier, or even making it fun when you&apos;re not having the best day. With that in mind, we provide services to be your partner on your next project.
                </p>
              </div>
              <div className="partners-grid">
                <div className="partners-logo">
                  <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>Logo</span>
                </div>
                <div className="partners-logo">
                  <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>Logo</span>
                </div>
                <div className="partners-logo">
                  <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>Logo</span>
                </div>
                <div className="partners-logo">
                  <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>Logo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
