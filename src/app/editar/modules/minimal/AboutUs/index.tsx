import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";
import { AboutUsSection } from "#/types/template-data";

export default function MinimalAboutUs({
  hideSection,
  title,
  mainColor,
}: AboutUsSection) {
  const { updateAboutUs } = useEditor();

  return (
    <>
      {!hideSection && (
        <section className="section_about">
          <div className="padding-global">
            <div className="w-layout-blockcontainer container-large w-container">
              <div className="about_component">
                <div className="about-heading">
                  <div className="about-heading_left">
                    <div className="text-weight-light text-size-regular">
                      Proposal — <span className="text-color-grey">June 22, 2025</span>
                    </div>
                    <div>Focus on the Aurore product growing while we cover the brand design,</div>
                  </div>
                  <div className="about-heading_title">
                    <h2 className="heading-style-h1 text-weight-light">
                      <EditableText
                        value={title || ""}
                        onChange={(newTitle: string) =>
                          updateAboutUs({ title: newTitle })
                        }
                        className="heading-style-h1 text-weight-light"
                      />
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

