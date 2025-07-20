"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";

import type { CompleteProjectData } from "#/app/project/types/project";
import IntroSection from "./IntroSection";
import BusinessSection from "./BusinessSection";
import BusinessSectionComplement from "./BusinessSectionComplement";
import TeamSection from "./TeamSection";
import ExpertiseSection from "./ExpertiseSection";
import ResultsSection from "./ResultsSection";
import ClientSection from "./ClientsSection";
import ProcessSection from "./ProcessSection";
import ProcessListSection from "./ProcessListSection";
import CTASection from "./CTASection";
import TestimonialsSection from "./TestimonialsSection";
import InvestmentSection from "./InvestmentSection";
import DeliverySection from "./DeliverySection";
import PlansSection from "./PlansSection";
import TermsSection from "./TermsSection";
import FAQSection from "./FAQSection";
import FinalMessageSection from "./FinalMessageSection";

interface FlashTemplateProps {
  data?: CompleteProjectData;
}

export default function FlashTemplate({ data }: FlashTemplateProps) {
  const lenisRef = useRef<LenisRef>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const businessComplementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  lenis?.on("scroll", ScrollTrigger.update);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    if (
      !introRef.current ||
      !businessRef.current ||
      !businessComplementRef.current ||
      !containerRef.current ||
      !backgroundRef.current
    )
      return;

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const introProgress = Math.min(progress / 0.3, 1);
          gsap.to(introRef.current, {
            opacity: 1 - introProgress,
            y: -introProgress * 150,
            duration: 0.15,
            ease: "none",
          });

          const businessProgress =
            progress > 0.4 ? Math.min((progress - 0.4) / 0.35, 1) : 0;

          const businessFadeOut =
            progress > 0.85 ? Math.min((progress - 0.85) / 0.1, 1) : 0;
          const businessOpacity = businessProgress * (1 - businessFadeOut);

          gsap.to(businessRef.current, {
            opacity: businessOpacity,
            y: (1 - businessProgress) * 400 + businessFadeOut,
            duration: 0.15,
            ease: "none",
          });

          const businessComplementProgress =
            progress > 0.9 ? Math.min((progress - 0.9) / 0.15, 1) : 0;
          gsap.to(businessComplementRef.current, {
            opacity: businessComplementProgress,
            y: (1 - businessComplementProgress) * 400,
            duration: 0.15,
            ease: "none",
          });
        },
      },
    });

    gsap.set(introRef.current, { opacity: 1, y: 0 });
    gsap.set(businessRef.current, { opacity: 0, y: 100 });
    gsap.set(businessComplementRef.current, { opacity: 0, y: 100 });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [data?.mainColor]);

  const initialGradient =
    "radial-gradient(220% 130% at 10.84% 2.05003%, #000000 10%, #000000 10%, #4F21A1 45.22%, #4F21A1 54.9%, #4F21A1 34.9%, #000000 61.78%)";

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div
        ref={backgroundRef}
        className="font-manrope relative w-screen"
        style={{
          background: initialGradient,
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full h-screen overflow-hidden"
        >
          <div ref={introRef} className="absolute inset-0 w-full h-full">
            <IntroSection data={data} />
          </div>

          <div ref={businessRef} className="absolute inset-0 w-full h-full">
            <BusinessSection data={data} />
          </div>

          <div
            ref={businessComplementRef}
            className="absolute inset-0 w-full h-full"
          >
            <BusinessSectionComplement data={data} />
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="bg-black">
          <TeamSection data={data} />

          <ExpertiseSection data={data} />
        </div>

        <div className="bg-black">
          <ResultsSection data={data} />

          <ClientSection data={data} />
        </div>

        <div className="bg-[#4F21A1]">
          <ProcessSection data={data} />

          <ProcessListSection data={data} />
        </div>

        <CTASection data={data} />

        <TestimonialsSection data={data} />

        <InvestmentSection data={data} />

        <DeliverySection data={data} />

        <PlansSection data={data} />

        <TermsSection data={data} />

        <FAQSection data={data} />

        <FinalMessageSection data={data} />
      </div>
    </ReactLenis>
  );
}
