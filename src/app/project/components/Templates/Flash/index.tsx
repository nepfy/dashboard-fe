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
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  // Send data to iframe via postMessage
  useEffect(() => {
    // Don't do anything if data is not available
    if (!data) {
      return;
    }

    // Wait for iframe ref to be available
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let retryCount = 0;
    const maxRetries = 20;

    const sendData = () => {
      const currentIframe = iframeRef.current;
      if (!currentIframe) {
        console.warn("Flash template: Iframe ref lost");
        return;
      }

      try {
        if (!currentIframe.contentWindow) {
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(sendData, 300);
            return;
          }
          console.warn(
            "Flash template: iframe.contentWindow not available after retries"
          );
          return;
        }

        currentIframe.contentWindow.postMessage(
          {
            type: "FLASH_TEMPLATE_DATA",
            data: data,
          },
          "*"
        );
      } catch (error) {
        console.error("Flash template: Error sending data", error);
      }
    };

    // Send data when iframe loads (backup to onLoad handler)
    const handleLoad = () => {
      setTimeout(sendData, 1200);
    };
    iframe.addEventListener("load", handleLoad);

    // Also try sending after a delay (in case load event already fired)
    const initialTimeout = setTimeout(() => {
      sendData();
    }, 1000);

    // Retry sending with multiple attempts
    const retryInterval = setInterval(() => {
      if (retryCount < maxRetries) {
        sendData();
        retryCount++;
      } else {
        clearInterval(retryInterval);
      }
    }, 500);

    // Final timeout
    const finalTimeout = setTimeout(() => {
      sendData();
      clearInterval(retryInterval);
    }, 3000);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      clearTimeout(initialTimeout);
      clearTimeout(finalTimeout);
      clearInterval(retryInterval);
    };
  }, [data]);

  // Expose function for manual testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      (
        window as typeof window & { testFlashMessage?: () => void }
      ).testFlashMessage = () => {
        if (iframeRef.current?.contentWindow && data) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "FLASH_TEMPLATE_DATA",
              data: data,
            },
            "*"
          );
        } else {
          console.warn("Manual test: iframe or data not available");
        }
      };
    }
  }, [data]);

  // Early return AFTER all hooks
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

  // Handle iframe onLoad to send data
  const handleIframeLoad = () => {
    if (!data || !iframeRef.current) return;

    // Wait a bit for scripts to initialize
    setTimeout(() => {
      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: "FLASH_TEMPLATE_DATA",
            data: data,
          },
          "*"
        );
      }
    }, 1500);
  };

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <iframe
        ref={iframeRef}
        src="/template-flash/index.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="Flash Template"
        onLoad={handleIframeLoad}
      />
    </ReactLenis>
  );
}
