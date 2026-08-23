import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowUp, FileText, FolderKanban, ListOrdered, Sparkles } from 'lucide-react';
import { SlideOver } from '@/components/ui/SlideOver';
import { useUiStore } from '@/store/ui.store';
import { aiService } from '@/services';
import { projects } from '@/mock-data';
import { formatRelativeTime } from '@/lib/format';
import { transition } from '@/lib/motion';
import { cn } from '@/lib/cn';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  { label: 'Summarize project activity', icon: FileText, prompt: 'Summarize recent project activity' },
  { label: 'Identify overdue work', icon: AlertTriangle, prompt: 'What is overdue right now?' },
  { label: 'Suggest task priorities', icon: ListOrdered, prompt: 'What should I prioritize next?' },
  { label: 'Generate a project summary', icon: FolderKanban, prompt: '', pickProject: true },
];

export function AiWorkspace() {
  const open = useUiStore((s) => s.aiWorkspaceOpen);
  const setOpen = useUiStore((s) => s.setAiWorkspaceOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pickingProject, setPickingProject] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  function pushUserMessage(content: string) {
    setMessages((prev) => [...prev, { id: `u_${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString() }]);
  }

  async function send(prompt: string) {
    if (!prompt.trim() || loading) return;
    pushUserMessage(prompt);
    setInput('');
    setLoading(true);
    try {
      const suggestion = await aiService.ask(prompt);
      setMessages((prev) => [
        ...prev,
        { id: suggestion.id, role: 'assistant', content: suggestion.response, timestamp: suggestion.createdAt },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function summarizeProject(projectId: string, projectName: string) {
    setPickingProject(false);
    pushUserMessage(`Generate a summary for ${projectName}`);
    setLoading(true);
    try {
      const suggestion = await aiService.generateProjectSummary(projectId);
      setMessages((prev) => [
        ...prev,
        { id: suggestion.id, role: 'assistant', content: suggestion.response, timestamp: suggestion.createdAt },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SlideOver
      open={open}
      onOpenChange={setOpen}
      title="Aureon AI"
      description="Ask about projects, tasks, or what needs attention."
      width="max-w-md"
    >
      <div className="flex h-full flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Sparkles size={20} strokeWidth={1.75} />
              </span>
              <p className="max-w-[240px] text-sm text-text-secondary">
                Ask me to summarize activity, flag overdue work, or suggest what to focus on next.
              </p>
              <div className="flex w-full flex-col gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => (suggestion.pickProject ? setPickingProject(true) : send(suggestion.prompt))}
                    className="flex items-center gap-2.5 rounded-lg border border-border-default px-3.5 py-2.5 text-left text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:bg-surface-overlay hover:text-text-primary"
                  >
                    <suggestion.icon size={14} className="text-accent" />
                    {suggestion.label}
                  </button>
                ))}
              </div>

              {pickingProject && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full flex-col gap-1.5 rounded-lg border border-border-default p-2"
                >
                  <p className="px-1.5 py-1 text-[10px] font-medium uppercase tracking-wide text-text-tertiary">Choose a project</p>
                  {projects.slice(0, 6).map((project) => (
                    <button
                      key={project.id}
                      onClick={() => summarizeProject(project.id, project.name)}
                      className="rounded-md px-2 py-1.5 text-left text-xs text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
                    >
                      {project.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition.fast}
                className={cn('flex flex-col gap-1', message.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                    message.role === 'user'
                      ? 'rounded-br-sm bg-accent text-ink-950'
                      : 'rounded-bl-sm border border-border-default bg-surface-overlay text-text-primary',
                  )}
                >
                  {message.content}
                </div>
                <span className="px-1 text-[10px] text-text-tertiary">{formatRelativeTime(message.timestamp)}</span>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border-default bg-surface-overlay px-3.5 py-3 w-fit">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-text-tertiary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border-default p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aureon AI…"
            className="h-10 flex-1 rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-ink-950 transition-opacity disabled:opacity-40"
          >
            <ArrowUp size={16} />
          </button>
        </form>
      </div>
    </SlideOver>
  );
}
