"use client";

import Checkbox from "#/components/icons/Checkbox";
import Sparkle from "#/components/icons/Sparkle";
import Slider from "react-slick";
import type { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Plan {
  id: number;
  title: string;
  features: string[];
  credits: number;
  price: string;
  buttonTitle: string;
  isFreeTrial?: boolean;
  highlight?: boolean;
}

interface PlanAndFeatureCardProps {
  plans: Plan[];
}

const PlanAndFeatureCard: React.FC<PlanAndFeatureCardProps> = ({ plans }) => {
  const cardClassName = (plan: Plan) =>
    `rounded-[var(--radius-m)] h-[520px] md:max-h-[580px] md:h-[580px] lg:max-h-[500px] lg:h-[500px] xl:h-[460px] xl:max-h-[460px] w-full sm:w-[416px] border border-[var(--color-white-neutral-light-300)] mx-4 sm:mx-2 p-[3px] ${
      plan?.highlight && "gradient-border"
    }`;

  const renderCard = (plan: Plan) => (
    <div className={cardClassName(plan)} key={plan.id}>
      <div className="w-full h-full rounded-[var(--radius-s)] px-4 md:px-5 lg:px-8 py-8 xl:py-4 bg-[var(--color-white-neutral-light-200)] flex flex-col justify-between items-center">
        <div className="flex items-stretch gap-4 mb-4 w-full h-full">
          <div className="w-full h-full items-stretch flex flex-col justify-between">
            <div className="flex flex-row justify-between items-center w-full sm:mb-3 xl:mb-4">
              <h3 className="text-2xl font-medium text-[var(--color-white-neutral-light-800)]">
                {plan.title}
              </h3>
              {plan?.isFreeTrial && (
                <div className="flex w-[60px] h-[25px] rounded-full border-green-light-100 bg-secondary-light-10 font-medium text-xs items-center justify-center border b-[var(--color-green-light-100)]">
                  30 dias
                </div>
              )}
            </div>

            <div>
              {plan.features.map((feature) => (
                <div className="flex items-center gap-2 mb-4" key={feature}>
                  <Checkbox />
                  <p className="text-sm text-white-neutral-light-900">
                    {feature}
                  </p>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-6">
                <Sparkle />
                <p className="text-sm text-primary-light-400">
                  {plan.credits} créditos / mês
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-24">
              <p className="md:text-2xl lg:text-3xl text-white-neutral-light-800">
                {plan.price}
                <span className="text-sm text-white-neutral-light-800">
                  {" "}
                  / mês
                </span>
              </p>
            </div>
          </div>
        </div>

        {plan.isFreeTrial ? (
          <button
            className="
           w-full py-3 px-6 
           rounded-[var(--radius-s)] 
           border-1 border-[var(--color-white-neutral-light-300)] 
           bg-[var(--color-white-neutral-light-100)] 
           text-[var(--color-white-neutral-light-800)] 
           font-medium 
           hover:cursor-pointer
           transition-colors 
           button-inner"
          >
            {plan.buttonTitle}
          </button>
        ) : (
          <button
            className="
          w-full py-3 px-6 
          rounded-[var(--radius-s)] 
          border-1 border-[var(--color-primary-light-25)] 
          bg-[var(--color-primary-light-500)] 
          text-[var(--color-white-neutral-light-100)] 
          font-medium 
          hover:cursor-pointer
          transition-colors 
          button-inner-light"
          >
            {plan?.buttonTitle}
          </button>
        )}
      </div>
    </div>
  );

  const sliderSettings: Settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "20px",
  };

  return (
    <>
      {/* Mobile Carousel */}
      <div className="sm:hidden w-full">
        <Slider {...sliderSettings}>
          {plans.map((plan) => (
            <div key={plan.id} className="px-2">
              {renderCard(plan)}
            </div>
          ))}
        </Slider>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row justify-around items-center w-full">
        {plans.map((plan) => renderCard(plan))}
      </div>
    </>
  );
};

export default PlanAndFeatureCard;
