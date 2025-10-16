import { TemplateData } from "#/types/template-data";

export default function Flash(projectData: TemplateData) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Flash Template Editor</h1>
      <p className="mb-4">
        <span className="font-semibold">Project:</span>{" "}
        {projectData.projectName}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Template Type:</span>{" "}
        {projectData.templateType}
      </p>
      {/* Add your Flash template editor UI here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Template Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify(projectData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
