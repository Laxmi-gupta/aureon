import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label, Textarea } from '@/components/ui/Input';

export type DecisionAction = 'approve' | 'reject' | 'changes';

const COPY: Record<DecisionAction, { title: string; description: string; confirmLabel: string; tone: 'default' | 'danger' }> = {
  approve: {
    title: 'Approve request',
    description: 'This will move the request to its next stage.',
    confirmLabel: 'Approve',
    tone: 'default',
  },
  reject: {
    title: 'Reject request',
    description: 'The requester will be notified this request was declined.',
    confirmLabel: 'Reject',
    tone: 'danger',
  },
  changes: {
    title: 'Request changes',
    description: 'Let the requester know what needs to be updated.',
    confirmLabel: 'Request changes',
    tone: 'default',
  },
};

interface DecisionDialogProps {
  action: DecisionAction | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (note: string) => void;
  loading?: boolean;
}

export function DecisionDialog({ action, onOpenChange, onConfirm, loading }: DecisionDialogProps) {
  const [note, setNote] = useState('');

  if (!action) return null;
  const copy = COPY[action];

  return (
    <Dialog
      open={Boolean(action)}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setNote('');
      }}
      title={copy.title}
      description={copy.description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={copy.tone === 'danger' ? 'danger' : 'primary'}
            loading={loading}
            onClick={() => {
              onConfirm(note);
              setNote('');
            }}
          >
            {copy.confirmLabel}
          </Button>
        </>
      }
    >
      <Label htmlFor="decision-note">Note {action === 'changes' ? '(recommended)' : '(optional)'}</Label>
      <Textarea
        id="decision-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={action === 'changes' ? 'What needs to change before this can be approved?' : 'Add context for the requester…'}
      />
    </Dialog>
  );
}
