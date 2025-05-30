import ExpandIcon from "#/components/icons/ExpandIcon";
export default function IntroPreview() {
  return (
    <div
      className="h-full p-7"
      style={{
        background: `radial-gradient(104.7% 303.34% at 7.84% 26.05%, #000000 0%, #200D42 34.22%, #4F21A1 64.9%, #A46EDB 81.78%)`,
        backdropFilter: "blur(105.34431457519531px)",
      }}
    >
      <button className="absolute bottom-8 right-6 z-50 hidden bg-white-neutral-light-100 w-[44px] h-[44px] xl:flex items-center justify-center rounded-[10px] border border-white-neutral-light-300 hover:bg-white-neutral-light-300 cursor-pointer">
        <ExpandIcon width="16" height="16" />
      </button>
    </div>
  );
}
