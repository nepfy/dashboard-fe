export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
      {/* Title with different weights */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-[100]">.Nepfy</h1>
        <h1 className="text-4xl font-[300]">.Nepfy</h1>
        <h1 className="text-4xl font-[500]">.Nepfy</h1>
        <h1 className="text-4xl font-[700]">.Nepfy</h1>
        <h1 className="text-4xl font-[900]">.Nepfy</h1>
      </div>

      {/* Paragraph examples with different weights */}
      <div className="space-y-4 max-w-full">
        <p className="font-[100] text-lg">
          This is Satoshi at weight 100 - Ultra Light
        </p>
        <p className="font-[300] text-lg">
          This is Satoshi at weight 300 - Light
        </p>
        <p className="font-[400] text-lg">
          This is Satoshi at weight 400 - Regular
        </p>
        <p className="font-[500] text-lg">
          This is Satoshi at weight 500 - Medium
        </p>
        <p className="font-[700] text-lg">
          This is Satoshi at weight 700 - Bold
        </p>
        <p className="font-[900] text-lg">
          This is Satoshi at weight 900 - Black
        </p>
      </div>

      {/* Italic examples */}
      <div className="space-y-4 max-w-full">
        <p className="font-[300] italic text-lg">
          This is Satoshi Italic at weight 300
        </p>
        <p className="font-[500] italic text-lg">
          This is Satoshi Italic at weight 500
        </p>
        <p className="font-[700] italic text-lg">
          This is Satoshi Italic at weight 700
        </p>
      </div>

      {/* Mixed styles example */}
      <div className="space-y-4 max-w-full">
        <h2 className="text-2xl font-[700]">Mixed Styles Example</h2>
        <p className="font-[300]">
          Light weight text with{" "}
          <span className="font-[700]">bold emphasis</span> and{" "}
          <span className="italic">italic text</span>
        </p>
        <p className="font-[500]">
          Medium weight text with{" "}
          <span className="font-[900]">black emphasis</span> and{" "}
          <span className="italic">italic text</span>
        </p>
      </div>
    </div>
  );
}
