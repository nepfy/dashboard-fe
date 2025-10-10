export interface PrimeIntroProps {
  id: string;
  projectId: string;
  name: string;
  validity: Date | string;
  email: string;
  title: string;
  subtitle: string;
  buttonTitle: string;
  photo: string | null;
  hidePhoto: boolean;
  memberName: string | null;
  hideMemberName: boolean;
}

export default function PrimeIntro({
  id,
  projectId,
  name,
  validity,
  email,
  title,
  subtitle,
  buttonTitle,
  photo,
  hidePhoto,
  memberName,
  hideMemberName,
}: PrimeIntroProps) {
  return (
    <div>
      <h1>{id}</h1>
      <h1>{projectId}</h1>
      <h1>{name}</h1>
      <h1>{validity.toString()}</h1>
      <h1>{email}</h1>
      <h1>{title}</h1>
      <h1>{subtitle}</h1>
      <h1>{buttonTitle}</h1>
      {!hidePhoto && (
        <>
          <h1>{photo}</h1>
        </>
      )}
      {!hideMemberName && (
        <>
          <h1>{memberName}</h1>
        </>
      )}
    </div>
  );
}
