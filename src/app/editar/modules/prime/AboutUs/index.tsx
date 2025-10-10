interface PrimeAboutUsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  paragraph1: string;
  paragraph2: string;
  hideParagraph1: boolean;
  hideParagraph2: boolean;
}

export default function PrimeAboutUs({
  id,
  projectId,
  hideSection,
  title,
  paragraph1,
  paragraph2,
  hideParagraph1,
  hideParagraph2,
}: PrimeAboutUsProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {!hideParagraph1 && (
            <>
              <h1>{paragraph1}</h1>
            </>
          )}
          {!hideParagraph2 && (
            <>
              <h1>{paragraph2}</h1>
            </>
          )}
        </>
      )}
    </div>
  );
}
