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
  const { updateFormData } = useProjectGenerator();

  // Step management
  const [currentStep, setCurrentStep] = useState<
    "initial" | "import-choice" | "project-selection"
  >("initial");

  // Initial form data
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [initialFormErrors, setInitialFormErrors] = useState<{
    [key: string]: string;
  }>({});

  // Import functionality state
  const [selectedProject, setSelectedProject] = useState("");
  const [projectsList, setProjectsList] = useState<ProjectProps[]>([]);
  const [hasExistingProjects, setHasExistingProjects] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has existing projects when component mounts
  useEffect(() => {
    checkExistingProjects();
  }, []);

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

  // Handle initial form submission
  const handleInitialFormSubmit = () => {
    const errors: { [key: string]: string } = {};

    if (!clientName.trim()) {
      errors.clientName = "Nome do cliente é obrigatório";
    }

    if (!projectName.trim()) {
      errors.projectName = "Nome do projeto é obrigatório";
    }

    if (Object.keys(errors).length > 0) {
      setInitialFormErrors(errors);
      return;
    }

    // Save the client and project names to form data
    updateFormData("step1", {
      clientName: clientName.trim(),
      projectName: projectName.trim(),
    });

    setInitialFormErrors({});

    // MUDANÇA PRINCIPAL: Se não há projetos existentes, vai direto para criar novo
    if (hasExistingProjects === false) {
      handleCreateNewClick();
    } else {
      // Se há projetos existentes, vai para o step de escolha
      setCurrentStep("import-choice");
    }
  };

  const handleImportDataClick = async () => {
    setCurrentStep("project-selection");
    await fetchProjects();
  };

  const handleCreateNewClick = () => {
    // The form data has already been saved in handleInitialFormSubmit
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

      // Update the imported project data with the initial form data
      const updatedProjectData = {
        ...projectData,
        clientName: clientName.trim(),
        projectName: projectName.trim(),
      };

      // Also update the form data with imported project info
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

  // Função para determinar o título do modal baseado no step e se há projetos existentes
  const getModalTitle = () => {
    if (currentStep === "initial") {
      return "Como você quer identificar essa proposta?";
    }
    return "Criar nova proposta!";
  };

  // Função para determinar a descrição no step inicial
  const getInitialStepDescription = () => {
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
      showCloseButton={!isImporting}
      disableClose
    >
      {/* Initial Step - Client and Project Name */}
      {currentStep === "initial" && (
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
              />
            </div>
          </div>

          <div className="flex justify-start p-6 border-t border-t-white-neutral-light-300">
            <button
              type="button"
              onClick={handleInitialFormSubmit}
              className="w-full sm:w-[75px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs bg-primary-light-500 hover:bg-blue-700 cursor-pointer button-inner-inverse"
            >
              {hasExistingProjects === false ? "Criar" : "Salvar"}
            </button>
          </div>
        </>
      )}

      {/* Import Choice Step - Só aparece se houver projetos existentes */}
      {currentStep === "import-choice" && hasExistingProjects && (
        <>
          <div className="p-6">
            <p className="text-white-neutral-light-900 font-semibold text-sm mb-3">
              Você está prestes a criar uma nova proposta.
            </p>
            <p className="text-white-neutral-light-900 text-sm mb-3">
              Para facilitar, é possível importar informações de uma proposta já
              existente, como dados do time, serviços, termos de trabalho, entre
              outros. Assim, você poderá aproveitar o que já foi preenchido e
              fazer apenas os ajustes necessários para personalizar a nova
              proposta.
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
                Selecione um projeto já preenchido para importar as informações.
                Depois, você poderá alterar o que for necessário.
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
                Comece com um projeto completamente em branco, preenchendo todos
                os dados manualmente.
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
      {currentStep === "project-selection" && (
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
