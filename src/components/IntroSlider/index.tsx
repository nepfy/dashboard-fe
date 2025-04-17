import Ilustration from "#/components/icons/Ilustration";

interface IntroSliderProps {
  title?: string;
  description?: string;
}

export default function IntroSlider({ title, description }: IntroSliderProps) {
  return (
    <div className="hidden bg-[var(--color-primary-light-400)] xl:flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-[80%]">
          <div className="w-full aspect-[622/714] relative">
            <Ilustration className="w-full h-full" />
            <div className="absolute sm:bottom-0 lg:bottom-2xl xl:bottom-9xl left-0 right-0 space-y-2">
              <h2 className="text-[32px] font-medium text-[var(--color-white-neutral-light-200)] text-center">
                {title}
              </h2>
              <p className="text-[var(--color-primary-light-200)] text-center max-w-72 mx-auto">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
