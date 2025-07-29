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
import MobileMenu from "./IntroSection/MobileMenu";

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
  //const tempGradient = `radial-gradient(150.7% 150.34% at 100% 80%, ${data?.mainColor} 10.22%, #000000 70%, #000000 40%, #000000 14.9%, #000000 101.78%)`;

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

  gsap.set(introRef.current, { yPercent: 0 });
  gsap.set(businessRef.current, { opacity: 0 });
  gsap.set(businessComplementRef.current, { opacity: 0, y: -100 });

  useEffect(() => {
    if (!containerRef.current || !gradientRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const calculateAnimationHeight = () => {
      let totalHeight = 0;

      if (introRef.current) {
        totalHeight += window.innerHeight;
      }

      if (businessRef.current) {
        totalHeight += window.innerHeight;
      }

      if (businessComplementRef.current) {
        totalHeight += window.innerHeight;
      }

      if (window.innerWidth < 640) {
        const mobileExtraHeight = Math.max(window.innerHeight * 2.5, 6000);
        totalHeight += mobileExtraHeight;
      }

      return totalHeight;
    };

    const introTitleContainer = introRef.current?.querySelector(
      "#intro-title-container"
    );
    const introTitle = introRef.current?.querySelector("#intro-title");
    const introHeaderContainer = introRef.current?.querySelector(
      "#intro-header-container"
    );
    const introValidity = introRef.current?.querySelector("#intro-validity");
    const introCompanyName = introRef.current?.querySelector(
      "#intro-company-name"
    );
    const introCompanyEmail = introRef.current?.querySelector(
      "#intro-company-email"
    );
    const serviceFooter = introRef.current?.querySelector("#service-footer");
    const introServices = introRef.current?.querySelector("#intro-services");
    const introServicesMobile = introRef.current?.querySelector(
      "#intro-services-mobile"
    );
    const introPageSubtitle = introRef.current?.querySelector(
      "#intro-page-subtitle"
    );

    const businessTitle = businessRef.current?.querySelector("#business-title");

    if (businessTitle) {
      gsap.set(businessTitle, { y: 0 });
    }

    if (introServices && introPageSubtitle) {
      gsap.set(introServices, { opacity: 0 });
      gsap.set(introPageSubtitle, { opacity: 0 });
      if (introServicesMobile) {
        gsap.set(introServicesMobile, { opacity: 0 });
      }

      gsap.to(introServices, {
        opacity: 1,
        duration: 2,
        ease: "none",
        delay: 2,
      });

      if (introServicesMobile) {
        gsap.to(introServicesMobile, {
          opacity: 1,
          duration: 2,
          ease: "none",
          delay: 2,
        });
      }

      gsap.to(introPageSubtitle, {
        opacity: 1,
        duration: 2,
        ease: "none",
        delay: 2,
      });
    }

    if (
      introTitleContainer &&
      introTitle &&
      introHeaderContainer &&
      introValidity &&
      introCompanyName &&
      introCompanyEmail &&
      serviceFooter &&
      introServices &&
      introPageSubtitle &&
      introServicesMobile &&
      businessTitle
    ) {
      gsap.set(introTitle, { yPercent: 200 });
      gsap.set(introValidity, { yPercent: 400 });
      gsap.set(introCompanyName, { yPercent: 100, opacity: 0 });
      gsap.set(introCompanyEmail, { yPercent: 100, opacity: 0 });

      gsap
        .timeline()
        .to(introTitle, {
          yPercent: 0,
          duration: 3.2,
          ease: "expo.inOut",
        })
        .to(
          introValidity,
          {
            yPercent: 0,
            duration: 2.8,
            ease: "expo.inOut",
          },
          "-=3"
        );

      gsap.to(introCompanyName, {
        yPercent: 0,
        opacity: 1,
        duration: 3.2,
        ease: "expo.inOut",
      });

      gsap.to(introCompanyEmail, {
        yPercent: 0,
        opacity: 1,
        duration: 3.2,
        ease: "expo.inOut",
      });

      const tl = gsap.timeline();

      tl.to(introTitleContainer, {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: "linear",
      })
        .to(
          introHeaderContainer,
          {
            y: -100,
            opacity: 0,
            duration: 0.6,
            ease: "linear",
          },
          "<"
        )
        .to(
          serviceFooter,
          {
            y: -100,
            opacity: 0,
            duration: 0.6,
            ease: "linear",
          },
          "<"
        )

        .to(
          businessRef.current,
          {
            opacity: 1,
            duration: 0.5,
            ease: "linear",
          },
          "+=0.2"
        )
        .to(
          businessTitle,
          {
            y: "90%",
            duration: 1,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          gradientRef.current,
          {
            width: 856,
            height: 856,
            borderRadius: "50%",
            ease: "linear",
          },
          "<"
        )
        .to(businessRef.current, {
          yPercent: window.innerWidth < 768 ? -100 : -55,
          opacity: 0.6,
          duration: 1.3,
          ease: "power2.inOut",
          delay: window.innerWidth < 768 ? 0.5 : 1,
        })
        .to(
          gradientRef.current,
          {
            yPercent: window.innerWidth < 768 ? -95 : -120,
            duration: 1.3,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          businessComplementRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "linear",
          },
          "-=0.5"
        );

      const animationHeight = calculateAnimationHeight();

      ScrollTrigger.create({
        animation: tl,
        trigger: containerRef.current,
        start: "top top",
        end: `+=${animationHeight}`,
        markers: true,
        scrub: 2,
        pin: true,
      });
    }

    return () => {
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
      <div className="relative w-screen bg-black">
        <div className="lg:hidden absolute top-12 right-8 z-[99999]">
          <MobileMenu
            ctaButtonTitle={data?.ctaButtonTitle}
            color={data?.mainColor}
          />
        </div>
        <div
          ref={containerRef}
          className="bg-black relative w-full h-screen overflow-x-hidden"
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
          <div
            ref={gradientRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 overflow-x-hidden"
            style={{
              width: "100%",
              height: "100%",
              background: gradient,
              filter: "blur(100px)",
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
