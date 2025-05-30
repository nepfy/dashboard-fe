import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import Modal from "#/components/Modal";
import { Project } from "#/types/project";

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
  const [selectedProject, setSelectedProject] = useState("");
  const [showProjectSelection, setShowProjectSelection] = useState(false);
  const [projectsList, setProjectsList] = useState<ProjectProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleImportDataClick = async () => {
    setShowProjectSelection(true);
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

      onImportProject?.(projectData);
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

  return (
    <Modal
      isOpen={true}
      onClose={onClose || (() => {})}
      title="Criar novo projeto!"
      footer={false}
      closeOnClickOutside={!isImporting}
      showCloseButton={!isImporting}
    >
      {!showProjectSelection ? (
        // Initial view with options
        <>
          <div className="p-6">
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Você está prestes a criar um novo projeto.
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              Para facilitar, é possível importar informações de um projeto já
              existente, como dados do time, serviços, termos de trabalho, entre
              outros. Assim, você poderá aproveitar o que já foi preenchido e
              fazer apenas os ajustes necessários para personalizar o novo
              projeto.
            </p>

            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Escolha uma das opções abaixo:
            </p>

            <div className="flex gap-2">
              <span className="text-white-neutral-light-500">&#8226;</span>
              <p className="text-white-neutral-light-500 text-sm mb-3">
                <span className="font-bold">
                  Importar dados de um projeto anterior:
                </span>{" "}
                Selecione um projeto já preenchido para importar as informações.
                Depois, você poderá alterar o que for necessário.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="text-white-neutral-light-500">&#8226;</span>
              <p className="text-white-neutral-light-500 text-sm mb-3">
                <span className="font-bold">
                  Iniciar um novo projeto do zero:
                </span>{" "}
                Comece com um projeto completamente em branco, preenchendo todos
                os dados manualmente.
              </p>
            </div>
          </div>
          <div className="flex justify-start flex-wrap sm:flex-nowrap p-6 border-t border-t-white-neutral-light-300 gap-2">
            <button
              type="button"
              onClick={handleImportDataClick}
              className="w-full sm:w-[140px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs bg-primary-light-500 hover:bg-blue-700 cursor-pointer button-inner-inverse"
            >
              Importar dados
            </button>
            <button
              type="button"
              onClick={handleCreateNewClick}
              className="w-full sm:w-[180px] h-[38px] px-4 py-2 text-sm font-medium border rounded-xs text-gray-700 border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer button-inner"
            >
              Criar novo projeto
            </button>
          </div>
        </>
      ) : (
        // Project selection view
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

            <button
              type="button"
              onClick={() => setShowProjectSelection(false)}
              disabled={isImporting}
              className={`w-full sm:w-[100px] h-[38px] px-4 py-2 text-sm font-medium border rounded-xs border-white-neutral-light-300 cursor-pointer button-inner ${
                isImporting
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-white-neutral-light-300"
              }`}
            >
              Voltar
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
