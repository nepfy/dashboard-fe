interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout = ({ children }: FormLayoutProps) => {
  return (
    <div className="w-full max-w-[500px] space-y-8 h-full pt-[70px] sm:pt-0 sm:flex flex-col justify-center items-center">
      {children}
    </div>
  );
};

export default FormLayout;
