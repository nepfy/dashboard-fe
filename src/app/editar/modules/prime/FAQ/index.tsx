interface PrimeFAQProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  subtitle: string;
  hideSubtitle: boolean;
  list: Array<{
    id: string;
    faqSectionId: string;
    question: string;
    answer: string;
    hideQuestion: boolean;
    hideAnswer: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeFAQ({
  id,
  projectId,
  hideSection,
  subtitle,
  hideSubtitle,
  list,
}: PrimeFAQProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          {!hideSubtitle && (
            <>
              <h1>{subtitle}</h1>
            </>
          )}
          {list?.map((item) => (
            <div key={item.id}>
              {!item.hideQuestion && (
                <>
                  <h1>{item.question}</h1>
                </>
              )}
              {!item.hideAnswer && (
                <>
                  <h1>{item.answer}</h1>
                </>
              )}
              <h1>{item.sortOrder}</h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
