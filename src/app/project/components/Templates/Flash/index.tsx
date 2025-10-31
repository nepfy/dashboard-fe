"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";

import type { TemplateData } from "#/types/template-data";
import PasswordSection from "./PasswordSection";

interface FlashTemplateProps {
  data?: TemplateData;
}

export default function FlashTemplate({ data }: FlashTemplateProps) {
  const lenis = useLenis();
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const lenisRef = useRef<LenisRef>(null);
  const needsPassword = data?.pagePassword && data.pagePassword.trim() !== "";

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

  console.log(data);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <iframe
        src="/template-flash/index.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="Flash Template"
      />
    </ReactLenis>
  );
}
