interface TitleDescriptionProps {
  title: string;
  description: string;
}

export default function TitleDescription({
  title,
  description,
}: TitleDescriptionProps) {
  return (
    <div>
      <p className="text-primary-light-400 font-medium text-[21px]">{title}</p>
      <p className="text-white-neutral-light-800">{description}</p>
    </div>
  );
}
