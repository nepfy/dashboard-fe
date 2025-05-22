import Lottie from "lottie-react";
import criarProposta from "#/lotties/criar-proposta.json";
import criarCalculadora from "#/lotties/criar-calculadora.json";
import criarContrato from "#/lotties/criar-contrato.json";

interface IntroSliderProps {
  title?: string;
  description?: string;
}

// const styles = {
//   border: "1px solid #000",
// };

export default function IntroSlider({ title, description }: IntroSliderProps) {
  return (
    <div className="hidden xl:flex flex-col items-center justify-center lootie-bg relative h-full w-full">
      <div className="w-full h-full flex items-center justify-center">
        <Lottie animationData={criarProposta} className="w-full" />
        {/* 
        <Lottie
          animationData={criarCalculadora}
          className="w-full h-2/3"
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        /> */}

        {/* <Lottie
          animationData={criarContrato}
          className="w-full h-2/3"
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        /> */}
      </div>

      <div className="w-[234px] 2xl:w-[260px] text-center absolute z-10 lg:bottom-[25%] 2xl:bottom-[30%]">
        <h3 className="text-[24px] 2xl:text-[28px] text-white-neutral-light-200 font-medium">
          {title}
        </h3>
        <p className="text-primary-light-200 text-sm 2xl:text-[16px]">
          {description}
        </p>
      </div>
    </div>
  );
}
