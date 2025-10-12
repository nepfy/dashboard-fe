import Sparkle from "#/components/icons/Sparkle";

export default function Personalize() {
  return (
    <button
      className="w-full sm:w-auto
    cursor-pointer hover:button-inner border border-white-neutral-light-200  hover:border-white-neutral-light-300 
    flex items-center justify-center gap-2 px-4 py-3 
    text-white-neutral-light-900 hover:text-primary-light-500 
    transition-all duration-200 bg-white-neutral-light-200 hover:bg-white-neutral-light-100 
    rounded-[10px]"
    >
      <Sparkle width="16" height="16" fill="currentColor" />
      <p className="text-sm font-medium">Personalize</p>
    </button>
  );
}
