interface PrimeCTAProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  buttonTitle: string;
  backgroundImage: string;
}

export default function PrimeCTA({
  id,
  projectId,
  hideSection,
  title,
  buttonTitle,
  backgroundImage,
}: PrimeCTAProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          <h1>{buttonTitle}</h1>
          <h1>{backgroundImage}</h1>
        </>
      )}
    </div>
  );
}
