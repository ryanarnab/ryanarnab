"use client";

type DiscoveryCardProps = {
  discovery?: string;
  title?: string;
  description?: string;
  category?: string;
  year?: string;
};

export default function DiscoveryCard({
  discovery = "001",
  title = "PROJECT TITLE",
  description = "A short project description will live here later.",
  category = "Classification",
  year = "2026",
}: DiscoveryCardProps) {
  return (
    <article
      className="
        mx-auto
        flex
        min-h-screen
        w-full
        max-w-[1500px]
        flex-col
        justify-center
        px-10
      "
    >
      {/* Discovery Number */}

      <p
        className="
          mb-8
          text-xs
          uppercase
          tracking-[0.25em]
          text-white/35
        "
      >
        DISCOVERY {discovery}
      </p>

      {/* Image */}

      <div
        className="
          aspect-[16/10]
          w-full
          overflow-hidden
          bg-white/[0.04]
        "
      />

      {/* Text */}

      <div className="mt-14">

        <h3
          className="
            text-[clamp(60px,8vw,110px)]
            leading-[0.88]
            tracking-[-0.06em]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-6
            max-w-[520px]
            text-lg
            leading-8
            text-white/45
          "
        >
          {description}
        </p>

        <div
          className="
            mt-16
            flex
            gap-20
          "
        >
          <div>

            <p className="text-[11px] uppercase tracking-[0.18em] text-white/25">
              CLASSIFICATION
            </p>

            <p className="mt-2 text-white/65">
              {category}
            </p>

          </div>

          <div>

            <p className="text-[11px] uppercase tracking-[0.18em] text-white/25">
              RECORDED
            </p>

            <p className="mt-2 text-white/65">
              {year}
            </p>

          </div>

        </div>

      </div>
    </article>
  );
}