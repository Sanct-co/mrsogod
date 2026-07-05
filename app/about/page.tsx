import Image from "next/image";
import type { Metadata } from "next";
import { RevealText } from "@/components/reveal-text";
import { DividerLine } from "@/components/divider-line";
import { StaggerReveal } from "@/components/stagger-reveal";

export const metadata: Metadata = {
  title: "About | Mister Sogod 2026",
  description:
    "Eighteen exceptional Sogoranons. Eighteen unique stories. One prestigious crown. Learn about Mister Sogod 2026.",
};

const VALUES = [
  {
    label: "Confidence",
    description: "Poise under the spotlight, on stage and off it.",
    image: "/resources/4.jpg",
  },
  {
    label: "Character",
    description: "Integrity that holds up when no one's watching.",
    image: "/resources/5.jpg",
  },
  {
    label: "Leadership",
    description: "A voice for barangay and community, not just self.",
    image: "/resources/2.jpg",
  },
  {
    label: "Heart",
    description: "Genuine service to Sogod and its people.",
    image: "/resources/3.jpg",
  },
];

const ORGANIZERS = [
  {
    name: "Sogod Business Club",
    role: "Producer",
  },
  {
    name: "Sogod PNP",
    role: "Partner",
  },
  {
    name: "Municipal Advisory Council – Sogod",
    role: "Partner",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <RevealText as="p" type="words" className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid">
          About
        </RevealText>
        <RevealText
          as="h1"
          type="words"
          delay={0.1}
          className="font-display mt-1 text-4xl font-black uppercase tracking-tight text-gold-foil sm:text-5xl"
        >
          Mister Sogod 2026
        </RevealText>
        <div className="mt-4 flex items-center gap-4">
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
          <RevealText
            as="p"
            type="words"
            delay={0.2}
            className="text-xs font-bold uppercase tracking-[0.3em] text-gold-mid"
          >
            The Inaugural Search
          </RevealText>
          <DividerLine className="h-px w-10 bg-gold-mid/60" />
        </div>
      </div>

      <div className="chamfer-lg relative mb-12 aspect-[16/9] w-full overflow-hidden border border-gold-mid/40 bg-black-red">
        <Image
          src="/officialcandidates.jpg"
          alt="Official candidates of Mister Sogod 2026"
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <section className="mb-12 flex flex-col items-center gap-4 text-center">
        <RevealText
          as="p"
          type="lines"
          scrollTrigger
          className="max-w-3xl text-lg font-bold uppercase tracking-wide text-gold-solid"
        >
          Eighteen exceptional Sogoranons. Eighteen unique stories. One prestigious crown.
        </RevealText>
        <RevealText
          as="p"
          type="lines"
          delay={0.1}
          scrollTrigger
          className="max-w-3xl text-sm text-gold-solid/80"
        >
          Representing the different barangays of Sogod, these young men are ready to take
          center stage and prove that true greatness is defined by confidence, character,
          leadership, and heart.
        </RevealText>
        <RevealText
          as="p"
          type="words"
          delay={0.2}
          scrollTrigger
          className="font-display text-xl font-extrabold uppercase tracking-widest text-gold-foil"
        >
          Garbong Sogoranon! Garbong Sugboanon!
        </RevealText>
      </section>

      {/* THE EVENT */}
      <section className="relative mb-24 md:mb-32">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-6 left-1/2 -z-10 w-[200%] -translate-x-1/2 select-none whitespace-nowrap text-center font-display text-[6rem] font-black uppercase leading-none text-gold-mid/5 sm:text-[9rem] lg:text-[11rem]"
        >
          Mister Sogod
        </span>

        <RevealText
          as="p"
          type="words"
          scrollTrigger
          className="text-xs font-bold uppercase tracking-[0.4em] text-gold-mid"
        >
          The Event
        </RevealText>

        <div className="mt-4 grid gap-12 md:grid-cols-12 md:items-center md:gap-6">
          <div className="md:col-span-7">
            <RevealText
              as="h2"
              type="chars"
              scrollTrigger
              className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-gold-foil sm:text-6xl lg:text-7xl"
            >
              Eighteen barangays. One crown.
            </RevealText>

            <RevealText
              as="p"
              type="lines"
              delay={0.1}
              scrollTrigger
              className="mt-6 max-w-xl text-base leading-relaxed text-gold-solid/80 sm:text-lg"
            >
              Mister Sogod is the inaugural event produced by Sogod Business Club, in
              partnership with Sogod PNP and the Municipal Advisory Council – Sogod.
              Eighteen candidates, one from each participating barangay, compete for the
              title through a search that celebrates the best of Sogoranon manhood on and
              off the stage.
            </RevealText>

            <StaggerReveal className="mt-8 flex flex-nowrap items-center gap-x-3 sm:gap-x-8">
              {[
                { n: "18", l: "Candidates" },
                { n: "18", l: "Barangays" },
                { n: "01", l: "Crown" },
              ].map((stat) => (
                <div key={stat.l} className="flex flex-col items-start gap-0 sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="font-display text-2xl font-black text-gold-foil sm:text-4xl md:text-5xl">
                    {stat.n}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold-mid/70 sm:text-xs sm:tracking-[0.2em]">
                    {stat.l}
                  </span>
                </div>
              ))}
            </StaggerReveal>
          </div>

          <div className="relative md:col-span-5">
            <div className="chamfer-lg relative mx-auto aspect-[4/5] w-full max-w-sm rotate-2 overflow-hidden border border-gold-mid/40 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:rotate-0">
              <Image
                src="/resources/1.jpg"
                alt="Mister Sogod candidates on stage during the crowning night"
                fill
                sizes="(min-width: 768px) 24rem, 90vw"
                className="object-cover"
              />
            </div>
            <div className="chamfer-sm absolute -bottom-8 -left-4 hidden aspect-[4/5] w-32 -rotate-6 overflow-hidden border border-gold-mid/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:block md:w-36">
              <Image
                src="/resources/2.jpg"
                alt="Mister Sogod titleholders on stage"
                fill
                sizes="9rem"
                className="object-cover"
              />
            </div>
            <span className="chamfer-btn absolute -top-4 right-2 -rotate-6 border border-gold-solid bg-maroon-core px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-foil shadow-lg sm:right-6">
              Crowning Night
            </span>
          </div>
        </div>
      </section>

      {/* WHAT WE CELEBRATE */}
      <section className="mb-24 md:mb-32">
        <RevealText
          as="p"
          type="words"
          scrollTrigger
          className="text-xs font-bold uppercase tracking-[0.4em] text-gold-mid"
        >
          What We Celebrate
        </RevealText>
        <RevealText
          as="h2"
          type="chars"
          scrollTrigger
          className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-gold-foil sm:text-5xl"
        >
          Not just a pretty sash.
        </RevealText>

        <div className="mt-10 flex flex-col divide-y divide-gold-mid/15">
          {VALUES.map((value, i) => (
            <div
              key={value.label}
              className={`group flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:gap-8 md:py-10 ${
                i % 2 === 1 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className={`flex-1 ${i % 2 === 1 ? "sm:text-right" : ""}`}>
                <h3 className="font-display text-3xl font-black uppercase tracking-tight text-gold-foil sm:text-5xl">
                  {value.label}
                </h3>
                <p
                  className={`mt-2 max-w-sm text-sm text-gold-solid/70 sm:text-base ${
                    i % 2 === 1 ? "sm:ml-auto" : ""
                  }`}
                >
                  {value.description}
                </p>
              </div>

              <div
                className={`chamfer-sm relative hidden h-40 w-40 shrink-0 overflow-hidden border border-gold-mid/40 shadow-[0_10px_25px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:rotate-0 group-hover:scale-105 sm:block md:h-48 md:w-48 ${
                  i % 2 === 0 ? "rotate-3" : "-rotate-3"
                }`}
              >
                <Image
                  src={value.image}
                  alt={value.label}
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ORGANIZERS */}
      <section
        className="relative w-screen overflow-hidden py-20"
        style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/resources/3.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black-red via-black-red/95 to-black-red" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
          <RevealText
            as="p"
            type="words"
            scrollTrigger
            className="text-xs font-bold uppercase tracking-[0.4em] text-gold-mid"
          >
            Presented By
          </RevealText>
          <RevealText
            as="h2"
            type="chars"
            scrollTrigger
            className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-gold-foil sm:text-5xl"
          >
            Backed By Sogod
          </RevealText>

          <StaggerReveal className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {ORGANIZERS.map((org, i) => (
              <div
                key={org.name}
                className={`chamfer-lg border-2 border-gold-mid/50 bg-maroon-core/80 px-8 py-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-2 hover:rotate-0 ${
                  i % 2 === 0 ? "rotate-2" : "-rotate-2"
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-mid/80">
                  {org.role}
                </p>
                <h3 className="mt-2 font-display text-xl font-black uppercase tracking-wide text-gold-foil sm:text-2xl">
                  {org.name}
                </h3>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}
