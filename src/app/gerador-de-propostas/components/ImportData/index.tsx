/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import Modal from "#/components/Modal";
import { TextField } from "#/components/Inputs";
import { Project } from "#/types/project";
import { useProjectGenerator } from "#/contexts/ProjectGeneratorContext";

interface ProjectProps {
  id: string;
  projectName: string;
}

interface ImportDataModalProps {
  onImportProject?: (projectData: Project) => void;
  onCreateNew?: () => void;
  onClose?: () => void;
}

export default function ImportDataModal({
  onImportProject,
  onCreateNew,
  onClose,
}: ImportDataModalProps) {
  const { updateFormData, formData, isEditMode } = useProjectGenerator();

  const [currentStep, setCurrentStep] = useState<
    "initial" | "import-choice" | "project-selection"
  >("initial");

  const [clientName, setClientName] = useState(
    isEditMode ? formData?.step1?.clientName : ""
  );
  const [projectName, setProjectName] = useState(
    isEditMode ? formData?.step1?.projectName : ""
  );
  const [initialFormErrors, setInitialFormErrors] = useState<{
    [key: string]: string;
  }>({});

  const [selectedProject, setSelectedProject] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectProps[]>([]);
  const [hasExistingProjects, setHasExistingProjects] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      checkExistingProjects();
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const hasData =
        formData?.step1?.clientName && formData?.step1?.projectName;

      if (hasData) {
        setClientName(formData?.step1?.clientName || "");
        setProjectName(formData?.step1?.projectName || "");
        setIsLoadingEditData(false);
      } else {
        // Still waiting for data to load
        setIsLoadingEditData(true);
      }
    }
  }, [formData?.step1?.clientName, formData?.step1?.projectName, isEditMode]);

  const checkExistingProjects = async () => {
    try {
      const response = await fetch("/api/projects?limit=1");
      const result = await response.json();

      if (result.success) {
        setHasExistingProjects(result.data.length > 0);
      } else {
        setHasExistingProjects(false);
      }
    } catch (err) {
      console.error("Error checking existing projects:", err);
      setHasExistingProjects(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/projects?limit=50");
      const result = await response.json();

      if (result.success) {
        const projects = result.data.map((project: Project) => ({
          id: project.id,
          projectName:
            project.projectName || `Projeto ${project?.id?.slice(0, 8)}`,
        }));
        setProjectsList(projects);
      } else {
        setError(result.error || "Erro ao carregar projetos");
        setProjectsList([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Erro ao carregar projetos");
      setProjectsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Erro ao carregar dados do projeto");
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      throw err;
    }
  };

  const handleInitialFormSubmit = async () => {
    const errors: { [key: string]: string } = {};

    if (!clientName?.trim()) {
      errors.clientName = "Nome do cliente é obrigatório";
    }

    if (!projectName?.trim()) {
      errors.projectName = "Nome do projeto é obrigatório";
    }

    if (Object.keys(errors).length > 0) {
      setInitialFormErrors(errors);
      return;
    }

    if (isEditMode) {
      setIsSaving(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    updateFormData("step1", {
      ...formData?.step1,
      clientName: clientName?.trim(),
      projectName: projectName?.trim(),
    });

    setInitialFormErrors({});

    if (isEditMode) {
      setIsSaving(false);
      onClose?.();
      return;
    }

    if (hasExistingProjects === false) {
      handleCreateNewClick();
    } else {
      setCurrentStep("import-choice");
    }
  };

  const handleImportDataClick = async () => {
    setCurrentStep("project-selection");
    await fetchProjects();
  };

  const handleCreateNewClick = () => {
    onCreateNew?.();
    onClose?.();
  };

  const handleImportClick = async () => {
    if (!selectedProject) return;

    try {
      setIsImporting(true);
      setError(null);

      const project = projectsList.find((p) => p.id === selectedProject);
      if (!project) {
        throw new Error("Projeto não encontrado");
      }

      const projectData = await fetchProjectData(selectedProject);

      const {
        id,
        clientName,
        projectName,
        projectSentDate,
        projectValidUntil,
        projectStatus,
        projectVisualizationDate,
        projectUrl,
        pagePassword,
        ...dataToImport
      } = projectData;

      const updatedProjectData = {
        ...dataToImport,
        clientName: formData?.step1?.clientName,
        projectName: formData?.step1?.projectName,
        mainColor: formData?.step1?.mainColor,
        templateType: formData?.step1?.templateType,
      };

      updateFormData("step1", {
        clientName: clientName.trim(),
        projectName: projectName.trim(),
      });

      onImportProject?.(updatedProjectData);
      onClose?.();
    } catch (err) {
      console.error("Error importing project:", err);
      setError(err instanceof Error ? err.message : "Erro ao importar projeto");
    } finally {
      setIsImporting(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleBack = () => {
    if (currentStep === "project-selection") {
      setCurrentStep("import-choice");
      setSelectedProject("");
      setProjectsList([]);
      setError(null);
    } else if (currentStep === "import-choice") {
      setCurrentStep("initial");
    }
  };

  const getModalTitle = () => {
    if (isEditMode) {
      return "Identificação do Projeto";
    }
    if (currentStep === "initial") {
      return "Como você quer identificar essa proposta?";
    }
    return "Criar nova proposta!";
  };

  const getInitialStepDescription = () => {
    if (isEditMode) {
      return (
        <>
          <span className="font-bold">Atualize os dados de identificação.</span>{" "}
          Esses dados são só pra você e vão aparecer no seu painel de
          gerenciamento pra facilitar na hora de encontrar e organizar suas
          propostas.
        </>
      );
    }

    if (hasExistingProjects === false) {
      return (
        <>
          <span className="font-bold">Esses dados são só pra você.</span> Eles
          vão aparecer no seu painel de gerenciamento pra facilitar na hora de
          encontrar e organizar suas propostas.
        </>
      );
    }

    return (
      <>
        <span className="font-bold">Esses dados são só pra você.</span> Eles vão
        aparecer no seu painel de gerenciamento pra facilitar na hora de
        encontrar e organizar suas propostas.
      </>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose || (() => {})}
      title={getModalTitle()}
      boldTitle
      footer={false}
      closeOnClickOutside={false}
      showCloseButton={
        !isImporting && !isSaving && !(isEditMode && isLoadingEditData)
      }
      disableClose
    >
      {/* Initial Step - Client and Project Name */}
      {currentStep === "initial" && (
        <>
          {/* Show loader while waiting for edit data to load */}
          {isEditMode && isLoadingEditData ? (
            <div className="flex items-center justify-center h-[200px] p-6">
              <LoaderCircle className="animate-spin text-primary-light-400" />
              <span className="ml-2 text-white-neutral-light-500">
                Carregando dados do projeto...
              </span>
            </div>
          ) : (
            <>
              <div className="p-6">
                <p className="text-white-neutral-light-900 text-sm mb-8">
                  {getInitialStepDescription()}
                </p>

                <div className="space-y-4">
                  <TextField
                    label="Nome do Cliente"
                    inputName="clientName"
                    id="clientName"
                    type="text"
                    placeholder="Digite o nome do cliente"
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (initialFormErrors.clientName) {
                        setInitialFormErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.clientName;
                          return newErrors;
                        });
                      }
                    }}
                    error={initialFormErrors.clientName}
                    disabled={isSaving}
                  />

                  <TextField
                    label="Nome do Projeto"
                    inputName="projectName"
                    id="projectName"
                    type="text"
                    placeholder="Digite o nome do projeto"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (initialFormErrors.projectName) {
                        setInitialFormErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.projectName;
                          return newErrors;
                        });
                      }
                    }}
                    error={initialFormErrors.projectName}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="flex justify-start p-6 border-t border-t-white-neutral-light-300">
                <button
                  type="button"
                  onClick={handleInitialFormSubmit}
                  disabled={isSaving}
                  className={`w-full sm:w-[95px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs cursor-pointer button-inner-inverse ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-light-500 hover:bg-blue-700"
                  }`}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <LoaderCircle className="w-4 h-4 animate-spin mr-1" />
                      {isEditMode ? "Salvando..." : "Criando..."}
                    </div>
                  ) : isEditMode ? (
                    "Salvar"
                  ) : hasExistingProjects === false ? (
                    "Criar"
                  ) : (
                    "Salvar"
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Import Choice Step */}
      {currentStep === "import-choice" &&
        hasExistingProjects &&
        !isEditMode && (
          <>
            <div className="p-6">
              <p className="text-white-neutral-light-900 font-semibold text-sm mb-3">
                Você está prestes a criar uma nova proposta.
              </p>
              <p className="text-white-neutral-light-900 text-sm mb-3">
                Para facilitar, é possível importar informações de uma proposta
                já existente, como dados do time, serviços, termos de trabalho,
                entre outros. Assim, você poderá aproveitar o que já foi
                preenchido e fazer apenas os ajustes necessários para
                personalizar a nova proposta.
              </p>

              <p className="text-white-neutral-light-900 font-semibold text-sm mb-3">
                Escolha uma das opções abaixo:
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-primary-light-500 text-2xl relative top-[2px]">
                  &#8226;
                </span>
                <p className="text-white-neutral-light-900 text-sm mb-3 leading-[1.4]">
                  <span className="font-bold">
                    Importar dados de um projeto anterior:
                  </span>{" "}
                  Selecione um projeto já preenchido para importar as
                  informações. Depois, você poderá alterar o que for necessário.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-primary-light-500 text-2xl relative top-[2px]">
                  &bull;
                </span>
                <p className="text-white-neutral-light-900 text-sm mb-3 leading-[1.4]">
                  <span className="font-bold">
                    Iniciar um novo projeto do zero:
                  </span>{" "}
                  Comece com um projeto completamente em branco, preenchendo
                  todos os dados manualmente.
                </p>
              </div>
            </div>
            <div className="flex justify-between flex-wrap sm:flex-nowrap p-6 border-t border-t-white-neutral-light-300 gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="w-[36px] h-[36px] cursor-pointer text-white-neutral-light-900 hover:text-white-neutral-light-700"
              >
                <ArrowLeft size={20} strokeWidth={2} />
              </button>
              <div>
                <button
                  type="button"
                  onClick={handleImportDataClick}
                  className="w-full sm:w-[140px] h-[38px] px-4 py-2 mr-2 text-sm font-medium border rounded-xs text-gray-700 border-white-neutral-light-300 hover:bg-white-neutral-light-200 cursor-pointer button-inner"
                >
                  Importar dados
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewClick}
                  className="w-full sm:w-[180px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs bg-primary-light-500 hover:bg-primary-light-600 cursor-pointer button-inner-inverse"
                >
                  Criar nova proposta
                </button>
              </div>
            </div>
          </>
        )}

      {/* Project Selection Step */}
      {currentStep === "project-selection" && !isEditMode && (
        <>
          <div className="p-6">
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Selecione o projeto que deseja importar dados
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center h-[200px]">
                <LoaderCircle className="animate-spin text-primary-light-400" />
                <span className="ml-2 text-white-neutral-light-500">
                  Carregando projetos...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : projectsList.length === 0 ? (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-white-neutral-light-500 text-sm">
                  Nenhum projeto encontrado para importar
                </p>
              </div>
            ) : (
              <div className="max-h-[357px] overflow-y-scroll py-2">
                {projectsList.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 p-3 border border-transparent hover:border hover:border-white-neutral-light-200 transition-shadow duration-300 rounded-2xs cursor-pointer ${
                      selectedProject === item.id
                        ? "border border-white-neutral-light-200 shadow-[0px_2px_3px_0px_#00000026]"
                        : ""
                    }`}
                    onClick={() => handleProjectSelect(item.id)}
                  >
                    <input
                      type="radio"
                      name="projectName"
                      value={item.id}
                      checked={selectedProject === item.id}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-4 h-4 border-white-neutral-light-300"
                    />
                    <p className="text-white-neutral-light-900 text-sm font-medium">
                      {item.projectName}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="flex justify-start flex-wrap sm:flex-nowrap p-6 bg-white-neutral-light-100 border-t border-t-white-neutral-light-300 gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={isImporting}
              className={`w-full sm:w-[100px] h-[38px] px-4 py-2 text-sm font-medium border rounded-xs border-white-neutral-light-300 cursor-pointer button-inner ${
                isImporting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-white-neutral-light-300"
              }`}
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              disabled={!selectedProject || isImporting}
              className={`w-full sm:w-[140px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs cursor-pointer button-inner-inverse ${
                selectedProject && !isImporting
                  ? "bg-primary-light-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isImporting ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  Importando...
                </div>
              ) : (
                "Importar"
              )}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
