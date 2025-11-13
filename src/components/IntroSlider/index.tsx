"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import criarProposta from "#/lotties/criar-proposta.json";
import criarCalculadora from "#/lotties/criar-calculadora.json";
import criarContrato from "#/lotties/criar-contrato.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function IntroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const slides = [
    {
      animation: criarProposta,
      className: "w-full h-full object-contain",
      title: "Gere propostas",
      description:
        "Prepare uma proposta visualmente cativante e bem estruturada.",
    },
    {
      animation: criarCalculadora,
      className: "w-4/5 h-full object-contain",
      title: "Calcule seu preço",
      description:
        "Descubra o valor ideal do seu trabalho com base em custos e lucro.",
    },
    {
      animation: criarContrato,
      className: "w-4/5 h-full object-contain",
      title: "Crie contratos",
      description:
        "Elabore contratos profissionais e seguros de forma rápida e descomplicada.",
    },
  ];

  const extendedSlides = [...slides, ...slides];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;

        if (nextSlide === slides.length * 2) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentSlide(0);
            setTimeout(() => setIsTransitioning(true), 50);
          }, 500);
          return nextSlide;
        }

        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hidden xl:flex flex-col items-center justify-center lootie-bg h-full w-1/2">
      <div className="relative w-full max-w-[1200px] mx-auto h-full max-h-[1200px]">
        <div className="overflow-hidden w-full h-full">
          <div
            className={`flex w-full h-full ${
              isTransitioning
                ? "transition-transform duration-[1000ms] ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {extendedSlides.map((slide, index) => (
              <div key={index} className="w-full h-full flex-shrink-0 pb-[10%]">
                <div className="flex flex-col items-center justify-center text-center w-full h-full relative">
                  <Lottie
                    animationData={slide.animation}
                    loop={true}
                    autoplay={true}
                    className={slide.className}
                  />

                  <div className="flex flex-col justify-center items-center w-[320px] absolute bottom-20">
                    <h3 className="text-[24px] 2xl:text-[28px] text-white font-medium mb-2">
                      {slide.title}
                    </h3>
                    <p className="text-primary-light-200 text-sm 2xl:text-[16px] leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
