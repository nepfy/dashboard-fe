/**
 * Data injection script for Flash template
 * Populates the static HTML template with data received via postMessage
 */

(function () {
  "use strict";

  // Format ISO date string to localized format (e.g., "7 Janeiro, 2025")
  function formatDate(dateString) {
    if (!dateString) return "";
    try {
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
    } catch {
      return dateString;
    }
  }

  // Update simple text field
  function updateTextField(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && value !== null && value !== undefined) {
      element.textContent = value;
    } else if (!element) {
      console.warn(`Flash template: Element not found: ${elementId}`);
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
      console.warn(`Flash template: Element not found: ${elementId}`);
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
  function renderExpertiseTopics(containerId, topics) {
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

      // Update icon (if provided)
      if (topic.icon) {
        const iconContainer = clone.querySelector(".expertise_icon");
        if (iconContainer) {
          iconContainer.innerHTML = topic.icon;
        }
      } else if (topic.hideIcon) {
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
        investmentDiv.textContent = item.investment || "";
      }

      // Update ROI
      const roiDiv = clone.querySelector(
        ".proof_roi .roi_wrap:last-child .text-color-alternate"
      );
      if (roiDiv) {
        roiDiv.textContent = item.roi || "";
      }

      container.appendChild(clone);
    });
  }

  // Render testimonials list
  function renderTestimonials(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items || !Array.isArray(items)) return;

    // Filter out hidden items and sort
    const visibleItems = items
      .filter(() => true) // No hideItem for testimonials in the interface
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Get template (first slide)
    const template = container.querySelector(".w-slide");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each testimonial
    visibleItems.forEach((item) => {
      const clone = template.cloneNode(true);

      // Update testimonial text
      const testimonialP = clone.querySelector(".heading-style-h3");
      if (testimonialP) {
        testimonialP.textContent = item.testimonial || "";
      }

      // Update photo
      const img = clone.querySelector(".slider_image img");
      if (img && item.photo && !item.hidePhoto) {
        img.src = item.photo;
      } else if (img && item.hidePhoto) {
        img.style.display = "none";
      }

      // Update name
      const nameDiv = clone.querySelector(".slider-name .text-weight-medium");
      if (nameDiv) {
        nameDiv.textContent = item.name || "";
      }

      // Update role
      const roleDiv = clone.querySelector(".slider-name .opacity_80");
      if (roleDiv) {
        roleDiv.textContent = item.role || "";
      }

      container.appendChild(clone);
    });
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

      container.appendChild(clone);
    });
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

    // Get template (first pricing card)
    const template = container.querySelector(".pricing_card");
    if (!template) return;

    // Clear container
    container.innerHTML = "";

    // Clone and populate for each plan
    visiblePlans.forEach((plan) => {
      const clone = template.cloneNode(true);

      // Remove is--center class unless recommended
      if (plan.recommended) {
        clone.classList.add("is--center");
      } else {
        clone.classList.remove("is--center");
      }

      // Show/hide badge for recommended
      const badge = clone.querySelector(".pricing_badge");
      if (badge) {
        if (plan.recommended) {
          badge.style.display = "";
        } else {
          badge.style.display = "none";
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
        priceDiv.textContent = plan.value || "";
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
        buttonText.textContent = plan.buttonTitle || "";
        const duplicate = clone.querySelector(
          ".pricing_button .btn-magnetic__text-p.is--duplicate"
        );
        if (duplicate) {
          duplicate.textContent = plan.buttonTitle || "";
        }
      } else if (buttonText && plan.hideButtonTitle) {
        const button = clone.querySelector(".pricing_button");
        if (button) {
          button.style.display = "none";
        }
      }

      // Update button href
      const buttonLink = clone.querySelector(
        ".pricing_button .btn-magnetic__click"
      );
      if (buttonLink) {
        if (plan.buttonWhereToOpen === "whatsapp" && plan.buttonPhone) {
          buttonLink.href = `https://wa.me/${plan.buttonPhone.replace(
            /\D/g,
            ""
          )}`;
        } else if (plan.buttonHref) {
          buttonLink.href = plan.buttonHref;
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
        // Also update duplicate text if it exists
        const duplicate = button
          .closest(".btn-magnetic__text")
          ?.querySelector(".is--duplicate");
        if (duplicate) {
          duplicate.textContent = buttonConfig.buttonTitle;
        }
      }
    });

    // Update button links
    const buttonLinks = document.querySelectorAll(".btn-magnetic__click");
    buttonLinks.forEach((link) => {
      if (
        buttonConfig.buttonWhereToOpen === "whatsapp" &&
        buttonConfig.buttonPhone
      ) {
        link.href = `https://wa.me/${buttonConfig.buttonPhone.replace(
          /\D/g,
          ""
        )}`;
      } else if (buttonConfig.buttonHref) {
        link.href = buttonConfig.buttonHref;
      }
    });
  }

  // Hide loading and show content
  function showContent() {
    const loadingEl = document.getElementById("flash-template-loading");
    const contentEl = document.getElementById("flash-template-content");

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
          new CustomEvent("flash-template-data-injected", {
            bubbles: true,
            detail: { timestamp: Date.now() },
          })
        );
      }, 100);
    } else {
      // Dispatch event even if no content element found
      window.dispatchEvent(
        new CustomEvent("flash-template-data-injected", {
          bubbles: true,
          detail: { timestamp: Date.now() },
        })
      );
    }
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
      updateTextField("introduction-subtitle", intro.subtitle);

      // Hide subtitle if needed
      if (intro.hideSubtitle) {
        toggleElementVisibility("introduction-subtitle", true);
      }

      // Render services list
      renderIntroductionServices("introduction-services", intro.services);
    }

    // About Us
    if (pd.aboutUs) {
      updateTitleWithWordSpans("aboutus-title", pd.aboutUs.title);
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
      renderExpertiseTopics("expertise-topics-list", pd.expertise.topics);
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
      renderTestimonials("testimonials-list", pd.testimonials.items);
      toggleSectionVisibility(
        ".section_tesitominal",
        pd.testimonials.hideSection === true
      );
    }

    // Steps
    if (pd.steps) {
      renderSteps("steps-list", pd.steps.topics);
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
      // Note: Section visibility is handled in the Plans section below
      // since they share the same .section_pricing container
    }

    // Plans
    if (pd.plans) {
      renderPlans("plans-plansItems", pd.plans.plansItems);
    }

    // Handle pricing section visibility (investment and plans share the same section)
    // Hide section if either investment or plans wants to hide it (since they're in the same HTML section)
    if (pd.investment || pd.plans) {
      const investmentHidden =
        pd.investment && pd.investment.hideSection === true;
      const plansHidden = pd.plans && pd.plans.hideSection === true;
      // If both exist, hide if both want to hide. If only one exists, use its flag.
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

      if (pd.footer.hideCallToAction) {
        toggleElementVisibility("footer-callToAction", true);
      }
      if (pd.footer.hideDisclaimer) {
        toggleElementVisibility("footer-disclaimer", true);
      }
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
    const loadingEl = document.getElementById("flash-template-loading");
    if (loadingEl && loadingEl.style.display !== "none") {
      console.warn(
        "Flash template: No data received after 5s, showing content anyway"
      );
      showContent();
    }
  }, 5000); // 5 second timeout

  // Listen for postMessage from parent window
  window.addEventListener("message", function (event) {
    // Security: optionally verify origin
    // if (event.origin !== "http://localhost:3000") return;

    if (event.data && event.data.type === "FLASH_TEMPLATE_DATA") {
      receivedData = event.data.data;
      handleDataInjection(event.data.data);
    } else {
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
  window.flashInjectData = function (data) {
    handleDataInjection(data);
  };
})();
