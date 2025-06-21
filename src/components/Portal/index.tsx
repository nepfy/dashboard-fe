import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

const Portal: React.FC<PortalProps> = ({
  children,
  containerId = "portal-root",
}) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get the portal container
    let portalContainer = document.getElementById(containerId);

    if (!portalContainer) {
      portalContainer = document.createElement("div");
      portalContainer.id = containerId;
      portalContainer.style.position = "relative";
      portalContainer.style.zIndex = "50";
      document.body.appendChild(portalContainer);
    }

    setContainer(portalContainer);
    setMounted(true);

    return () => {
      // Clean up: remove the container if it's empty when component unmounts
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!mounted || !container) {
    return null;
  }

  return createPortal(children, container);
};

export default Portal;
