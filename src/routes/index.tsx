import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  LogIn,
  QrCode,
  Search,
  ShieldCheck,
  Wrench,
  CalendarClock,
  Eye,
} from "lucide-react";
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
          "Abra ordens de serviço com diagnóstico assistido por IA: tipo de manutenção, leitura de QR Code da máquina, triagem de alarme, chat técnico e resumo editável.",
      },
      { property: "og:title", content: "SeTma.IA — Diagnóstico de manutenção" },
      {
        property: "og:description",
        content:
          "Wizard de manutenção industrial: tipo de atendimento, QR Code da máquina, triagem de alarme, diagnóstico por IA e ordem de serviço editável.",
      },
    ],
  }),
  component: Index,
});

const MACHINES = [
  { code: "PH-01", name: "Prensa Hidráulica 01" },
  { code: "TC-03", name: "Torno CNC 03" },
  { code: "IP-07", name: "Injetora Plástica 07" },
  { code: "ET-12", name: "Esteira Transportadora 12" },
  { code: "CA-02", name: "Compressor de Ar 02" },
];

const SERVICE_TYPES = [
  {
    id: "Corretiva",
    description: "Falha ativa ou parada de produção",
    icon: Wrench,
  },
  {
    id: "Preventiva",
    description: "Plano programado de manutenção",
    icon: CalendarClock,
  },
  {
    id: "Inspeção",
    description: "Verificação de rotina e checklist",
    icon: Eye,
  },
] as const;

type Step = "login" | "type" | "machine" | "alarm" | "chat" | "summary";

function Index() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [machine, setMachine] = useState("");
  const [machineQuery, setMachineQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasAlarm, setHasAlarm] = useState<boolean | null>(null);
  const [alarmCode, setAlarmCode] = useState("");
  const [commandName, setCommandName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [report, setReport] = useState("");
  const [solutionTitle, setSolutionTitle] = useState(MOCK_SOLUTION.title);
  const [observations, setObservations] = useState("");

  const results = MACHINES.filter((m) => {
    const q = machineQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q)
    );
  });

  function resetAll() {
    setStep("type");
    setServiceType("");
    setMachine("");
    setMachineQuery("");
    setIsScanning(false);
    setHasAlarm(null);
    setAlarmCode("");
    setCommandName("");
    setMessages([]);
    setReport("");
    setSolutionTitle(MOCK_SOLUTION.title);
    setObservations("");
  }

  function handleScan() {
    setIsScanning(true);
    window.setTimeout(() => {
      const picked = MACHINES[Math.floor(Math.random() * MACHINES.length)]!;
      setMachine(picked.name);
      setIsScanning(false);
      toast.success("QR Code lido", {
        description: `${picked.code} · ${picked.name}`,
      });
    }, 1200);
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
                setStep("type");
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

      {step === "type" && (
        <StepShell
          step={1}
          title="Tipo de atendimento"
          subtitle="Selecione a natureza da ordem de serviço."
          footer={
            <Button
              className="btn-steel"
              disabled={!serviceType}
              onClick={() => setStep("machine")}
            >
              Avançar <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {SERVICE_TYPES.map((t) => {
              const Icon = t.icon;
              const active = serviceType === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setServiceType(t.id)}
                  className={[
                    "rounded-lg border p-4 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/30 hover:border-primary/50",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground",
                    ].join(" ")}
                  />
                  <p className="mt-3 font-display text-sm uppercase tracking-wider">
                    {t.id}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Técnico logado: {email || "não informado"}
          </p>
        </StepShell>
      )}

      {step === "machine" && (
        <StepShell
          step={2}
          title="Identificação da máquina"
          subtitle={`Atendimento ${serviceType} · escaneie o QR Code ou busque pelo número`}
          footer={
            <>
              <Button variant="outline" onClick={() => setStep("type")}>
                Voltar
              </Button>
              <Button
                className="btn-steel"
                disabled={!machine}
                onClick={() => setStep("alarm")}
              >
                Avançar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          }
        >
          <Tabs defaultValue="qr">
            <TabsList>
              <TabsTrigger value="qr">
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="mr-2 h-4 w-4" />
                Número da máquina
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="mt-5">
              <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-background/30 p-6">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-lg border border-primary/40 bg-background/60">
                  <QrCode
                    className={[
                      "h-16 w-16 text-primary",
                      isScanning ? "animate-pulse" : "",
                    ].join(" ")}
                  />
                  {isScanning && (
                    <span className="absolute inset-x-3 top-1/2 h-px animate-pulse bg-primary" />
                  )}
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Aponte a câmera para a etiqueta do equipamento
                </p>
                <Button
                  className="btn-steel"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? "Lendo etiqueta..." : "Escanear QR Code"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="search" className="mt-5 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="machine-query">Número ou nome</Label>
                <Input
                  id="machine-query"
                  value={machineQuery}
                  onChange={(e) => setMachineQuery(e.target.value)}
                  placeholder="Ex.: PH-01 ou Prensa"
                />
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {results.map((m) => (
                  <li key={m.code}>
                    <button
                      type="button"
                      onClick={() => setMachine(m.name)}
                      className={[
                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                        machine === m.name
                          ? "bg-primary/10 text-foreground"
                          : "bg-background/30 hover:bg-accent",
                      ].join(" ")}
                    >
                      <span>{m.name}</span>
                      <span className="font-display text-xs uppercase tracking-wider text-primary">
                        {m.code}
                      </span>
                    </button>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="px-4 py-3 text-sm text-muted-foreground">
                    Nenhuma máquina encontrada.
                  </li>
                )}
              </ul>
            </TabsContent>
          </Tabs>

          {machine && (
            <p className="mt-5 flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Máquina selecionada: <strong>{machine}</strong>
            </p>
          )}
        </StepShell>
      )}

      {step === "alarm" && (
        <StepShell
          step={3}
          title="Triagem de alarme"
          subtitle={`${machine} · ${serviceType}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setStep("machine")}>
                Voltar
              </Button>
              <Button
                className="btn-steel"
                disabled={
                  hasAlarm === null ||
                  (hasAlarm && (!alarmCode.trim() || !commandName.trim()))
                }
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
                setCommandName("");
              }}
            >
              Não
            </Button>
          </div>

          {hasAlarm === true && (
            <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="alarm">Código do alarme</Label>
                <Input
                  id="alarm"
                  value={alarmCode}
                  onChange={(e) => setAlarmCode(e.target.value)}
                  placeholder="Ex.: E-2291"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="command">Qual nome do comando?</Label>
                <Input
                  id="command"
                  value={commandName}
                  onChange={(e) => setCommandName(e.target.value)}
                  placeholder="Ex.: Válvula solenoide Y3"
                />
              </div>
            </div>
          )}
        </StepShell>
      )}

      {step === "chat" && (
        <StepShell
          step={4}
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
          step={5}
          title="Resumo da ordem de serviço"
          subtitle="Todos os campos são editáveis antes de salvar."
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
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5 text-primary" />
              Revise e ajuste as informações do atendimento.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="s-tec">Técnico</Label>
                <Input
                  id="s-tec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-type">Tipo de atendimento</Label>
                <Input
                  id="s-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-machine">Máquina</Label>
                <Input
                  id="s-machine"
                  value={machine}
                  onChange={(e) => setMachine(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-alarm">Alarme visual</Label>
                <Input
                  id="s-alarm"
                  value={hasAlarm ? alarmCode : "Sem alarme visual"}
                  onChange={(e) => {
                    setHasAlarm(true);
                    setAlarmCode(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-report">Relato do técnico</Label>
              <Textarea
                id="s-report"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-solution">Solução aplicada</Label>
              <Textarea
                id="s-solution"
                value={solutionTitle}
                onChange={(e) => setSolutionTitle(e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Referência: {MOCK_SOLUTION.reference}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-obs">Observações finais</Label>
              <Textarea
                id="s-obs"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={3}
                placeholder="Peças trocadas, pendências, recomendações..."
              />
            </div>
          </div>
        </StepShell>
      )}
    </main>
  );
}
