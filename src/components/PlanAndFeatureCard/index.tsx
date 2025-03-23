import Checkbox from "#/components/icons/Checkbox";
import Sparkle from "#/components/icons/Sparkle";

interface Plan {
  id: number;
  title: string;
  features: string[];
  credits: number;
  price: string;
  buttonTitle: string;
  isBtnCallToAction?: boolean;
}

interface PlanAndFeatureCardProps {
  plans: Plan[];
}

const PlanAndFeatureCard: React.FC<PlanAndFeatureCardProps> = ({ plans }) => (
  <>
    {plans.map((plan) => (
      <div
        className=" bg-white-neutral-light-200 rounded-[var(--radius-m)] px-8 pt-8 h-[460px] w-[416px] border-1 border-[var(--color-white-neutral-light-300)] mx-2"
        key={plan.id}
      >
        <div className="flex items-center gap-4 mb-6 w-full">
          <div className="w-full">
            <div className="flex flex-row justify-between w-full">
              <h3 className="text-2xl font-medium text-[var(--color-white-neutral-light-800)] mb-6">
                {plan.title}
              </h3>
              <div className="flex w-[60px] h-[25px] rounded-full border-green-light-100 bg-secondary-light-10 font-medium text-xs items-center justify-center">
                30 dias
              </div>
            </div>

            {plan.features.map((feature) => (
              <div className="flex items-center gap-2 mt-2" key={feature}>
                <Checkbox />
                <p className="text-sm text-white-neutral-light-900">
                  {feature}
                </p>
              </div>
            ))}

            <div className="flex items-center gap-2 mt-4">
              <Sparkle />
              <p className="text-sm text-primary-light-400">
                {plan.credits} créditos / mês
              </p>
            </div>

            <div className="flex items-center gap-2 mt-24">
              <p className="text-3xl text-white-neutral-light-800">
                {plan.price}
                <span className="text-sm text-white-neutral-light-800">
                  {" "}
                  / mês
                </span>
              </p>
            </div>
          </div>
        </div>

        {plan.isBtnCallToAction ? (
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
        ) : (
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
        )}
      </div>
    ))}
  </>
);

export default PlanAndFeatureCard;
