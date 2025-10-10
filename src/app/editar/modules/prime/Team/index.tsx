interface PrimeTeamProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
  hideTitle: boolean;
  members: Array<{
    id: string;
    teamSectionId: string;
    name: string;
    role: string;
    photo: string | null;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export default function PrimeTeam({
  id,
  projectId,
  hideSection,
  title,
  hideTitle,
  members,
}: PrimeTeamProps) {
  return (
    <div>
      {!hideSection && (
        <>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {!hideTitle && (
            <>
              <h1>{title}</h1>
            </>
          )}
          {members?.map((member) => (
            <div key={member.id}>
              <h1>{member.name}</h1>
              <h1>{member.role}</h1>
              {!member.hidePhoto && (
                <>
                  <h1>{member.photo}</h1>
                </>
              )}
              <h1>{member.sortOrder}</h1>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
