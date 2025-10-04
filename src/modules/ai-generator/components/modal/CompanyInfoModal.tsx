import { useState } from "react";
import Modal from "#/modules/ai-generator/components/modal/Modal";
import { SparkleIcon } from "#/modules/ai-generator/components/icons/SparkleIcon";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CompanyInfoModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    beforeChange: (current: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        className={`w-3 h-3 rounded-full ${
          i === currentSlide ? "bg-primary-light-400" : "bg-primary-light-100"
        }`}
      />
    ),
  };

  const descriptions = [
    {
      text: "Meu nome é Ana Souza, sou fotógrafa há 7 anos e ajudo marcas e empreendedores a criarem imagens autênticas para fortalecer sua presença online. Meu diferencial é entregar fotos que contam histórias e conectam de verdade com o público.",
    },
    {
      text: `Somos a Clínica BellaVita, referência em estética avançada e personalizada. 
      Oferecemos tratamentos modernos, seguros e eficazes, sempre adaptados às necessidades de cada paciente. 
      Entre nossos serviços estão limpeza de pele, peelings, microagulhamento, toxina botulínica, preenchimentos, bioestimuladores e protocolos corporais para gordura localizada. 
      Unimos tecnologia de ponta com um atendimento humano e acolhedor, garantindo resultados naturais e um acompanhamento próximo em cada etapa. Entregamos confiança, bem-estar e autoestima`,
    },
    {
      text: `Sou João Mendes, arquiteto especializado em interiores residenciais. Trabalho criando ambientes funcionais e acolhedores, sempre valorizando a identidade de cada cliente. Minha missão é transformar espaços em lares.`,
    },
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      showCloseButton={false}
    >
      <div className="font-satoshi">
        <div className="flex items-center gap-2 bg-[#DBD2FF1A]/90 rounded-[12px] p-4 border border-[#5639C6] button-inner">
          <div className="h-10 w-10 hidden md:flex justify-center items-center bg-[#DBD2FF] rounded-full">
            <SparkleIcon />
          </div>
          <div className="w-[88%]">
            <p className="font-medium text-white-neutral-light-900">
              Dicas para escrever sobre você
            </p>
            <p className="text-xs text-white-neutral-light-500">
              Use este espaço para contar de forma simples quem é você, o que
              faz e qual o diferencial do seu trabalho. Aqui vão exemplos para
              se inspirar:
            </p>
          </div>
        </div>

        <div className="border-t border-white-neutral-light-300 my-6" />

        <div className="slider-container mb-10">
          <style jsx>{`
            .slider-container .slick-dots {
              bottom: -40px !important;
            }
            .slider-container .slick-dots li {
              margin: 0 !important;
            }
          `}</style>
          <Slider {...sliderSettings}>
            {descriptions.map((description, index) => (
              <div key={index} className="mb-6">
                <p className="text-white-neutral-light-900 text-sm font-satoshi font-light">
                  {description.text}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </Modal>
  );
}
