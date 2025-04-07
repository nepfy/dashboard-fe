interface StepHeaderProps {
  title: string;
  description: string;
}

const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default StepHeader;
