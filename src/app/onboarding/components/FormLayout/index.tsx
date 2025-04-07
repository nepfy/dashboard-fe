interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout = ({ children }: FormLayoutProps) => {
  return <div className="w-full max-w-[500px] space-y-8">{children}</div>;
};

export default FormLayout;
