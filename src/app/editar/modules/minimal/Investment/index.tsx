import { InvestmentSection } from "#/types/template-data";
import EditableText from "#/app/editar/components/EditableText";
import { useEditor } from "#/app/editar/contexts/EditorContext";

export default function MinimalInvestment({
  mainColor,
  hideSection,
  title,
  projectScope,
  hideProjectScope,
}: InvestmentSection) {
  const { updateInvestment } = useEditor();

  return (
    <section className="section_investment">
      {!hideSection && (
        <div className="padding-global">
          <div className="w-layout-blockcontainer container-large w-container">
            <div className="invest-component">
              <div className="invest-heading">
                <div className="about-heading_left">
                  <div className="text-size-small text-weight-light">
                    Proposal — <span className="text-color-grey">June 22, 2025</span>
                  </div>
                  <div>Focus on the Aurore product growing while we cover the brand design,</div>
                </div>
                <div className="about-heading_title">
                  <h2 className="heading-style-h1 text-weight-light">
                    <span>
                      <EditableText
                        value={title || ""}
                        onChange={(newTitle: string) =>
                          updateInvestment({ title: newTitle })
                        }
                        className="heading-style-h1 text-weight-light"
                      />
                    </span>
                  </h2>
                </div>
              </div>
              {!hideProjectScope && (
                <div className="invest-heading">
                  <EditableText
                    value={projectScope || ""}
                    onChange={(newProjectScope: string) =>
                      updateInvestment({ projectScope: newProjectScope })
                    }
                    className="text-size-regular"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

