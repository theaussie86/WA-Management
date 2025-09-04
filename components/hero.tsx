import { WeissteinerLogo } from "./weissteiner-logo";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <WeissteinerLogo />
        </a>
      </div>
      <h1 className="sr-only">Weissteiner Automation Plattform</h1>
      <div className="text-center space-y-6">
        <h1 className="sr-only text-4xl lg:text-6xl font-bold !leading-tight mx-auto max-w-4xl">
          Weissteiner Automation
        </h1>
        <p className="text-xl lg:text-2xl !leading-relaxed mx-auto max-w-2xl text-muted-foreground">
          Die intelligente Plattform für moderne Automatisierungslösungen
        </p>
        <p className="text-lg !leading-relaxed mx-auto max-w-3xl">
          Entwickelt mit{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-semibold hover:underline text-primary"
            rel="noreferrer"
          >
            Supabase
          </a>{" "}
          und{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            className="font-semibold hover:underline text-primary"
            rel="noreferrer"
          >
            Next.js
          </a>{" "}
          für maximale Performance und Skalierbarkeit
        </p>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
