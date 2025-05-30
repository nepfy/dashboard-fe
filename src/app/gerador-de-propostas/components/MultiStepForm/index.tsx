import IntroForm from "#/app/gerador-de-propostas/components/MultiStep/IntroForm";
import IntroPreview from "#/app/gerador-de-propostas/components/MultiPreview/IntroPreview";

export default function MultiStepForm() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full h-full">
        <IntroForm />
      </div>

      <div className="hidden xl:block w-full h-full bg-primary-light-100">
        <IntroPreview />
      </div>
    </div>
  );
}
