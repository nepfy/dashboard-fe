/**
 * Data injection script for Minimal template
 * Populates the static HTML template with data received via postMessage
 */

(function () {
  "use strict";

  // Format ISO date string to localized format (e.g., "7 Janeiro, 2025")
  function formatDate(dateString) {
    if (!dateString) return "";
    try {
      // Parse date string manually to avoid timezone issues
      // Handles both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss" formats
      const dateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (!dateMatch) {
        // Fallback to Date object if format doesn't match
        const date = new Date(dateString);
        const months = [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro",
        ];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
      }

      // Extract year, month, day from the string directly (no timezone conversion)
      const year = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateMatch[3], 10);

      const months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return `${day} ${months[month]}, ${year}`;
    } catch {
      return dateString;
    }
  }

  // Format number as Brazilian currency (R$ 12.500,00)
  function formatCurrency(value) {
    if (!value) return "";

    // If value is already formatted as currency, return it as is
    if (typeof value === "string" && value.includes("R$")) {
      return value;
    }

    // Convert to number, handling strings that might have formatting
    let numValue;
    if (typeof value === "string") {
      // Remove all non-numeric characters except comma and dot
      const cleaned = value.replace(/[^\d,.-]/g, "");
      // Replace comma with dot for decimal separator
      const normalized = cleaned.replace(",", ".");
      numValue = parseFloat(normalized);
    } else {
      numValue = parseFloat(value);
    }

    if (isNaN(numValue)) return "";

    // Format with Brazilian locale: thousands separator (.) and decimal separator (,)
    return `R$ ${numValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Convert hex to RGB
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Darken a color by a percentage
  function darkenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = (100 - percent) / 100;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  // Lighten a color by a percentage
  function lightenColor(hex, percent) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const factor = percent / 100;
    const r = Math.round(rgb.r + (255 - rgb.r) * factor);
    const g = Math.round(rgb.g + (255 - rgb.g) * factor);
    const b = Math.round(rgb.b + (255 - rgb.b) * factor);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  // Get gradient colors for hero background based on mainColor
  function getHeroGradientColors(mainColor) {
    // Lookup table for known colors (matching React component values)
    const colorMap = {
      "#4F21A1": { dark: "#200D42", light: "#A46EDB" },
      "#BE8406": { dark: "#2B1B01", light: "#CEA605" },
      "#9B3218": { dark: "#2B0707", light: "#BE4E3F" },
      "#05722C": { dark: "#072B14", light: "#4ABE3F" },
      "#182E9B": { dark: "#070F2B", light: "#443FBE" },
      "#212121": { dark: "#0D0D0D", light: "#3A3A3A" },
      // Handle lowercase versions too
      "#4f21a1": { dark: "#200D42", light: "#A46EDB" },
      "#be8406": { dark: "#2B1B01", light: "#CEA605" },
      "#9b3218": { dark: "#2B0707", light: "#BE4E3F" },
      "#05722c": { dark: "#072B14", light: "#4ABE3F" },
      "#182e9b": { dark: "#070F2B", light: "#443FBE" },
    };

    // Check if we have a known color mapping
    if (colorMap[mainColor]) {
      return colorMap[mainColor];
    }

    // Fallback: calculate colors dynamically
    return {
      dark: darkenColor(mainColor, 60),
      light: lightenColor(mainColor, 30),
    };
  }

  // Update simple text field
  function updateTextField(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== null && value !== undefined) {
      element.textContent = value;
    } else if (!element) {
      console.warn(`Minimal template: Element not found: ${elementId}`);
    }
  }

  // Update title field with each word wrapped in a span
  function updateTitleWithWordSpans(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== null && value !== undefined) {
      // Split by whitespace and filter out empty strings
      const words = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);
      // Wrap each word in a span and join with spaces
      element.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
    } else if (!element) {
      console.warn(`Minimal template: Element not found: ${elementId}`);
    }
  }

  // Hide/show section
  function toggleSectionVisibility(sectionSelector, shouldHide) {
    const section = document.querySelector(sectionSelector);
    if (section) {
      if (shouldHide) {
        section.style.display = "none";
      } else {
        section.style.display = "";
      }
    }
  }

  // Hide/show element
  function toggleElementVisibility(elementId, shouldHide) {
    const element = document.getElementById(elementId);
    if (element) {
      if (shouldHide) {
        element.style.display = "none";
      } else {
        element.style.display = "";
      }
    }
  }

  function updateFooterEmailVisualize(email, fallback) {
    const button = document.querySelector(".copy-email-button");
    if (!button) return;
    const emailValue = email || fallback || "";
    if (emailValue) {
      button.setAttribute("data-copy-email", emailValue);
      const textEl = document.getElementById("footer-email-visualize");
      if (textEl) {
        textEl.textContent = emailValue;
      }
    }
  }

  function updateFooterPhoneVisualize(phone) {
    const phoneElement = document.getElementById("footer-phone-visualize");
    if (phoneElement && phone) {
      phoneElement.textContent = phone;
    }
  }

  function renderClientsSectionVisualize(clients) {
    const sectionSelector = ".section_partners--dynamic";
    if (!clients) {
      const section = document.querySelector(sectionSelector);
      if (section) {
        section.style.display = "none";
      }
      return;
    }

    const section = document.querySelector(sectionSelector);
    if (section) {
      section.style.display = clients.hideSection === true ? "none" : "";
    }

    const titleEl = document.getElementById("clients-title-visualize");
    if (titleEl && clients.title) {
      titleEl.textContent = clients.title;
    }

    const descriptionEl = document.getElementById(
      "clients-description-visualize"
    );
    if (descriptionEl && clients.description) {
      descriptionEl.textContent = clients.description;
    }

    const paragraphs = clients.paragraphs || [];
    const paragraphOne = document.getElementById("clients-paragraph-1-visualize");
    if (paragraphOne && paragraphs[0]) {
      paragraphOne.textContent = paragraphs[0];
    }
    const paragraphTwo = document.getElementById("clients-paragraph-2-visualize");
    if (paragraphTwo && paragraphs[1]) {
      paragraphTwo.textContent = paragraphs[1];
    }

    const logosContainer = document.getElementById("clients-logos-visualize");
    if (logosContainer) {
      const template =
        logosContainer.querySelector("[data-logo-template]") ||
        document.createElement("div");
      logosContainer.innerHTML = "";
      const logos = clients.items || [];
      logos.forEach((logo) => {
        const clone = template.cloneNode(true);
        clone.removeAttribute("data-logo-template");
        const textElement = clone.querySelector(".logo-text");
        const imgElement = clone.querySelector(".logo-img");
        if (logo.logo && imgElement) {
          imgElement.src = logo.logo;
          imgElement.alt = logo.name || "Cliente";
          imgElement.style.display = "block";
          if (textElement) {
            textElement.style.display = "none";
          }
        } else {
          if (imgElement) {
            imgElement.style.display = "none";
          }
          if (textElement) {
            textElement.textContent = logo.name || "";
            textElement.style.display = "block";
          }
        }
        logosContainer.appendChild(clone);
      });

      if (logos.length === 0 && template) {
        const placeholder = template.cloneNode(true);
        placeholder.removeAttribute("data-logo-template");
        const textElement = placeholder.querySelector(".logo-text");
        if (textElement) {
          textElement.textContent = "Sua marca";
        }
        const imgElement = placeholder.querySelector(".logo-img");
        if (imgElement) {
          imgElement.style.display = "none";
        }
        logosContainer.appendChild(placeholder);
      }
    }
  }

  // Icon mapping for expertise topics
  const iconMap = {
    AwardIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.361 16.7373C20.4957 18.0193 19.1255 18.9247 17.5311 19.157C17.2586 19.2051 16.9782 19.2291 16.6898 19.2291C16.4013 19.2291 16.1209 19.2051 15.8485 19.157C14.254 18.9247 12.8839 18.0193 12.0185 16.7373C11.4256 15.8479 11.0811 14.7822 11.0811 13.6204C11.0811 10.5196 13.5889 8.01172 16.6898 8.01172C19.7906 8.01172 22.2985 10.5196 22.2985 13.6204C22.2985 14.7822 21.9539 15.8479 21.361 16.7373Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M22.7761 21.5215C22.4796 21.5936 22.2473 21.818 22.1832 22.1144L21.9027 23.2923C21.7505 23.9333 20.9332 24.1256 20.5086 23.6208L16.6867 19.23L12.8647 23.6288C12.4401 24.1336 11.6228 23.9413 11.4706 23.3003L11.1901 22.1224C11.118 21.826 10.8856 21.5936 10.5972 21.5295L9.27514 21.217C8.6662 21.0728 8.44986 20.3116 8.89055 19.8709L12.0154 16.7461C12.8807 18.0281 14.2509 18.9335 15.8453 19.1659C16.1178 19.2139 16.3982 19.238 16.6867 19.238C16.9751 19.238 17.2555 19.2139 17.528 19.1659C19.1224 18.9335 20.4926 18.0281 21.3579 16.7461L24.4828 19.8709C24.9234 20.3036 24.7071 21.0648 24.0982 21.209L22.7761 21.5215Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.6268 12.1465C17.6909 12.2747 17.8592 12.4029 18.0114 12.4269L18.8687 12.5711C19.4136 12.6593 19.5418 13.0599 19.1492 13.4525L18.4841 14.1175C18.372 14.2297 18.3079 14.446 18.3479 14.6063L18.5402 15.4316C18.6925 16.0806 18.3479 16.337 17.771 15.9924L16.9698 15.5197C16.8256 15.4316 16.5852 15.4316 16.441 15.5197L15.6397 15.9924C15.0628 16.3289 14.7183 16.0806 14.8705 15.4316L15.0628 14.6063C15.0949 14.4541 15.0388 14.2297 14.9266 14.1175L14.2616 13.4525C13.869 13.0599 13.9972 12.6673 14.542 12.5711L15.3994 12.4269C15.5436 12.4029 15.7118 12.2747 15.7759 12.1465L16.2487 11.201C16.481 10.6882 16.8977 10.6882 17.1541 11.201L17.6268 12.1465Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    BellIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6999 13.5965V15.9121C11.6999 16.4009 11.4915 17.146 11.2432 17.5627L10.3217 19.0931C9.75284 20.0385 10.1455 21.0882 11.1871 21.4407C14.6404 22.5945 18.3662 22.5945 21.8196 21.4407C22.7891 21.1202 23.2137 19.9744 22.6849 19.0931L21.7635 17.5627C21.5231 17.146 21.3148 16.4009 21.3148 15.9121V13.5965C21.3148 10.9524 19.1514 8.78906 16.5073 8.78906C13.8552 8.78906 11.6999 10.9444 11.6999 13.5965Z" stroke="white" stroke-width="1.20187" stroke-linecap="round"/><path d="M17.2208 8.86104C16.4516 8.76489 15.7145 8.82098 15.0254 9.02129C15.2578 8.42837 15.8346 8.01172 16.5077 8.01172C17.1807 8.01172 17.7576 8.42837 17.99 9.02129C17.7416 8.94917 17.4852 8.89309 17.2208 8.86104Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.911 21.7305C18.911 23.0525 17.8293 24.1342 16.5072 24.1342C15.8502 24.1342 15.2413 23.8618 14.8086 23.4291C14.3759 22.9964 14.1035 22.3875 14.1035 21.7305" stroke="white" stroke-width="1.20187"/></svg>',
    BubblesIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7769 16.2325C16.5068 16.2325 14.6665 14.3922 14.6665 12.1221C14.6665 9.852 16.5068 8.01172 18.7769 8.01172C21.047 8.01172 22.8873 9.852 22.8873 12.1221C22.8873 14.3922 21.047 16.2325 18.7769 16.2325Z" stroke="white" stroke-width="1.20187"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3809 21.9864C10.018 21.9864 8.91309 20.8816 8.91309 19.5186C8.91309 18.1557 10.018 17.0508 11.3809 17.0508C12.7439 17.0508 13.8488 18.1557 13.8488 19.5186C13.8488 20.8816 12.7439 21.9864 11.3809 21.9864Z" stroke="white" stroke-width="1.20187"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.602 24.036C18.4691 24.036 17.5508 23.1176 17.5508 21.9848C17.5508 20.8519 18.4691 19.9336 19.602 19.9336C20.7348 19.9336 21.6531 20.8519 21.6531 21.9848C21.6531 23.1176 20.7348 24.036 19.602 24.036Z" stroke="white" stroke-width="1.20187"/></svg>',
    BulbIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.4681 19.9375C11.6252 18.8238 10.1108 16.6524 10.1108 14.3448C10.1108 10.3787 13.7565 7.26983 17.8749 8.16723C19.6857 8.56785 21.2722 9.76971 22.0974 11.4283C23.772 14.7935 22.0093 18.3671 19.4213 19.9295V20.8589C19.4213 21.0913 19.5094 21.6281 18.6521 21.6281H14.2372C13.3559 21.6361 13.4681 21.2916 13.4681 20.8669V19.9375Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6304 24.039C15.4652 23.5182 17.4042 23.5182 19.2391 24.039" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    CircleIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.38281 18.4062C9.24014 21.1625 11.5477 23.2858 14.4162 23.8707" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.0625 15.2069C8.47113 11.1606 11.8844 8.01172 16.0349 8.01172C20.1853 8.01172 23.5986 11.1686 24.0073 15.2069" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.6465 23.8777C20.5069 23.2928 22.8065 21.1936 23.6799 18.4453" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ClockIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.1726 24.0366C11.7497 24.0366 8.16016 20.447 8.16016 16.0242C8.16016 11.6013 11.7497 8.01172 16.1726 8.01172C20.5955 8.01172 24.185 11.6013 24.185 16.0242C24.185 20.447 20.5955 24.0366 16.1726 24.0366Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.147 18.5713L16.6631 17.089C16.2305 16.8326 15.8779 16.2157 15.8779 15.7109V12.4258" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    CrownIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.70996 11.2178C8.70996 10.1521 9.32692 9.89572 10.0801 10.6489L12.1553 12.7241C12.4678 13.0366 12.9806 13.0366 13.2851 12.7241L16.1535 9.84765C16.466 9.53516 16.9788 9.53516 17.2833 9.84765L20.1597 12.7241C20.4722 13.0366 20.985 13.0366 21.2895 12.7241L23.3647 10.6489C24.1179 9.89572 24.7348 10.1521 24.7348 11.2178V18.9017C24.7348 21.3054 23.1324 22.9079 20.7286 22.9079H12.7162C10.5047 22.8999 8.70996 21.1051 8.70996 18.8937V11.2178Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    CubeIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.73486 12.4219L15.8098 16.5162L22.8368 12.4459" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.8105 23.7751V16.5078" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.87406 10.8198C8.90456 11.3566 8.11133 12.7027 8.11133 13.8084V18.3355C8.11133 19.4412 8.90456 20.7873 9.87406 21.3241L14.1527 23.7038C15.0661 24.2086 16.5645 24.2086 17.4779 23.7038L21.7565 21.3241C22.726 20.7873 23.5193 19.4412 23.5193 18.3355V13.8084C23.5193 12.7027 22.726 11.3566 21.7565 10.8198L17.4779 8.44009C16.5564 7.93531 15.0661 7.93531 14.1527 8.4481L9.87406 10.8198Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    DiamondIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5797 8.01172C11.2175 8.01172 10.6166 8.69278 10.248 9.52607L8.19685 14.1412C7.82827 14.9745 8.02858 16.2165 8.64554 16.8895L14.1421 22.9309C15.1837 24.0686 16.8823 24.0686 17.9159 22.9309L23.4045 16.8815C24.0214 16.2004 24.2217 14.9665 23.8451 14.1332L21.794 9.51806C21.4254 8.69277 20.8244 8.01172 19.4623 8.01172H12.5797Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.21338 12.6992H22.8345" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    EyeIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6482 19.1158C15.0618 19.1158 13.7798 17.8338 13.7798 16.2474C13.7798 14.6609 15.0618 13.3789 16.6482 13.3789C18.2347 13.3789 19.5167 14.6609 19.5167 16.2474C19.5167 17.8338 18.2347 19.1158 16.6482 19.1158Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.9471 18.3228C24.6682 17.193 24.6682 15.2941 23.9471 14.1643C22.1123 11.2799 19.4762 9.61328 16.6478 9.61328C13.8194 9.61328 11.1833 11.2799 9.34846 14.1643C8.62734 15.2941 8.62734 17.193 9.34846 18.3228C11.1833 21.2073 13.8194 22.8739 16.6478 22.8739C19.4762 22.8739 22.1123 21.2073 23.9471 18.3228Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    FolderIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0386 20.0812C24.0386 23.2861 23.2373 24.0874 20.0323 24.0874H12.0199C8.81492 24.0874 8.01367 23.2861 8.01367 20.0812V12.0687C8.01367 8.86374 8.81492 8.0625 12.0199 8.0625H13.2218C14.4236 8.0625 14.688 8.41505 15.1447 9.02399L16.3466 10.6265C16.6511 11.0271 16.8274 11.2675 17.6286 11.2675H20.0323C23.2373 11.2675 24.0386 12.0687 24.0386 15.2737V20.0812Z" stroke="white" stroke-width="1.20187"/></svg>',
    GearIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.2236 18.7801C14.896 18.7801 13.8198 17.7039 13.8198 16.3764C13.8198 15.0488 14.896 13.9727 16.2236 13.9727C17.5511 13.9727 18.6273 15.0488 18.6273 16.3764C18.6273 17.7039 17.5511 18.7801 16.2236 18.7801Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.2124 15.6703C8.2124 14.837 8.89346 14.1479 9.73477 14.1479C11.185 14.1479 11.7779 13.1223 11.0488 11.8644C10.6322 11.1432 10.8805 10.2058 11.6097 9.78914L12.9958 8.99591C13.6288 8.61932 14.4461 8.84367 14.8227 9.47665L14.9108 9.62889C15.6319 10.8868 16.8178 10.8868 17.5469 9.62889L17.635 9.47665C18.0116 8.84367 18.8289 8.61932 19.4619 8.99591L20.848 9.78914C21.5772 10.2058 21.8255 11.1432 21.4089 11.8644C20.6798 13.1223 21.2727 14.1479 22.7229 14.1479C23.5562 14.1479 24.2453 14.829 24.2453 15.6703V17.0805C24.2453 17.9138 23.5642 18.6028 22.7229 18.6028C21.2727 18.6028 20.6798 19.6284 21.4089 20.8864C21.8255 21.6155 21.5772 22.5449 20.848 22.9616L19.4619 23.7548C18.8289 24.1314 18.0116 23.9071 17.635 23.2741L17.5469 23.1218C16.8258 21.8639 15.6399 21.8639 14.9108 23.1218L14.8227 23.2741C14.4461 23.9071 13.6288 24.1314 12.9958 23.7548L11.6097 22.9616C10.8805 22.5449 10.6322 21.6075 11.0488 20.8864C11.7779 19.6284 11.185 18.6028 9.73477 18.6028C8.89346 18.6028 8.2124 17.9138 8.2124 17.0805V15.6703Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    GlobeIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.425 24.0366C11.9999 24.0366 8.4126 20.4493 8.4126 16.0242C8.4126 11.599 11.9999 8.01172 16.425 8.01172C20.8502 8.01172 24.4375 11.599 24.4375 16.0242C24.4375 20.4493 20.8502 24.0366 16.425 24.0366Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.2187 8.8125H14.02C12.4575 13.4918 12.4575 18.5556 14.02 23.2349H13.2187" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.8276 8.8125C20.3901 13.4918 20.3901 18.5556 18.8276 23.2349" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.21387 19.2309V18.4297C13.8931 19.9921 18.957 19.9921 23.6363 18.4297V19.2309" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.21387 13.621C13.8931 12.0586 18.957 12.0586 23.6363 13.621" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    HeartIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.1246 23.0025C13.8009 22.2093 8.60889 18.9002 8.60889 13.2915C8.60889 10.8156 10.604 8.8125 13.0638 8.8125C14.5221 8.8125 15.8121 9.51759 16.6213 10.6073C17.4306 9.51759 18.7286 8.8125 20.1789 8.8125C22.6387 8.8125 24.6338 10.8156 24.6338 13.2915C24.6338 18.9002 19.4417 22.2093 17.1181 23.0025C16.8457 23.0987 16.397 23.0987 16.1246 23.0025Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    HexagonalIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.06104 18.2436C9.06104 19.9422 9.06104 19.9422 10.6635 21.0239L15.0704 23.5719C15.7354 23.9565 16.8171 23.9565 17.4741 23.5719L21.8809 21.0239C23.4834 19.9422 23.4834 19.9422 23.4834 18.2516V13.6204C23.4834 11.9298 23.4834 11.9298 21.8809 10.8481L17.4741 8.30017C16.8171 7.91557 15.7354 7.91557 15.0704 8.30017L10.6635 10.8481C9.06104 11.9298 9.06104 11.9298 9.06104 13.6204V18.2436Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16.2724 18.3387C14.9448 18.3387 13.8687 17.2625 13.8687 15.935C13.8687 14.6074 14.9448 13.5312 16.2724 13.5312C17.5999 13.5312 18.6761 14.6074 18.6761 15.935C18.6761 17.2625 17.5999 18.3387 16.2724 18.3387Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    KeyIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.9255 19.8641L13.1517 23.63C12.8793 23.9104 12.3424 24.0787 11.9578 24.0226L10.2111 23.7822C9.63422 23.7021 9.09738 23.1572 9.00925 22.5803L8.76887 20.8336C8.71279 20.449 8.89707 19.9122 9.16148 19.6398L12.9273 15.8739C12.2863 13.7907 12.7831 11.427 14.4337 9.78447C16.7973 7.4208 20.6353 7.4208 23.007 9.78447C25.3787 12.1481 25.3787 16.0021 23.015 18.3658C21.3644 20.0083 19.0008 20.5131 16.9255 19.8641Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.6777 20.418L14.5206 22.2608" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.7746 15.2162C18.1108 15.2162 17.5728 14.6781 17.5728 14.0144C17.5728 13.3506 18.1108 12.8125 18.7746 12.8125C19.4384 12.8125 19.9765 13.3506 19.9765 14.0144C19.9765 14.6781 19.4384 15.2162 18.7746 15.2162Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    PlayIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0928 13.1171C10.0928 9.57558 12.6007 8.12532 15.6694 9.89607L18.1453 11.3223L20.6211 12.7485C23.6899 14.5193 23.6899 17.4198 20.6211 19.1905L18.1453 20.6167L15.6694 22.0429C12.6007 23.8137 10.0928 22.3634 10.0928 18.8219V15.9695V13.1171Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    StarIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.3699 12.0424C19.5622 12.435 20.075 12.8116 20.5077 12.8837L23.0637 13.3083C24.6982 13.5808 25.0828 14.7666 23.905 15.9364L21.9179 17.9235C21.5814 18.26 21.3971 18.909 21.5012 19.3738L22.0701 21.8336C22.5188 23.7806 21.4852 24.5338 19.7625 23.5162L17.3668 22.098C16.9342 21.8416 16.221 21.8416 15.7804 22.098L13.3846 23.5162C11.67 24.5338 10.6284 23.7726 11.0771 21.8336L11.6459 19.3738C11.7501 18.909 11.5658 18.26 11.2293 17.9235L9.24221 15.9364C8.0724 14.7666 8.44898 13.5808 10.0835 13.3083L12.6395 12.8837C13.0641 12.8116 13.5769 12.435 13.7692 12.0424L15.1794 9.222C15.9486 7.69162 17.1986 7.69162 17.9597 9.222L19.3699 12.0424Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    SwitchIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.925 9.61328C21.4665 9.61328 24.3349 12.4817 24.3349 16.0232C24.3349 19.5647 21.4665 22.4332 17.925 22.4332H14.72C11.1785 22.4332 8.31006 19.5647 8.31006 16.0232C8.31006 12.4817 11.1785 9.61328 14.72 9.61328H17.925Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.9237 19.2303C16.1537 19.2303 14.7188 17.7953 14.7188 16.0253C14.7188 14.2552 16.1537 12.8203 17.9237 12.8203C19.6938 12.8203 21.1287 14.2552 21.1287 16.0253C21.1287 17.7953 19.6938 19.2303 17.9237 19.2303Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ThunderIcon:
      '<svg width="40" height="40" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1666 16.7567V22.5256C14.1666 23.375 15.2243 23.7756 15.7851 23.1346L21.8506 16.2439C22.3794 15.643 21.9547 14.7055 21.1535 14.7055H18.6776V8.93655C18.6776 8.08723 17.62 7.68661 17.0591 8.32761L10.9937 15.2183C10.4729 15.8192 10.8976 16.7567 11.6908 16.7567H14.1666Z" stroke="white" stroke-width="1.20187" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  // Get SVG icon markup by icon name
  function getIconSvg(iconName) {
    if (!iconName || typeof iconName !== "string") {
      return iconMap.AwardIcon; // Default icon
    }
    return iconMap[iconName] || iconMap.AwardIcon; // Return icon or default
  }

  // Hide loading and show content
  function showContent() {
    const loadingEl = document.getElementById("minimal-template-loading");
    const contentEl = document.getElementById("minimal-template-content");

    if (loadingEl) {
      loadingEl.style.opacity = "0";
      setTimeout(() => {
        loadingEl.style.display = "none";
      }, 500); // Match transition duration
    }

    if (contentEl) {
      // Small delay to ensure data is fully injected
      setTimeout(() => {
        contentEl.style.opacity = "1";
        // Dispatch event to signal data injection is complete
        // This allows animations to reinitialize with populated content
        window.dispatchEvent(
          new CustomEvent("minimal-template-data-injected", {
            bubbles: true,
            detail: { timestamp: Date.now() },
          })
        );
      }, 100);
    } else {
      // Dispatch event even if no content element found
      window.dispatchEvent(
        new CustomEvent("minimal-template-data-injected", {
          bubbles: true,
          detail: { timestamp: Date.now() },
        })
      );
    }
  }

  // Render introduction services list
  function renderIntroductionServices(containerId, services) {
    const container = document.getElementById(containerId);
    if (!container || !services || !Array.isArray(services)) return;

    // Filter out hidden services and sort
    const visibleServices = services
      .filter((s) => !s.hideItem)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Clear existing content
    container.innerHTML = "";

    // Create new items
    visibleServices.forEach((service) => {
      const div = document.createElement("div");
      div.className = "text-weight-medium";
      div.textContent = service.serviceName || "";
      container.appendChild(div);
    });
  }

  // Render team members list
  function renderTeamMembers(containerId, members) {
    const container = document.getElementById(containerId);
    if (!container || !members || !Array.isArray(members)) return;

    // Filter out hidden members and sort
    const visibleMembers = members
      .filter((m) => !m.hideMember)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first child)
    const template = container.querySelector(".team_card");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each member
    visibleMembers.forEach((member) => {
      const clone = template.cloneNode(true);

      // Update image
      const img = clone.querySelector(".team_image img");
      if (img && member.image) {
        img.src = member.image;
        img.srcset = member.image;
      } else if (member.hidePhoto && img) {
        img.style.display = "none";
      }

      // Update name
      const nameDiv = clone.querySelector(".team_name .text-size-medium");
      if (nameDiv) {
        nameDiv.textContent = member.name || "";
      }

      // Update role
      const roleDiv = clone.querySelector(".team_name .opacity-60 div");
      if (roleDiv) {
        roleDiv.textContent = member.role || "";
      }

      container.appendChild(clone);
    });
  }

  // Render expertise topics list
  function renderExpertiseTopics(containerId, topics, hideIcon) {
    const container = document.getElementById(containerId);
    if (!container || !topics || !Array.isArray(topics)) return;

    // Filter out hidden topics and sort
    const visibleTopics = topics
      .filter((t) => !t.hideItem)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first child)
    const template = container.querySelector(".expertise_card");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each topic
    visibleTopics.forEach((topic) => {
      const clone = template.cloneNode(true);

      // Update icon (if provided and not globally hidden)
      if (!hideIcon && topic.icon) {
        const iconContainer = clone.querySelector(".expertise_icon");
        if (iconContainer) {
          // Get SVG markup from icon name
          const iconSvg = getIconSvg(topic.icon);
          iconContainer.innerHTML = iconSvg;
        }
      } else if (hideIcon) {
        const iconContainer = clone.querySelector(".expertise_icon");
        if (iconContainer) {
          iconContainer.style.display = "none";
        }
      }

      // Update title
      const titleDiv = clone.querySelector(
        ".text-weight-medium.text-size-medium"
      );
      if (titleDiv && !topic.hideTitleField) {
        titleDiv.textContent = topic.title || "";
      } else if (titleDiv && topic.hideTitleField) {
        titleDiv.style.display = "none";
      }

      // Update description
      const descP = clone.querySelector(".opacity_80 p");
      if (descP && !topic.hideDescription) {
        descP.textContent = topic.description || "";
      } else if (descP && topic.hideDescription) {
        descP.style.display = "none";
      }

      container.appendChild(clone);
    });
  }

  // Render results list
  function renderResults(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items || !Array.isArray(items)) return;

    // Filter out hidden items and sort
    const visibleItems = items
      .filter((r) => !r.hideItem)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first child)
    const template = container.querySelector(".proof_card");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each result
    visibleItems.forEach((item) => {
      const clone = template.cloneNode(true);

      // Update image
      const img = clone.querySelector(".proof_image img");
      if (img && item.photo && !item.hidePhoto) {
        img.src = item.photo;
        img.srcset = item.photo;
      } else if (img && item.hidePhoto) {
        img.style.display = "none";
      }

      // Update client name
      const nameDiv = clone.querySelector(
        ".proof_name .text-size-large.text-weight-medium"
      );
      if (nameDiv) {
        nameDiv.textContent = item.client || "";
      }

      // Update Instagram link
      const instagramLink = clone.querySelector(".proof_name .text-style-link");
      if (instagramLink && item.instagram) {
        instagramLink.textContent = `@${item.instagram}`;
        instagramLink.href = `https://instagram.com/${item.instagram}`;
      }

      // Update investment
      const investmentDiv = clone.querySelector(
        ".proof_roi .roi_wrap:first-child .opacity_80"
      );
      if (investmentDiv) {
        investmentDiv.textContent = formatCurrency(item.investment);
      }

      // Update ROI
      const roiDiv = clone.querySelector(
        ".proof_roi .roi_wrap:last-child .text-color-alternate"
      );
      if (roiDiv) {
        roiDiv.textContent = formatCurrency(item.roi);
      }

      container.appendChild(clone);
    });
  }

  // Escape HTML to prevent XSS attacks
  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Generate HTML string for a single testimonial item
  function generateTestimonialHTML(item) {
    const testimonial = escapeHtml(item.testimonial || "");
    const name = escapeHtml(item.name || "");
    const role = escapeHtml(item.role || "");
    const photo = item.photo || "";
    const showPhoto = photo && !item.hidePhoto;

    // Build photo HTML - hide image if hidePhoto is true or photo is missing
    const photoHTML = showPhoto
      ? `<div class="slider_image">
          <img
            src="${escapeHtml(photo)}"
            loading="lazy"
            alt=""
            class="image"
          />
        </div>`
      : `<div class="slider_image" style="display: none;">
          <img
            src="images/slider-1.jpg"
            loading="lazy"
            alt=""
            class="image"
          />
        </div>`;

    return `<div class="slide_wrap w-slide">
      <div class="slide">
        <div class="line"></div>
        <div data-reveal-group="" class="slider_content">
          <p class="heading-style-h3">${testimonial}</p>
          <div class="slider_name-wrap">
            ${photoHTML}
            <div class="slider-name">
              <div class="text-weight-medium">${name}</div>
              <div class="opacity_80">${role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  // Rebuild Webflow slider after content injection
  function rebuildSlider(sliderElement) {
    if (!sliderElement) return;

    function attemptRebuild() {
      // Strategy 1: Access Webflow store directly (independent of ix3)
      if (window.Webflow && window.Webflow.store) {
        const store = window.Webflow.store;
        if (store.components && Array.isArray(store.components)) {
          const maskElement = sliderElement.querySelector(
            ".mask.w-slider-mask"
          );

          // Find slider component - check by class name and element matching
          const sliderComponent = store.components.find((comp) => {
            if (!comp || !comp.el) return false;
            const compEl = comp.el;
            return (
              compEl === sliderElement ||
              (compEl.classList && compEl.classList.contains("w-slider")) ||
              (maskElement && compEl === maskElement) ||
              sliderElement.contains(compEl) ||
              (compEl.classList && compEl.classList.contains("slider"))
            );
          });

          if (sliderComponent) {
            // Try to destroy and reinit (most reliable)
            if (typeof sliderComponent.destroy === "function") {
              try {
                sliderComponent.destroy();
              } catch {
                // Silently fail
              }
            }

            // Reinitialize
            if (typeof sliderComponent.init === "function") {
              try {
                sliderComponent.init();
                return true; // Success
              } catch {
                // Silently fail
              }
            }

            if (typeof sliderComponent.reinit === "function") {
              try {
                sliderComponent.reinit();
                return true;
              } catch {
                // Silently fail
              }
            }

            // Try refresh/update
            if (typeof sliderComponent.refresh === "function") {
              try {
                sliderComponent.refresh();
              } catch {
                // Silently fail
              }
            }

            // Check for internal slider object
            if (sliderComponent.slider) {
              const internalSlider = sliderComponent.slider;
              if (typeof internalSlider.refresh === "function") {
                try {
                  internalSlider.refresh();
                } catch {
                  // Silently fail
                }
              }
              if (typeof internalSlider.update === "function") {
                try {
                  internalSlider.update();
                } catch {
                  // Silently fail
                }
              }
            }
          }
        }
      }

      // Strategy 2: Use ix3 API
      if (window.Webflow && window.Webflow.require) {
        try {
          const ix3 = window.Webflow.require("ix3");
          if (ix3 && ix3.ready) {
            ix3
              .ready()
              .then(() => {
                const instance = ix3.getInstance();
                if (instance) {
                  if (typeof instance.scheduleRebuild === "function") {
                    instance.scheduleRebuild(sliderElement);
                  }
                  if (
                    typeof instance.scheduleRebuildForElement === "function"
                  ) {
                    instance.scheduleRebuildForElement(sliderElement);
                  }
                }
              })
              .catch(() => {});
          }
        } catch {
          // Silently fail
        }
      }

      // Strategy 3: Trigger events
      window.dispatchEvent(new Event("resize"));

      return false;
    }

    // Also try accessing slider directly via element data properties
    function tryDirectAccess() {
      const maskElement = sliderElement.querySelector(".mask.w-slider-mask");
      if (maskElement && window.$ && typeof window.$ === "function") {
        try {
          const $slider = window.$(sliderElement);
          const sliderData = $slider.data();

          // Look for slider instance in data - Webflow uses ".wSlider" key
          const sliderInstance =
            sliderData[".wSlider"] || sliderData.slider || sliderData.wSlider;

          if (sliderInstance && sliderInstance.slides) {
            // The slider instance needs to rebuild its slides collection
            const domSlides = maskElement.querySelectorAll(".w-slide");

            if (sliderInstance.slides.length !== domSlides.length) {
              const newSlidesCollection = window.$(domSlides);
              sliderInstance.slides = newSlidesCollection;

              if (typeof sliderInstance.index !== "undefined") {
                sliderInstance.index = 0;
              }
            }
          }
        } catch {
          // Silently fail
        }
      }

      const refreshEvent = new CustomEvent("refresh", { bubbles: true });
      sliderElement.dispatchEvent(refreshEvent);
      const maskEl = sliderElement.querySelector(".mask.w-slider-mask");
      if (maskEl) maskEl.dispatchEvent(refreshEvent);
    }

    // Try multiple times with delays
    setTimeout(() => {
      attemptRebuild();
      tryDirectAccess();
    }, 100);
    setTimeout(() => {
      attemptRebuild();
      tryDirectAccess();
    }, 300);
    setTimeout(() => {
      attemptRebuild();
      tryDirectAccess();
    }, 600);
    setTimeout(() => {
      attemptRebuild();
      tryDirectAccess();
    }, 1000);
    setTimeout(() => {
      attemptRebuild();
      tryDirectAccess();
    }, 2000);
  }

  // Render testimonials list
  function renderTestimonials(items) {
    // Find the mask element within the testimonials container using data attribute
    const parentContainer = document.querySelector(
      '[data-testimonials-container="true"]'
    );
    const container = parentContainer
      ? parentContainer.querySelector(".mask.w-slider-mask")
      : null;
    if (!container || !items || !Array.isArray(items)) return;

    // Filter out hidden items and sort
    const visibleItems = items
      .filter(() => true) // No hideItem for testimonials in the interface
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get the first slide as a template (preserve it for slider structure)
    const existingSlides = container.querySelectorAll(".w-slide");
    const templateSlide = existingSlides[0];

    if (!templateSlide) {
      // If no template exists, fall back to HTML injection
      const html = visibleItems
        .map((item) => generateTestimonialHTML(item))
        .join("");
      container.innerHTML = html;
      if (parentContainer) {
        rebuildSlider(parentContainer);
      }
      return;
    }

    // Update the first slide with first testimonial
    if (visibleItems.length > 0) {
      updateSlideContent(templateSlide, visibleItems[0]);
    }

    // Remove all other existing slides except the first one
    for (let i = existingSlides.length - 1; i > 0; i--) {
      existingSlides[i].remove();
    }

    // Clone template and create new slides for remaining testimonials
    for (let i = 1; i < visibleItems.length; i++) {
      const clone = templateSlide.cloneNode(true);
      updateSlideContent(clone, visibleItems[i]);
      container.appendChild(clone);
    }

    // Rebuild the slider after injecting new content
    if (parentContainer) {
      rebuildSlider(parentContainer);
    }
  }

  // Update slide content with testimonial data
  function updateSlideContent(slideElement, item) {
    // Update testimonial text
    const testimonialP = slideElement.querySelector(".heading-style-h3");
    if (testimonialP) {
      testimonialP.textContent = item.testimonial || "";
    }

    // Update photo
    const img = slideElement.querySelector(".slider_image img");
    const sliderImage = slideElement.querySelector(".slider_image");
    if (img && sliderImage) {
      if (item.photo && !item.hidePhoto) {
        img.src = item.photo;
        sliderImage.style.display = "";
      } else {
        sliderImage.style.display = "none";
      }
    }

    // Update name
    const nameDiv = slideElement.querySelector(
      ".slider-name .text-weight-medium"
    );
    if (nameDiv) {
      nameDiv.textContent = item.name || "";
    }

    // Update role
    const roleDiv = slideElement.querySelector(".slider-name .opacity_80");
    if (roleDiv) {
      roleDiv.textContent = item.role || "";
    }
  }

  // Render steps list
  function renderSteps(containerId, topics) {
    const container = document.getElementById(containerId);
    if (!container || !topics || !Array.isArray(topics)) return;

    // Filter out hidden items and sort
    const visibleTopics = topics
      .filter((s) => !s.hideItem)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first accordion item)
    const template = container.querySelector(".accordion_item");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each step
    visibleTopics.forEach((topic, index) => {
      const clone = template.cloneNode(true);

      // Update step number
      const numberDiv = clone.querySelector(".accordion_number");
      if (numberDiv) {
        numberDiv.textContent = `${String(index + 1).padStart(2, "0")}.`;
      }

      // Update title
      const titleDiv = clone.querySelector(".accordion_left .heading-style-h4");
      if (titleDiv && !topic.hideStepName) {
        titleDiv.textContent = topic.title || "";
      } else if (titleDiv && topic.hideStepName) {
        titleDiv.style.display = "none";
      }

      // Update description
      const descP = clone.querySelector(".accordion_open .accordion_margin p");
      if (descP && !topic.hideStepDescription) {
        descP.textContent = topic.description || "";
      } else if (descP && topic.hideStepDescription) {
        descP.style.display = "none";
      }

      // Set up accordion click handler
      const accordionOpen = clone.querySelector(".accordion_open");
      if (accordionOpen) {
        // Initially set height to 0 (closed)
        if (typeof gsap !== "undefined") {
          gsap.set(accordionOpen, {
            height: 0,
            overflow: "hidden",
          });
        } else {
          accordionOpen.style.height = "0";
          accordionOpen.style.overflow = "hidden";
        }

        // Add click handler to toggle accordion
        clone.addEventListener("click", (e) => {
          e.stopPropagation();

          // Kill any existing animations on this element
          if (typeof gsap !== "undefined") {
            gsap.killTweensOf(accordionOpen);
          }

          // Check current state - use data attribute for reliable tracking
          const isOpen = clone.dataset.isOpen === "true";

          if (isOpen) {
            // Close accordion
            clone.dataset.isOpen = "false";
            if (typeof gsap !== "undefined") {
              const currentHeight =
                accordionOpen.scrollHeight || accordionOpen.offsetHeight;
              gsap.fromTo(
                accordionOpen,
                { height: currentHeight },
                {
                  height: 0,
                  duration: 0.4,
                  ease: "power2.inOut",
                }
              );
            } else {
              accordionOpen.style.height = "0";
            }
          } else {
            // Open accordion
            clone.dataset.isOpen = "true";
            if (typeof gsap !== "undefined") {
              gsap.set(accordionOpen, { height: "auto" });
              const naturalHeight = accordionOpen.scrollHeight;
              gsap.set(accordionOpen, { height: 0 });
              gsap.to(accordionOpen, {
                height: naturalHeight,
                duration: 0.4,
                ease: "power2.inOut",
              });
            } else {
              accordionOpen.style.height = "auto";
            }
          }
        });
      }

      container.appendChild(clone);
    });

    // Update marquee text with step titles
    updateStepsMarquee(visibleTopics);
  }

  // Update marquee text with step titles
  function updateStepsMarquee(visibleTopics) {
    const stepTitles = visibleTopics
      .filter((topic) => !topic.hideStepName && topic.title)
      .map((topic) => topic.title)
      .filter((title) => title.trim().length > 0);

    if (stepTitles.length === 0) return;

    const marqueeText = stepTitles.join(" → ");

    const marqueeContent = document.querySelector(
      "[data-marquee-content] .about-marquee_text"
    );
    if (marqueeContent) {
      marqueeContent.textContent = marqueeText;
    }
  }

  // Render FAQ items
  function renderFAQItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items || !Array.isArray(items)) return;

    // Filter out hidden items and sort
    const visibleItems = items
      .filter((f) => !f.hideItem && !f.hideQuestion && !f.hideAnswer)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first accordion item)
    const template = container.querySelector(".accordion_item");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each FAQ item
    visibleItems.forEach((item, index) => {
      const clone = template.cloneNode(true);

      // Update question number
      const numberDiv = clone.querySelector(".accordion_left .opacity-60 div");
      if (numberDiv) {
        numberDiv.textContent = `${String(index + 1).padStart(2, "0")}.`;
      }

      // Update question
      const questionDiv = clone.querySelector(
        ".accordion_left .text-weight-medium.text-size-medium"
      );
      if (questionDiv) {
        questionDiv.textContent = item.question || "";
      }

      // Update answer
      const answerP = clone.querySelector(
        ".accordion_open .accordion_margin p"
      );
      if (answerP) {
        answerP.textContent = item.answer || "";
      }

      // Set up accordion click handler
      const accordionOpen = clone.querySelector(".accordion_open");
      if (accordionOpen) {
        // Initially set height to 0 (closed)
        if (typeof gsap !== "undefined") {
          gsap.set(accordionOpen, {
            height: 0,
            overflow: "hidden",
          });
        } else {
          accordionOpen.style.height = "0";
          accordionOpen.style.overflow = "hidden";
        }

        // Add click handler to toggle accordion
        clone.addEventListener("click", (e) => {
          e.stopPropagation();

          // Kill any existing animations on this element
          if (typeof gsap !== "undefined") {
            gsap.killTweensOf(accordionOpen);
          }

          // Check current state - use data attribute for reliable tracking
          const isOpen = clone.dataset.isOpen === "true";

          if (isOpen) {
            // Close accordion
            clone.dataset.isOpen = "false";
            if (typeof gsap !== "undefined") {
              const currentHeight =
                accordionOpen.scrollHeight || accordionOpen.offsetHeight;
              gsap.fromTo(
                accordionOpen,
                { height: currentHeight },
                {
                  height: 0,
                  duration: 0.4,
                  ease: "power2.inOut",
                }
              );
            } else {
              accordionOpen.style.height = "0";
            }
          } else {
            // Open accordion
            clone.dataset.isOpen = "true";
            if (typeof gsap !== "undefined") {
              gsap.set(accordionOpen, { height: "auto" });
              const naturalHeight = accordionOpen.scrollHeight;
              gsap.set(accordionOpen, { height: 0 });
              gsap.to(accordionOpen, {
                height: naturalHeight,
                duration: 0.4,
                ease: "power2.inOut",
              });
            } else {
              accordionOpen.style.height = "auto";
            }
          }
        });
      }

      container.appendChild(clone);
    });
  }

  // Render plans list
  function renderPlans(containerId, plans) {
    const container = document.getElementById(containerId);
    if (!container || !plans || !Array.isArray(plans)) return;

    // Filter out hidden plans and sort
    const visiblePlans = plans
      .filter((p) => !p.hideItem)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template - prefer one without is--center to avoid inheriting the class
    let template = container.querySelector(".pricing_card:not(.is--center)");
    if (!template) {
      template = container.querySelector(".pricing_card");
    }
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each plan
    visiblePlans.forEach((plan) => {
      const clone = template.cloneNode(true);

      // Normalize recommended value (handle both boolean and string)
      const isRecommended = plan.recommended === true;

      // Handle is--center class
      clone.classList.remove("is--center");
      if (isRecommended) {
        clone.classList.add("is--center");
      }

      // Handle badge
      let badge = clone.querySelector(".pricing_badge");
      if (isRecommended) {
        if (!badge) {
          badge = document.createElement("div");
          badge.className = "pricing_badge";
          badge.innerHTML = `
            <div class="embed_icon is--tiny w-embed">
              <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.56132 0.302089C4.75098 -0.0446829 5.24902 -0.0446824 5.43868 0.30209L6.6975 2.60375C6.74338 2.68764 6.81236 2.75662 6.89625 2.8025L9.19791 4.06132C9.54468 4.25098 9.54468 4.74902 9.19791 4.93868L6.89625 6.1975C6.81236 6.24338 6.74338 6.31236 6.6975 6.39625L5.43868 8.69791C5.24902 9.04468 4.75098 9.04468 4.56132 8.69791L3.3025 6.39625C3.25662 6.31236 3.18764 6.24338 3.10375 6.1975L0.802089 4.93868C0.455317 4.74902 0.455318 4.25098 0.80209 4.06132L3.10375 2.8025C3.18764 2.75662 3.25662 2.68764 3.3025 2.60375L4.56132 0.302089Z" fill="#E6E6E6"/>
              </svg>
            </div>
            <div class="text-weight-medium">Melhor Oferta</div>
          `;
          clone.insertBefore(badge, clone.firstChild);
        }
        badge.style.display = "";
      } else {
        if (badge) {
          badge.style.display = "none";
        }
      }

      // Handle pricing_top.is--best-offer class
      const pricingTop = clone.querySelector(".pricing_top");
      if (pricingTop) {
        if (isRecommended) {
          pricingTop.classList.add("is--best-offer");
        } else {
          pricingTop.classList.remove("is--best-offer");
        }
      }

      // Update title
      const titleDiv = clone.querySelector(
        ".pricing_name .text-size-large.text-weight-semibold"
      );
      if (titleDiv && !plan.hideTitleField) {
        titleDiv.textContent = plan.title || "";
      } else if (titleDiv && plan.hideTitleField) {
        titleDiv.style.display = "none";
      }

      // Update description
      const descDiv = clone.querySelector(".pricing_description .opacity_80");
      if (descDiv && !plan.hideDescription) {
        descDiv.textContent = plan.description || "";
      } else if (descDiv && plan.hideDescription) {
        descDiv.style.display = "none";
      }

      // Update price
      const priceDiv = clone.querySelector(
        ".pricing_price .heading-style-h3.text-weight-medium"
      );
      if (priceDiv && !plan.hidePrice) {
        priceDiv.textContent = formatCurrency(plan.value);
      } else if (priceDiv && plan.hidePrice) {
        priceDiv.style.display = "none";
      }

      // Update plan period
      const periodDiv = clone.querySelector(".pricing_price .opacity_80");
      if (periodDiv && !plan.hidePlanPeriod) {
        periodDiv.textContent = plan.planPeriod || "";
      } else if (periodDiv && plan.hidePlanPeriod) {
        periodDiv.style.display = "none";
      }

      // Update included items
      const includedContainer = clone.querySelector(".pricing_item-wrap");
      if (includedContainer && plan.includedItems) {
        const itemTemplate = includedContainer.querySelector(".pricing_item");
        if (itemTemplate) {
          includedContainer.innerHTML = "";
          const visibleItems = (plan.includedItems || [])
            .filter((item) => !item.hideItem)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

          visibleItems.forEach((item) => {
            const itemClone = itemTemplate.cloneNode(true);
            const itemText = itemClone.querySelector(
              ".pricing_item > div:last-child"
            );
            if (itemText) {
              itemText.textContent = item.description || item.item || "";
            }
            includedContainer.appendChild(itemClone);
          });
        }
      }

      // Update button
      const buttonText = clone.querySelector(
        ".pricing_button .btn-magnetic__text-p"
      );
      if (buttonText && !plan.hideButtonTitle) {
        buttonText.textContent = plan.buttonTitle || "Fechar pacote";
        const duplicate = clone.querySelector(
          ".pricing_button .btn-magnetic__text-p.is--duplicate"
        );
        if (duplicate) {
          duplicate.textContent = plan.buttonTitle || "Fechar pacote";
        }
      } else if (buttonText && plan.hideButtonTitle) {
        const button = clone.querySelector(".pricing_button");
        if (button) {
          button.style.display = "none";
        }
      }

      // Handle btn-magnetic__text-p.is--black class for recommended plans
      const allButtonTexts = clone.querySelectorAll(
        ".pricing_button .btn-magnetic__text-p"
      );
      allButtonTexts.forEach((textEl) => {
        if (isRecommended) {
          textEl.classList.add("is--black");
        } else {
          textEl.classList.remove("is--black");
        }
      });

      // Handle btn-magnetic__fill.is--white class for recommended plans
      const buttonFill = clone.querySelector(
        ".pricing_button .btn-magnetic__fill"
      );
      if (buttonFill) {
        if (isRecommended) {
          buttonFill.classList.add("is--white");
        } else {
          buttonFill.classList.remove("is--white");
        }
      }

      // Update button href
      const buttonLink = clone.querySelector(
        ".btn-animate-chars.is-invest"
      );
      if (buttonLink) {
        const isViewingMode = window.parent && window.parent !== window;
        
        if (isViewingMode) {
          // In viewing mode, send message to parent to open modal
          buttonLink.href = "#";
          buttonLink.removeAttribute("target");
          buttonLink.removeAttribute("rel");
          
          buttonLink.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Send message to parent window with selected plan
            window.parent.postMessage(
              {
                type: "PLAN_SELECTED",
                planId: plan.id || plan.title,
              },
              "*"
            );
          });
        } else if (plan.buttonWhereToOpen === "whatsapp" && plan.buttonPhone) {
          buttonLink.href = `https://wa.me/${plan.buttonPhone.replace(
            /\D/g,
            ""
          )}`;
          buttonLink.target = "_blank";
          buttonLink.rel = "noopener noreferrer";
        } else if (plan.buttonHref) {
          buttonLink.href = plan.buttonHref;
          buttonLink.target = "_blank";
          buttonLink.rel = "noopener noreferrer";
        }
      }

      container.appendChild(clone);
    });
  }

  // Update button configuration
  function updateButtons(buttonConfig) {
    if (!buttonConfig) return;

    // Update all buttons with id="buttonconfig-buttontitle"
    const buttons = document.querySelectorAll("#buttonconfig-buttontitle");
    buttons.forEach((button) => {
      if (buttonConfig.buttonTitle) {
        button.textContent = buttonConfig.buttonTitle;
        const duplicate = button
          .closest(".btn-magnetic__text")
          ?.querySelector(".is--duplicate");
        if (duplicate) {
          duplicate.textContent = buttonConfig.buttonTitle;
        }
      }
    });

    // Update button links
    const isViewingMode = window.parent && window.parent !== window;
    const buttonLinks = document.querySelectorAll(".btn-animate-chars");
    
    console.log("updateButtons called, isViewingMode:", isViewingMode);
    console.log("Found buttons:", buttonLinks.length);
    console.log("window.parent:", window.parent);
    console.log("window:", window);
    
    buttonLinks.forEach((link) => {
      // Skip if this is a pricing button (will be handled separately)
      if (link.classList.contains("is-invest")) {
        return;
      }

      const anchor = link.tagName === "A" ? link : link.querySelector("a");
      if (!anchor) return;

      if (isViewingMode) {
        // In viewing mode, scroll to pricing section
        anchor.href = "#invest-section";
        anchor.removeAttribute("target");
        anchor.removeAttribute("rel");
        
        console.log("Adding scroll handler to button:", anchor);
        
        // Add click handler to scroll smoothly
        anchor.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("Scroll button clicked!");
          const investSection = document.querySelector(".section_invest");
          console.log("Found invest section:", investSection);
          if (investSection) {
            investSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      } else if (
        buttonConfig.buttonWhereToOpen === "whatsapp" &&
        buttonConfig.buttonPhone
      ) {
        anchor.href = `https://wa.me/${buttonConfig.buttonPhone.replace(
          /\D/g,
          ""
        )}`;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      } else if (buttonConfig.buttonHref) {
        anchor.href = buttonConfig.buttonHref;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
    });
  }

  // Main data injection function
  function injectData(data) {
    if (!data || !data.proposalData) {
      // Still show content even if no data
      showContent();
      return;
    }

    const pd = data.proposalData;
    const bc = data.buttonConfig || {};

    // Simple text fields - Introduction
    if (pd.introduction) {
      const intro = pd.introduction;
      updateTextField("introduction-username", intro.userName);
      updateTextField("introduction-email", intro.email);
      updateTitleWithWordSpans("introduction-title", intro.title);
      updateTextField(
        "introduction-validity",
        formatDate(data.projectValidUntil)
      );

      // Note: introduction-subtitle element is in the about section, populated there

      // Render services list
      renderIntroductionServices("introduction-services", intro.services);
    }

    // About Us
    if (pd.aboutUs) {
      updateTitleWithWordSpans("aboutus-title", pd.aboutUs.title);
      
      // Update subtitle within about section
      if (pd.aboutUs.subtitle) {
        updateTextField("introduction-subtitle", pd.aboutUs.subtitle);
      }
      
      // Hide subtitle if needed
      if (pd.aboutUs.hideSubtitle) {
        toggleElementVisibility("introduction-subtitle", true);
      }
      
      toggleSectionVisibility(
        ".section_about",
        pd.aboutUs.hideSection === true
      );
    }

    // Team
    if (pd.team) {
      updateTitleWithWordSpans("team-title", pd.team.title);
      renderTeamMembers("team-members-list", pd.team.members);
      toggleSectionVisibility(".section_team", pd.team.hideSection === true);
    }

    // Expertise
    if (pd.expertise) {
      updateTitleWithWordSpans("expertise-title", pd.expertise.title);
      renderExpertiseTopics(
        "expertise-topics-list",
        pd.expertise.topics,
        pd.expertise.hideIcon
      );
      toggleSectionVisibility(
        ".section_expertise",
        pd.expertise.hideSection === true
      );
    }

    // Results
    if (pd.results) {
      updateTitleWithWordSpans("results-title", pd.results.title);
      renderResults("results-list", pd.results.items);
      toggleSectionVisibility(
        ".section_proof",
        pd.results.hideSection === true
      );
    }

    // Testimonials
    if (pd.testimonials) {
      renderTestimonials(pd.testimonials.items);
      toggleSectionVisibility(
        ".section_tesitominal",
        pd.testimonials.hideSection === true
      );
    }

    // Clients / Brands
    if (pd.clients) {
      renderClientsSectionVisualize(pd.clients);
    } else {
      const section = document.querySelector(".section_partners--dynamic");
      if (section) {
        section.style.display = "none";
      }
    }

    // Steps
    if (pd.steps) {
      renderSteps("steps-list", pd.steps.topics);
      updateTextField("steps-number", pd.steps.topics.length);
      toggleSectionVisibility(
        ".section_process",
        pd.steps.hideSection === true
      );
    }

    // Investment
    if (pd.investment) {
      updateTitleWithWordSpans("investment-title", pd.investment.title);
      updateTextField("investment-projectScope", pd.investment.projectScope);

      // Hide projectScope container if escope.hideSection is true or investment.hideProjectScope is true
      const shouldHideProjectScope =
        (pd.escope && pd.escope.hideSection === true) ||
        pd.investment.hideProjectScope === true;
      const projectScopeContainer = document.querySelector(".pricing_scope");
      if (projectScopeContainer) {
        if (shouldHideProjectScope) {
          projectScopeContainer.style.display = "none";
        } else {
          projectScopeContainer.style.display = "";
        }
      }
    }

    // Plans
    if (pd.plans) {
      renderPlans("plans-plansItems", pd.plans.plansItems);
    }

    // Handle pricing section visibility (investment and plans share the same section)
    if (pd.investment || pd.plans) {
      const investmentHidden =
        pd.investment && pd.investment.hideSection === true;
      const plansHidden = pd.plans && pd.plans.hideSection === true;
      const shouldHidePricing =
        pd.investment && pd.plans
          ? investmentHidden && plansHidden
          : investmentHidden || plansHidden;
      toggleSectionVisibility(".section_pricing", shouldHidePricing);
    }

    // FAQ
    if (pd.faq) {
      renderFAQItems("faq-items", pd.faq.items);
      toggleSectionVisibility(".section_faq", pd.faq.hideSection === true);
    }

    // Footer
    if (pd.footer) {
      updateTextField("footer-callToAction", pd.footer.callToAction);
      updateTextField("footer-validity", formatDate(data.projectValidUntil));
      updateTextField("footer-disclaimer", pd.footer.disclaimer);
      updateFooterEmailVisualize(pd.footer.email, data?.userEmail || data?.user?.email);
      updateFooterPhoneVisualize(pd.footer.phone);

      if (pd.footer.hideCallToAction) {
        toggleElementVisibility("footer-callToAction", true);
      }
      if (pd.footer.hideDisclaimer) {
        toggleElementVisibility("footer-disclaimer", true);
      }
    }

    if (data.mainColor) {
      const gradientColors = getHeroGradientColors(data.mainColor);
      document.documentElement.style.setProperty("--bg", data.mainColor);
      document.documentElement.style.setProperty(
        "--bg-dark",
        gradientColors.dark
      );
      document.documentElement.style.setProperty(
        "--bg-light",
        gradientColors.light
      );
    }

    // Button configuration
    updateButtons(bc);

    // Hide loading and show content after data is injected
    showContent();
  }

  // Store received data in case script loads before message
  let receivedData = null;

  // Function to inject data when ready
  function handleDataInjection(data) {
    // Wait for DOM to be fully ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        // Small delay to ensure all elements are rendered
        setTimeout(() => {
          injectData(data);
        }, 150);
      });
    } else {
      // DOM is ready, but wait a bit to ensure all scripts have run
      setTimeout(() => {
        injectData(data);
      }, 150);
    }
  }

  // Fallback: Show content after a timeout if no data is received
  setTimeout(() => {
    const loadingEl = document.getElementById("minimal-template-loading");
    if (loadingEl && loadingEl.style.display !== "none") {
      console.warn(
        "Minimal template: No data received after 5s, showing content anyway"
      );
      showContent();
    }
  }, 5000); // 5 second timeout

  // Listen for postMessage from parent window
  window.addEventListener("message", function (event) {
    // Security: optionally verify origin
    // if (event.origin !== "http://localhost:3000") return;

    if (event.data && event.data.type === "MINIMAL_TEMPLATE_DATA") {
      receivedData = event.data.data;
      handleDataInjection(event.data.data);
    }
  });

  // If DOM is already ready, check for any pending data
  if (document.readyState !== "loading") {
    if (receivedData) {
      setTimeout(() => {
        injectData(receivedData);
      }, 100);
    }
  }

  // Expose a global function for manual testing
  window.minimalInjectData = function (data) {
    handleDataInjection(data);
  };
})();

