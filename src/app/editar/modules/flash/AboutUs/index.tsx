interface FlashAboutUsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  supportText: string;
  subtitle: string;
}

export default function FlashAboutUs({
  id,
  projectId,
  hideSection,
  title,
  supportText,
  subtitle,
}: FlashAboutUsProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          <h1>{supportText}</h1>
          <h1>{subtitle}</h1>
        </div>
      )}
    </div>
  );
}
