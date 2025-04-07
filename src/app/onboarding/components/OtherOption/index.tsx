import { TextField } from "#/components/Inputs";

const OtherOption = ({ placeholder = "Outro..." }) => {
  return (
    <div className="mb-4 w-full block">
      <TextField placeholder={placeholder} type="text" />
    </div>
  );
};

export default OtherOption;
