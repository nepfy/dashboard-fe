interface FlashIntroProps {
  name: string;
  email: string;
  buttonTitle: string;
  title: string;
  validity: Date | string;
  subtitle: string;
  hideSubtitle: boolean;
  services: Array<{
    id: string;
    introductionId: string;
    serviceName: string;
    hideService: boolean;
    sortOrder: number;
  }>;
}

export default function FlashIntro({
  name,
  email,
  buttonTitle,
  title,
  validity,
  subtitle,
  hideSubtitle,
  services,
}: FlashIntroProps) {
  return (
    <div>
      <h1>{name}</h1>
      <h1>{email}</h1>
      <h1>{buttonTitle}</h1>
      <h1>{title}</h1>
      <h1>{validity instanceof Date ? validity.toDateString() : validity}</h1>
      <h1>{subtitle}</h1>
      {!hideSubtitle && (
        <>
          {services?.map((service) => (
            <h1 key={service.id}>{service.serviceName}</h1>
          ))}
        </>
      )}
    </div>
  );
}
