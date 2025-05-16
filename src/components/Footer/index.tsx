export default function Footer() {
  const date = new Date();
  return (
    <p className="text-white-neutral-light-400 xl:text-primary-light-200 mt-6 absolute bottom-2 sm:bottom-5 left-5 right-0 z-40">
      &copy; {date.getFullYear()} Nepfy
    </p>
  );
}
