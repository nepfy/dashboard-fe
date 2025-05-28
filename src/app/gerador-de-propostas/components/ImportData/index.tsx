import { useState } from "react";
import Modal from "#/components/Modal";

const projectsList = [
  {
    id: "01",
    projectName: "Proposta 1",
  },
  {
    id: "02",
    projectName: "Proposta 2",
  },
  {
    id: "03",
    projectName: "Proposta 3",
  },
  {
    id: "04",
    projectName: "Proposta 4",
  },
  {
    id: "05",
    projectName: "Proposta 5",
  },
  {
    id: "06",
    projectName: "Proposta 6",
  },
  {
    id: "07",
    projectName: "Proposta 7",
  },
  {
    id: "08",
    projectName: "Proposta 8",
  },
  {
    id: "09",
    projectName: "Proposta 9",
  },
  {
    id: "10",
    projectName: "Proposta 10",
  },
  {
    id: "11",
    projectName: "Proposta 11",
  },
  {
    id: "12",
    projectName: "Proposta 12",
  },
  {
    id: "13",
    projectName: "Proposta 13",
  },
  {
    id: "14",
    projectName: "Proposta 14",
  },
  {
    id: "15",
    projectName: "Proposta 15",
  },
  {
    id: "16",
    projectName: "Proposta 16",
  },
  {
    id: "17",
    projectName: "Proposta 17",
  },
  {
    id: "18",
    projectName: "Proposta 18",
  },
  {
    id: "19",
    projectName: "Proposta 19",
  },
  {
    id: "20",
    projectName: "Proposta 20",
  },
];

export default function ImportDataModal() {
  const [selectedProject, setSelectedProject] = useState("");
  const [showProjectSelection, setShowProjectSelection] = useState(false);

  const handleImportDataClick = () => {
    setShowProjectSelection(true);
  };

  const handleCreateNewClick = () => {
    // Handle creating new proposal from scratch
    console.log("Creating new proposal from scratch");
  };

  const handleImportClick = () => {
    if (selectedProject) {
      // Handle importing data from selected project
      console.log("Importing data from:", selectedProject);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="Criar nova proposta!"
      footer={false}
    >
      {!showProjectSelection ? (
        // Initial view with options
        <>
          <div className="p-6">
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Você está prestes a criar uma nova proposta.
            </p>
            <p className="text-white-neutral-light-500 text-sm mb-3">
              Para facilitar, é possível importar informações de uma proposta já
              existente, como dados do time, serviços, termos de trabalho, entre
              outros. Assim, você poderá aproveitar o que já foi preenchido e
              fazer apenas os ajustes necessários para personalizar a nova
              proposta.
            </p>

            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Escolha uma das opções abaixo:
            </p>

            <div className="flex gap-2">
              <span className="text-white-neutral-light-500">&#8226;</span>
              <p className="text-white-neutral-light-500 text-sm mb-3">
                <span className="font-bold">
                  Importar dados de uma proposta anterior:
                </span>{" "}
                Selecione uma proposta já preenchida para importar as
                informações. Depois, você poderá alterar o que for necessário.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="text-white-neutral-light-500">&#8226;</span>
              <p className="text-white-neutral-light-500 text-sm mb-3">
                <span className="font-bold">
                  Iniciar uma nova proposta do zero:
                </span>{" "}
                Comece com uma proposta completamente em branco, preenchendo
                todos os dados manualmente.
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
              Criar nova proposta
            </button>
          </div>
        </>
      ) : (
        // Project selection view
        <>
          <div className="p-6 ">
            <p className="text-white-neutral-light-500 font-bold text-sm mb-3">
              Selecione a proposta que deseja importar dados
            </p>

            <div className="max-h-[357px] overflow-y-scroll py-2">
              {projectsList.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-2 p-3 border border-transparent hover:border hover:border-white-neutral-light-200 transition-shadow duration-300 rounded-2xs cursor-pointer ${
                    selectedProject === item.projectName
                      ? "border border-white-neutral-light-200 shadow-[0px_2px_3px_0px_#00000026]"
                      : ""
                  }`}
                  onClick={() => setSelectedProject(item.projectName)}
                >
                  <input
                    type="radio"
                    name="projectName"
                    value={item.projectName}
                    checked={selectedProject === item.projectName}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-4 h-4 border-white-neutral-light-300"
                  />
                  <p className="text-white-neutral-light-900 text-sm font-medium">
                    {item.projectName}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-start flex-wrap sm:flex-nowrap p-6 bg-white-neutral-light-100 border-t border-t-white-neutral-light-300 gap-2">
            <button
              type="button"
              onClick={handleImportClick}
              disabled={!selectedProject}
              className={`w-full sm:w-[140px] h-[38px] px-4 py-2 text-sm font-medium text-white rounded-xs cursor-pointer button-inner-inverse ${
                selectedProject
                  ? "bg-primary-light-500 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Importar
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
