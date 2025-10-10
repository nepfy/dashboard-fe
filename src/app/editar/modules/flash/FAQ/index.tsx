interface FlashFAQProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
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

export default function FlashFAQ({
  id,
  projectId,
  hideSection,
  title,
  list,
}: FlashFAQProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
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
        </div>
      )}
    </div>
  );
}
