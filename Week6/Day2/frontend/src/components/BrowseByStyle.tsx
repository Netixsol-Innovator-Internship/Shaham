"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

type StyleKey = "casual" | "formal" | "party" | "gym";

const BrowseByStyle = () => {
  const router = useRouter();

  const handleSelect = (style: StyleKey) => {
    router.push(`/productsdisplaypage?style=${style}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 my-12">
      <div className="rounded-3xl bg-neutral-100 p-6 md:p-10 shadow">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center mb-8">
          BROWSE BY DRESS STYLE
        </h2>

        {/* 3 columns, 2 rows */}
        <div className="grid grid-cols-3 gap-4 md:gap-5 auto-rows-[160px] md:auto-rows-[220px]">
          <StyleButton
            title="Casual"
            img="/casual.png"
            className="col-span-1"
            onClick={() => handleSelect("casual")}
          />
          <StyleButton
            title="Formal"
            img="/formal.png"
            className="col-span-2"
            onClick={() => handleSelect("formal")}
          />
          <StyleButton
            title="Party"
            img="/party.png"
            className="col-span-2"
            onClick={() => handleSelect("party")}
          />
          <StyleButton
            title="Gym"
            img="/gym.png"
            className="col-span-1"
            onClick={() => handleSelect("gym")}
          />
        </div>
      </div>
    </section>
  );
};

export default BrowseByStyle;

/* Sub-component */
function StyleButton({
  title,
  img,
  className = "",
  onClick,
}: {
  title: string;
  img: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5 ${className}`}
      aria-label={`Browse ${title} style`}
    >
      <div className="relative h-full w-full">
        <Image src={img} alt={title} fill className="object-cover" />
      </div>
      <span className="absolute left-4 top-4 text-lg md:text-xl font-semibold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
        {title}
      </span>
      <div className="pointer-events-none absolute inset-0 bg-black/0 hover:bg-black/5 transition" />
    </button>
  );
}
