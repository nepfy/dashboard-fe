import { useEffect, useRef } from "react";
import DashboardPageHeader from "#/components/DashboardPageHeader";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

export default function Header({ activeTab, setActiveTab, tabs }: HeaderProps) {
  const sliderRef = useRef<Slider>(null);

  // Find the index of the active tab
  const activeIndex = tabs.indexOf(activeTab);

  // Synchronize the slider with activeTab changes
  useEffect(() => {
    if (sliderRef.current && activeIndex >= 0) {
      sliderRef.current.slickGoTo(activeIndex);
    }
  }, [activeTab, activeIndex]);

  // Handle slide change
  const handleAfterChange = (currentSlide: number) => {
    if (currentSlide >= 0 && currentSlide < tabs.length) {
      setActiveTab(tabs[currentSlide]);
    }
  };

  // Slider settings
  const sliderSettings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    touchThreshold: 10,
    centerMode: true,
    variableWidth: true,
    afterChange: handleAfterChange,
    initialSlide: activeIndex >= 0 ? activeIndex : 0,
  };

  return (
    <DashboardPageHeader title="Configurações">
      {/* Desktop/Tablet View - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-2xl mb-6 w-fit">
          <div className="flex flex-wrap items-center justify-center p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm font-medium rounded-xs cursor-pointer ${
                  activeTab === tab
                    ? "text-primary-light-500 bg-white-neutral-light-100 e1"
                    : "text-white-neutral-light-800 hover:bg-white-neutral-light-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Tab Slider - visible only on mobile */}
      <div className="sm:hidden w-full mb-6">
        <div className="border border-white-neutral-light-300 bg-white-neutral-light-200 rounded-2xl w-full p-1.5">
          <Slider ref={sliderRef} {...sliderSettings}>
            {tabs.map((tab) => (
              <div key={tab} className="px-1 text-center">
                <button
                  className={`px-4 py-3 text-sm font-medium rounded-xs cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? "text-primary-light-500 bg-white-neutral-light-100 e1"
                      : "text-white-neutral-light-800 hover:bg-white-neutral-light-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </DashboardPageHeader>
  );
}
