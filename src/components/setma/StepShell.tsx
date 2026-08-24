import type { ReactNode } from "react";
import logoAsset from "@/assets/setma-logo.png.asset.json";

export const STEP_LABELS = [
  "Máquina",
  "Alarme",
  "Diagnóstico",
  "Finalização",
] as const;

export function StepShell({
  step,
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex items-center justify-between gap-4">
        <img
          src={logoAsset.url}
          alt="SeTma.IA"
          className="h-10 w-auto sm:h-12"
          width={240}
          height={80}
        />
        <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Ordem de Serviço
        </span>
      </header>

      <ol className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <li key={label} className="flex items-center gap-2">
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                  active
                    ? "btn-steel border-transparent"
                    : done
                      ? "border-primary/60 text-primary"
                      : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {n}
              </span>
              <span
                className={[
                  "text-xs uppercase tracking-wider sm:text-sm",
                  active ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
              {n < STEP_LABELS.length && (
                <span className="hidden h-px w-6 bg-border sm:block" />
              )}
            </li>
          );
        })}
      </ol>

      <section
        className={[
          "panel-steel mt-6 flex flex-1 flex-col rounded-xl p-5 sm:p-7",
          wide ? "" : "max-w-2xl",
        ].join(" ")}
      >
        <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
        <div className="mt-6 flex flex-1 flex-col">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </section>
    </div>
  );
}
