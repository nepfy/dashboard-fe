/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";

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
import PasswordSection from "./PasswordSection";

interface FlashTemplateProps {
  data?: CompleteProjectData;
}

export default function FlashTemplate({ data }: FlashTemplateProps) {
  const lenis = useLenis();
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const lenisRef = useRef<LenisRef>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const businessComplementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const needsPassword = data?.pagePassword && data.pagePassword.trim() !== "";

  const gradient = `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, ${data?.mainColor} 94.22%, ${data?.mainColor} 64.9%, ${data?.mainColor} 81.78%)`;
  const tempGradient = `radial-gradient(150.7% 150.34% at 100% 80%, ${data?.mainColor} 10.22%, #000000 70%, #000000 40%, #000000 14.9%, #000000 101.78%)`;

  useEffect(() => {
    if (!needsPassword) {
      setIsPasswordCorrect(true);
    } else {
      if (typeof window !== "undefined") {
        const hasEnteredPassword = sessionStorage.getItem(
          `flash-password-${data?.id || "default"}`
        );
        if (hasEnteredPassword === "true") {
          setIsPasswordCorrect(true);
        }
      }
    }
  }, [needsPassword, data?.id]);

  const handlePasswordCorrect = () => {
    setIsPasswordCorrect(true);
  };

  lenis?.on("scroll", ScrollTrigger.update);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !gradientRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: () => {},
    });

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [gradient, containerRef.current, gradientRef.current]);

  if (needsPassword && !isPasswordCorrect) {
    return (
      <PasswordSection
        password={data?.pagePassword}
        onPasswordCorrect={handlePasswordCorrect}
        mainColor={data?.mainColor}
        data={data}
      />
    );
  }

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <div className="relative w-screen">
        <div ref={containerRef} className="relative w-full">
          <div ref={introRef} className="w-full h-full">
            <IntroSection data={data} />
          </div>

          <div ref={businessRef} className="w-full h-full">
            <BusinessSection data={data} />
          </div>

          <div ref={businessComplementRef} className="w-full h-full">
            <BusinessSectionComplement data={data} />
          </div>
          <div
            ref={gradientRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
            style={{
              width: "100%",
              height: "100%",
              background: tempGradient,
              // filter: "blur(100px)",
            }}
          />
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          style={{
            background: `linear-gradient(
          190deg, 
          #000000 0%,
          #000000 10%,
          #000000 20%,
          #000000 30%,
          #000000 30%,
          #000000 40%,
          ${data?.mainColor} 50%, 
          ${data?.mainColor} 55%, 
          ${data?.mainColor} 65%, 
          #000000 70%, 
          #000000 80%, 
          #000000 90%, 
          #000000 100%
          )`,
          }}
        >
          <TeamSection data={data} />

          <ExpertiseSection data={data} />
        </div>

        <div className="bg-black pb-34">
          <ResultsSection data={data} />

          <ClientSection data={data} />
        </div>

        <div
          style={{
            background: `${data?.mainColor}`,
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto">
            <ProcessSection data={data} />
          </div>

          <ProcessListSection data={data} />
        </div>

        <CTASection data={data} />

        <div
          className="p-6"
          style={{
            background: `linear-gradient(
              160deg,
              #000000 0%,
              #000000 10%,
              ${data?.mainColor} 25%,
              #000000 30%,
              #000000 60%,
              #000000 80%,
              #000000 100%
            )`,
          }}
        >
          <div className="w-full h-full max-w-[1440px] mx-auto">
            <TestimonialsSection data={data} />

            <InvestmentSection data={data} />

            <DeliverySection data={data} />

            <PlansSection data={data} />

            <TermsSection data={data} />
          </div>
        </div>

        <FAQSection data={data} />

        <FinalMessageSection data={data} />
      </div>
    </ReactLenis>
  );
}
