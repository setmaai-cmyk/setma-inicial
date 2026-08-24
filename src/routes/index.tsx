import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2, LogIn, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/setma-logo.png.asset.json";
import { StepShell } from "@/components/setma/StepShell";
import {
  DiagnosisChat,
  MOCK_SOLUTION,
  type ChatMessage,
} from "@/components/setma/DiagnosisChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SeTma.IA — Diagnóstico de manutenção industrial" },
      {
        name: "description",
        content:
          "Abra ordens de serviço com diagnóstico assistido por IA: selecione a máquina, triagem de alarme, chat técnico e resumo final.",
      },
      { property: "og:title", content: "SeTma.IA — Diagnóstico de manutenção" },
      {
        property: "og:description",
        content:
          "Wizard de manutenção industrial: seleção de máquina, triagem de alarme, diagnóstico por IA e ordem de serviço.",
      },
    ],
  }),
  component: Index,
});

const MACHINES = [
  "Prensa Hidráulica 01",
  "Torno CNC 03",
  "Injetora Plástica 07",
  "Esteira Transportadora 12",
  "Compressor de Ar 02",
];

type Step = "login" | "machine" | "alarm" | "chat" | "summary";

function Index() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [machine, setMachine] = useState("");
  const [hasAlarm, setHasAlarm] = useState<boolean | null>(null);
  const [alarmCode, setAlarmCode] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [report, setReport] = useState("");

  function resetAll() {
    setStep("login");
    setEmail("");
    setPassword("");
    setMachine("");
    setHasAlarm(null);
    setAlarmCode("");
    setMessages([]);
    setReport("");
  }

  function handleSend(text: string) {
    if (!report) setReport(text);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      kind: "text",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          kind: "text",
          text: `Entendido. Cruzei o relato com o histórico da **${machine || "máquina selecionada"}**${
            hasAlarm && alarmCode ? ` e com o alarme \`${alarmCode}\`` : ""
          }. Encontrei um procedimento compatível na base interna:`,
        },
        {
          id: `s-${Date.now()}`,
          role: "assistant",
          kind: "solution",
          solution: MOCK_SOLUTION,
        },
      ]);
    }, 1000);
  }

  return (
    <main className="min-h-screen">
      <Toaster />

      {step === "login" && (
        <div className="flex min-h-screen items-center justify-center px-4 py-10">
          <div className="panel-steel w-full max-w-md rounded-xl p-7">
            <img
              src={logoAsset.url}
              alt="SeTma.IA"
              className="mx-auto h-16 w-auto"
              width={320}
              height={107}
            />
            <h1 className="mt-6 text-center text-xl font-semibold">
              Acesso do técnico
            </h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Manutenção assistida por inteligência artificial
            </p>

            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("machine");
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tecnico@empresa.com.br"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="btn-steel w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </form>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Ambiente de demonstração com dados simulados
            </p>
          </div>
        </div>
      )}

      {step === "machine" && (
        <StepShell
          step={1}
          title="Seleção de máquina"
          subtitle="Escolha o equipamento que será inspecionado."
          footer={
            <Button
              className="btn-steel"
              disabled={!machine}
              onClick={() => setStep("alarm")}
            >
              Avançar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          }
        >
          <div className="space-y-2">
            <Label htmlFor="machine">Equipamento</Label>
            <Select value={machine} onValueChange={setMachine}>
              <SelectTrigger id="machine">
                <SelectValue placeholder="Selecione a máquina" />
              </SelectTrigger>
              <SelectContent>
                {MACHINES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Técnico logado: {email || "não informado"}
            </p>
          </div>
        </StepShell>
      )}

      {step === "alarm" && (
        <StepShell
          step={2}
          title="Triagem de alarme"
          subtitle={machine}
          footer={
            <>
              <Button variant="outline" onClick={() => setStep("machine")}>
                Voltar
              </Button>
              <Button
                className="btn-steel"
                disabled={hasAlarm === null || (hasAlarm && !alarmCode.trim())}
                onClick={() => setStep("chat")}
              >
                Avançar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          }
        >
          <p className="text-sm font-medium">
            O equipamento gerou alarme visual?
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              className={hasAlarm === true ? "btn-steel" : ""}
              variant={hasAlarm === true ? "default" : "outline"}
              onClick={() => setHasAlarm(true)}
            >
              Sim
            </Button>
            <Button
              className={hasAlarm === false ? "btn-steel" : ""}
              variant={hasAlarm === false ? "default" : "outline"}
              onClick={() => {
                setHasAlarm(false);
                setAlarmCode("");
              }}
            >
              Não
            </Button>
          </div>

          {hasAlarm === true && (
            <div className="mt-6 space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="alarm">Código do alarme</Label>
              <Input
                id="alarm"
                value={alarmCode}
                onChange={(e) => setAlarmCode(e.target.value)}
                placeholder="Ex.: E-2291"
              />
            </div>
          )}
        </StepShell>
      )}

      {step === "chat" && (
        <StepShell
          step={3}
          title="Chat de diagnóstico"
          subtitle={`${machine}${hasAlarm && alarmCode ? ` · Alarme ${alarmCode}` : " · Sem alarme visual"}`}
          wide
          footer={
            <>
              <Button variant="outline" onClick={() => setStep("alarm")}>
                Voltar
              </Button>
              <Button
                className="btn-steel"
                disabled={messages.length === 0}
                onClick={() => setStep("summary")}
              >
                Finalizar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          }
        >
          <DiagnosisChat
            messages={messages}
            isTyping={isTyping}
            onSend={handleSend}
          />
        </StepShell>
      )}

      {step === "summary" && (
        <StepShell
          step={4}
          title="Resumo da ordem de serviço"
          subtitle="Revise os dados antes de salvar."
          footer={
            <>
              <Button variant="outline" onClick={() => setStep("chat")}>
                Voltar
              </Button>
              <Button
                className="btn-steel"
                onClick={() => {
                  toast.success("Ordem de serviço salva com sucesso!", {
                    description: `OS #${Math.floor(1000 + Math.random() * 9000)} registrada para ${machine}.`,
                  });
                  resetAll();
                }}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Salvar Ordem de Serviço
              </Button>
            </>
          }
        >
          <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            <SummaryRow label="Técnico" value={email || "—"} />
            <SummaryRow label="Máquina" value={machine || "—"} />
            <SummaryRow
              label="Alarme visual"
              value={hasAlarm ? `Sim · ${alarmCode || "—"}` : "Não"}
            />
            <SummaryRow label="Relato do técnico" value={report || "—"} />
            <SummaryRow
              label="Solução aplicada"
              value={MOCK_SOLUTION.title}
            />
            <SummaryRow label="Referência" value={MOCK_SOLUTION.reference} />
          </dl>
        </StepShell>
      )}
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 bg-background/30 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
