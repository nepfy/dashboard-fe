interface FlashResultsProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  list: Array<{
    id: string;
    resultsSectionId: string;
    client: string;
    instagram: string;
    investment: string;
    roi: string;
    photo: string | null;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export default function FlashResults({
  id,
  projectId,
  hideSection,
  title,
  list,
}: FlashResultsProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {list?.map((item) => (
            <div key={item.id}>
              <h1>{item.client}</h1>
              <h1>{item.instagram}</h1>
              <h1>{item.investment}</h1>
              <h1>{item.roi}</h1>
              <h1>{item.photo}</h1>
              <h1>{item.hidePhoto.toString()}</h1>
              <h1>{item.sortOrder}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
