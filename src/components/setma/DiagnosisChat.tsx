import { useState } from "react";
import { BookOpenCheck, Wrench } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import diagrama from "@/assets/diagrama-tecnico.jpg";

export type ChatMessage =
  | { id: string; role: "user" | "assistant"; kind: "text"; text: string }
  | { id: string; role: "assistant"; kind: "solution"; solution: Solution };

export type Solution = {
  title: string;
  reference: string;
  steps: string[];
};

export const MOCK_SOLUTION: Solution = {
  title: "Perda de pressão no circuito hidráulico principal",
  reference: "Base Interna · MAN-HID-2291 / rev. 4",
  steps: [
    "Bloqueie a máquina (LOTO) e alivie a pressão residual do acumulador.",
    "Inspecione o filtro de retorno: se houver saturação acima de 70%, substitua o elemento.",
    "Confira o ajuste da válvula reguladora de pressão (torque 24 N·m) conforme o diagrama.",
    "Reinicie o painel e monitore a pressão por 5 minutos: o alvo é 180 ± 5 bar.",
  ],
};

export function DiagnosisChat({
  messages,
  isTyping,
  onSend,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Conversation className="max-h-[52vh] min-h-[300px] flex-1 rounded-lg border border-border bg-background/40">
        <ConversationContent className="gap-5">
          {messages.map((m) =>
            m.kind === "text" ? (
              <Message key={m.id} from={m.role}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                      : ""
                  }
                >
                  <MessageResponse>{m.text}</MessageResponse>
                </MessageContent>
              </Message>
            ) : (
              <Message key={m.id} from="assistant">
                <MessageContent>
                  <SolutionCard solution={m.solution} />
                </MessageContent>
              </Message>
            )
          )}
          {isTyping && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer className="text-sm">
                  SeTma.IA está analisando o histórico...
                </Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={(message, event) => {
          event.preventDefault();
          const value = (message.text ?? text).trim();
          if (!value) return;
          onSend(value);
          setText("");
        }}
      >
        <PromptInputTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Descreva o sintoma observado no equipamento..."
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            {...(isTyping ? { status: "submitted" as const } : {})}
            disabled={isTyping || !text.trim()}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <article className="panel-steel w-full max-w-xl overflow-hidden rounded-lg">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <BookOpenCheck className="h-4 w-4 text-primary" />
        <span className="font-display text-xs uppercase tracking-[0.18em] text-primary">
          Solução da Base Interna
        </span>
      </div>
      <img
        src={diagrama}
        alt="Diagrama técnico do bloco de válvulas hidráulicas"
        loading="lazy"
        width={1024}
        height={640}
        className="h-40 w-full object-cover sm:h-48"
      />
      <div className="px-4 py-4">
        <h3 className="text-sm font-semibold">{solution.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {solution.reference}
        </p>
        <ol className="mt-4 space-y-3">
          {solution.steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Wrench className="h-3.5 w-3.5 text-primary" />
          Tempo estimado de intervenção: 35 min
        </p>
      </div>
    </article>
  );
}
