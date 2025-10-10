interface FlashTeamProps {
  id: string;
  projectId: string;
  hideSection: boolean;
  title: string;
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

export default function FlashTeam({
  id,
  projectId,
  hideSection,
  title,
  members,
}: FlashTeamProps) {
  return (
    <div>
      {!hideSection && (
        <div>
          <h1>{id}</h1>
          <h1>{projectId}</h1>
          <h1>{title}</h1>
          {members?.map((member) => (
            <div key={member.id}>
              <h1>{member.name}</h1>
              <h1 key={member.id}>{member.role}</h1>
              {!member.hidePhoto && (
                <>
                  <h1 key={member.id}>{member.photo}</h1>
                </>
              )}
              <h1 key={member.id}>{member.sortOrder}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
