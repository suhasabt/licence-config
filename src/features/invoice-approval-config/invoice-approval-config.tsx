import { useState, useRef, type KeyboardEvent } from 'react';
import {
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  ArrowRight,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ─── Types ───────────────────────────────────────────────────────────────────

type EscalationTier = {
  triggerDays: string;
  emailTo: string[];
  emailCc: string[];
};

type ApprovalLevel = {
  roleName: string;
  currentStatus: string;
  nextStatus: string;
  approverPositions: string[];
  cutOffDays: string;
  escalations: [EscalationTier, EscalationTier, EscalationTier];
};

type GlobalSettings = {
  approverLevels: '' | '1' | '2' | '3' | '4' | '5';
  cutOffDate: string;
  dashboardPosition: string;
};

type FieldErrors = Record<string, string>;

// ─── Mock data ────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  'Department Manager',
  'Finance Director',
  'VP Finance',
  'CFO',
  'Internal Finance Admin',
  'Regional Finance Head',
];

const POSITION_OPTIONS = [
  { id: 'pos_101', label: 'Department Manager' },
  { id: 'pos_102', label: 'Senior Manager' },
  { id: 'pos_201', label: 'Finance Director' },
  { id: 'pos_202', label: 'VP Finance' },
  { id: 'pos_301', label: 'CFO' },
  { id: 'pos_401', label: 'Regional Finance Head' },
  { id: 'pos_501', label: 'Internal Finance Admin' },
];

const DASHBOARD_ROLE_OPTIONS = [
  'internal_finance_admin',
  'super_admin',
  'finance_controller',
  'regional_finance_head',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEmptyEscalation(): EscalationTier {
  return { triggerDays: '', emailTo: [], emailCc: [] };
}

function makeEmptyLevel(): ApprovalLevel {
  return {
    roleName: '',
    currentStatus: '',
    nextStatus: '',
    approverPositions: [],
    cutOffDays: '',
    escalations: [makeEmptyEscalation(), makeEmptyEscalation(), makeEmptyEscalation()],
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function errKey(...parts: (string | number)[]) {
  return parts.join('.');
}

// ─── EmailChipInput ───────────────────────────────────────────────────────────

function EmailChipInput({
  emails,
  onChange,
  placeholder,
  error,
}: {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  error?: string;
}) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (raw: string) => {
    const email = raw.trim().replace(/,$/, '');
    if (!email) return;
    if (!emails.includes(email)) {
      onChange([...emails, email]);
    }
    setDraft('');
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addEmail(draft);
    } else if (e.key === 'Backspace' && draft === '' && emails.length > 0) {
      onChange(emails.slice(0, -1));
    }
  };

  const remove = (email: string) => onChange(emails.filter((e) => e !== email));

  return (
    <div>
      <div
        className={`flex min-h-[38px] flex-wrap gap-1.5 rounded-md border px-2 py-1.5 focus-within:ring-2 focus-within:ring-[#0056c1]/20 focus-within:border-[#0056c1] cursor-text transition-colors ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {emails.map((email) => (
          <span
            key={email}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              isValidEmail(email)
                ? 'bg-[#eef5ff] text-[#0056c1] border border-[#bcd0ff]'
                : 'bg-red-50 text-red-700 border border-red-300'
            }`}
          >
            {email}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(email); }}
              className="ml-0.5 rounded-full hover:bg-white/50"
            >
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => addEmail(draft)}
          placeholder={emails.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// ─── MultiSelectPosition ──────────────────────────────────────────────────────

function MultiSelectPosition({
  selected,
  onChange,
  error,
}: {
  selected: string[];
  onChange: (positions: string[]) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="relative" ref={ref}>
      <div
        className={`flex min-h-[38px] flex-wrap gap-1.5 rounded-md border px-2 py-1.5 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#0056c1]/20 ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0 ? (
          <span className="text-sm text-slate-400 py-0.5">Multiple positions to be selected</span>
        ) : (
          selected.map((id) => {
            const opt = POSITION_OPTIONS.find((p) => p.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 rounded-full bg-[#eef5ff] border border-[#bcd0ff] px-2 py-0.5 text-xs font-medium text-[#0056c1]"
              >
                {opt?.label ?? id}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggle(id); }}
                  className="ml-0.5 rounded-full hover:bg-white/50"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })
        )}
        <ChevronDown size={14} className="ml-auto self-center text-slate-400 shrink-0" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
          {POSITION_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <input
                type="checkbox"
                className="accent-[#0056c1]"
                checked={selected.includes(opt.id)}
                onChange={() => toggle(opt.id)}
              />
              {opt.label}
            </label>
          ))}
          <div className="border-t px-3 py-2">
            <Button size="sm" variant="ghost" className="text-xs text-[#0056c1]" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── StatusFlowDiagram ────────────────────────────────────────────────────────

function StatusFlowDiagram({ levels }: { levels: ApprovalLevel[] }) {
  const statuses = levels.map((l) => l.currentStatus).filter(Boolean);
  const finalStatus = levels[levels.length - 1]?.nextStatus;

  if (statuses.length === 0 && !finalStatus) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
      {statuses.map((s, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="rounded-md bg-[#fff4de] px-2 py-1 text-xs font-semibold text-[#b87400]">{s}</span>
          <ArrowRight size={14} className="text-slate-400" />
        </span>
      ))}
      {finalStatus && (
        <span className="rounded-md bg-[#e7f7ec] px-2 py-1 text-xs font-semibold text-[#15803d]">{finalStatus}</span>
      )}
    </div>
  );
}

// ─── EscalationBlock ──────────────────────────────────────────────────────────

function EscalationBlock({
  tier,
  levelIndex,
  escalation,
  onChange,
  errors,
}: {
  tier: number;
  levelIndex: number;
  escalation: EscalationTier;
  onChange: (next: EscalationTier) => void;
  errors: FieldErrors;
}) {
  const prefix = errKey('level', levelIndex, 'esc', tier);

  const triggerLabel =
    levelIndex === 0
      ? tier === 0
        ? 'days after report generated'
        : `days after Escalation ${tier} email`
      : tier === 0
        ? 'days after report received at this level'
        : `days after Escalation ${tier} email`;

  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full bg-[#0056c1] px-2.5 py-0.5 text-[11px] font-bold text-white">
          Escalation {tier + 1}
        </span>
        <span className="text-xs text-slate-500">
          Trigger:&nbsp;
          <input
            type="number"
            min={1}
            value={escalation.triggerDays}
            onChange={(e) => onChange({ ...escalation, triggerDays: e.target.value })}
            className={`inline-block w-14 rounded border px-1.5 py-0.5 text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-[#0056c1] ${
              errors[errKey(prefix, 'days')] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
            }`}
          />
          &nbsp;{triggerLabel}
        </span>
      </div>
      {errors[errKey(prefix, 'days')] && (
        <p className="mb-2 text-xs text-red-600">{errors[errKey(prefix, 'days')]}</p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">To</label>
          <EmailChipInput
            emails={escalation.emailTo}
            onChange={(emails) => onChange({ ...escalation, emailTo: emails })}
            placeholder="email@company.com"
            error={errors[errKey(prefix, 'to')]}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">CC</label>
          <EmailChipInput
            emails={escalation.emailCc}
            onChange={(emails) => onChange({ ...escalation, emailCc: emails })}
            placeholder="email@company.com (optional)"
          />
        </div>
      </div>
    </div>
  );
}

// ─── ApprovalLevelCard ────────────────────────────────────────────────────────

function ApprovalLevelCard({
  levelIndex,
  isLast,
  level,
  onChange,
  errors,
}: {
  levelIndex: number;
  isLast: boolean;
  level: ApprovalLevel;
  onChange: (next: ApprovalLevel) => void;
  errors: FieldErrors;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const setField = <K extends keyof ApprovalLevel>(key: K, value: ApprovalLevel[K]) =>
    onChange({ ...level, [key]: value });

  const setEscalation = (tierIndex: number, next: EscalationTier) => {
    const escalations = [...level.escalations] as ApprovalLevel['escalations'];
    escalations[tierIndex] = next;
    onChange({ ...level, escalations });
  };

  const prefix = errKey('level', levelIndex);

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader
        className="cursor-pointer select-none border-b bg-slate-50/60 px-5 py-4"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0056c1] text-xs font-bold text-white">
              {levelIndex + 1}
            </span>
            <CardTitle className="text-base font-bold text-slate-800">
              Level {levelIndex + 1}
              {isLast && (
                <span className="ml-2 text-xs font-normal text-slate-500">(Final level)</span>
              )}
            </CardTitle>
          </div>
          {collapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-5 p-5">
          {/* Role & Status */}
          <div>
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Role &amp; Status Configuration
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Role Name</label>
                <input
                  list={`role-options-${levelIndex}`}
                  value={level.roleName}
                  onChange={(e) => setField('roleName', e.target.value)}
                  placeholder="e.g. Department Manager"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                    errors[errKey(prefix, 'roleName')] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <datalist id={`role-options-${levelIndex}`}>
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r} />)}
                </datalist>
                {errors[errKey(prefix, 'roleName')] && (
                  <p className="mt-1 text-xs text-red-600">{errors[errKey(prefix, 'roleName')]}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Current Status</label>
                <input
                  value={level.currentStatus}
                  onChange={(e) => setField('currentStatus', e.target.value)}
                  placeholder="What status it will display"
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                    errors[errKey(prefix, 'currentStatus')] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors[errKey(prefix, 'currentStatus')] && (
                  <p className="mt-1 text-xs text-red-600">{errors[errKey(prefix, 'currentStatus')]}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Next Status
                  {isLast && <span className="ml-1 text-[#0056c1]">(Final)</span>}
                </label>
                <input
                  value={level.nextStatus}
                  onChange={(e) => setField('nextStatus', e.target.value)}
                  placeholder={isLast ? 'Final approved status' : 'What is the next status on Approval'}
                  className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                    errors[errKey(prefix, 'nextStatus')] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                {errors[errKey(prefix, 'nextStatus')] && (
                  <p className="mt-1 text-xs text-red-600">{errors[errKey(prefix, 'nextStatus')]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Approver Position */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Approver Position</label>
            <MultiSelectPosition
              selected={level.approverPositions}
              onChange={(positions) => setField('approverPositions', positions)}
              error={errors[errKey(prefix, 'positions')]}
            />
          </div>

          {/* Cut Off Days */}
          <div className="flex items-start gap-4">
            <div className="w-64">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Cut Off Date (Reminder Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={level.cutOffDays}
                  onChange={(e) => setField('cutOffDays', e.target.value)}
                  placeholder="No. of days"
                  className={`w-28 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                    errors[errKey(prefix, 'cutOffDays')] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                  }`}
                />
                <span className="text-sm text-slate-500">days since pending at this level</span>
              </div>
              {errors[errKey(prefix, 'cutOffDays')] && (
                <p className="mt-1 text-xs text-red-600">{errors[errKey(prefix, 'cutOffDays')]}</p>
              )}
            </div>
          </div>

          {/* Escalations */}
          <div>
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Escalation Configuration
            </h4>
            <div className="space-y-3">
              {level.escalations.map((esc, tierIndex) => (
                <EscalationBlock
                  key={tierIndex}
                  tier={tierIndex}
                  levelIndex={levelIndex}
                  escalation={esc}
                  onChange={(next) => setEscalation(tierIndex, next)}
                  errors={errors}
                />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(global: GlobalSettings, levels: ApprovalLevel[]): FieldErrors {
  const errors: FieldErrors = {};

  if (!global.approverLevels) errors['global.approverLevels'] = 'Required';
  if (!global.cutOffDate) errors['global.cutOffDate'] = 'Required';
  else if (new Date(global.cutOffDate) <= new Date()) errors['global.cutOffDate'] = 'Must be a future date';
  if (!global.dashboardPosition) errors['global.dashboardPosition'] = 'Required';

  levels.forEach((level, li) => {
    const prefix = errKey('level', li);
    if (!level.roleName.trim()) errors[errKey(prefix, 'roleName')] = 'Required';
    if (!level.currentStatus.trim()) errors[errKey(prefix, 'currentStatus')] = 'Required';
    if (!level.nextStatus.trim()) errors[errKey(prefix, 'nextStatus')] = 'Required';
    if (level.approverPositions.length === 0) errors[errKey(prefix, 'positions')] = 'Select at least one position';
    if (!level.cutOffDays || Number(level.cutOffDays) < 1)
      errors[errKey(prefix, 'cutOffDays')] = 'Must be a positive number';

    level.escalations.forEach((esc, ti) => {
      const ep = errKey(prefix, 'esc', ti);
      if (!esc.triggerDays || Number(esc.triggerDays) < 1)
        errors[errKey(ep, 'days')] = 'Must be ≥ 1';
      if (esc.emailTo.length === 0)
        errors[errKey(ep, 'to')] = 'At least one To email required';
      else {
        const invalid = esc.emailTo.filter((e) => !isValidEmail(e));
        if (invalid.length > 0) errors[errKey(ep, 'to')] = `Invalid email: ${invalid[0]}`;
      }
    });
  });

  return errors;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function InvoiceApprovalConfigPage() {
  const [global, setGlobal] = useState<GlobalSettings>({
    approverLevels: '',
    cutOffDate: '',
    dashboardPosition: '',
  });
  const [levels, setLevels] = useState<ApprovalLevel[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saved, setSaved] = useState(false);

  const setApproverLevels = (value: GlobalSettings['approverLevels']) => {
    const n = Number(value);
    const prev = levels.length;

    if (n < prev) {
      const confirmed = window.confirm(
        `Reducing to ${n} level${n === 1 ? '' : 's'} will clear the configuration for level${prev > n + 1 ? 's' : ''} ${Array.from({ length: prev - n }, (_, i) => i + n + 1).join(', ')}. Continue?`
      );
      if (!confirmed) return;
      setLevels(levels.slice(0, n));
    } else {
      const extra = Array.from({ length: n - prev }, makeEmptyLevel);
      setLevels([...levels, ...extra]);
    }

    setGlobal({ ...global, approverLevels: value });
    setErrors({});
    setSaved(false);
  };

  const updateLevel = (index: number, next: ApprovalLevel) => {
    const updated = [...levels];
    updated[index] = next;
    setLevels(updated);
    setSaved(false);
  };

  const handleSave = () => {
    const errs = validate(global, levels);
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const payload = {
      approverLevels: Number(global.approverLevels),
      invoiceCutOffDate: global.cutOffDate,
      globalDashboardRole: global.dashboardPosition,
      levels: levels.map((l, i) => ({
        level: i + 1,
        roleName: l.roleName,
        currentStatus: l.currentStatus,
        nextStatus: l.nextStatus,
        approverPositions: l.approverPositions,
        cutOffDays: Number(l.cutOffDays),
        escalations: l.escalations.map((esc, ti) => ({
          tier: ti + 1,
          triggerDays: Number(esc.triggerDays),
          triggerReference:
            i === 0 && ti === 0
              ? 'report_generation'
              : ti === 0
                ? 'level_received'
                : `escalation_${ti}_sent`,
          emailTo: esc.emailTo,
          emailCc: esc.emailCc,
        })),
      })),
    };

    console.log('Saving config:', payload);
    setSaved(true);
  };

  return (
    <ScrollArea className="flex-1 bg-slate-50">
      <div className="min-h-full px-6 pb-10 pt-5 lg:px-8">
        {/* Page header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Settings2 size={20} className="text-[#0056c1]" />
              <h1 className="text-2xl font-bold text-slate-900">Invoice Approval Configuration</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Define multi-level approval workflow, roles, statuses, and escalation emails.
            </p>
          </div>
          {saved && (
            <span className="rounded-full bg-[#e7f7ec] px-3 py-1 text-sm font-semibold text-[#15803d]">
              Configuration saved
            </span>
          )}
        </div>

        {/* Global Settings */}
        <Card className="mb-6 border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b bg-slate-50/60 px-5 py-4">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Global Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
            {/* Approver Levels */}
            <div id="global.approverLevels">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Approver Levels <span className="text-red-500">*</span>
              </label>
              <select
                value={global.approverLevels}
                onChange={(e) => setApproverLevels(e.target.value as GlobalSettings['approverLevels'])}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                  errors['global.approverLevels'] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select number of levels</option>
                {['1', '2', '3', '4', '5'].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {errors['global.approverLevels'] && (
                <p className="mt-1 text-xs text-red-600">{errors['global.approverLevels']}</p>
              )}
            </div>

            {/* Cut Off Date */}
            <div id="global.cutOffDate">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Invoice Approval Final Cut Off Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={global.cutOffDate}
                onChange={(e) => setGlobal({ ...global, cutOffDate: e.target.value })}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                  errors['global.cutOffDate'] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors['global.cutOffDate'] && (
                <p className="mt-1 text-xs text-red-600">{errors['global.cutOffDate']}</p>
              )}
            </div>

            {/* Dashboard Position */}
            <div id="global.dashboardPosition">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Global Dashboard Position <span className="text-red-500">*</span>
              </label>
              <select
                value={global.dashboardPosition}
                onChange={(e) => setGlobal({ ...global, dashboardPosition: e.target.value })}
                className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0056c1]/20 focus:border-[#0056c1] transition-colors ${
                  errors['global.dashboardPosition'] ? 'border-red-400 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select a role</option>
                {DASHBOARD_ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                ))}
              </select>
              {errors['global.dashboardPosition'] && (
                <p className="mt-1 text-xs text-red-600">{errors['global.dashboardPosition']}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status flow visualization */}
        {levels.length > 0 && <StatusFlowDiagram levels={levels} />}

        {/* Approval Level Cards */}
        {levels.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-16 text-center">
            <Plus size={32} className="mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-400">
              Select the number of Approver Levels above to get started.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {levels.map((level, index) => (
            <ApprovalLevelCard
              key={index}
              levelIndex={index}
              isLast={index === levels.length - 1}
              level={level}
              onChange={(next) => updateLevel(index, next)}
              errors={errors}
            />
          ))}
        </div>

        {/* Save */}
        {levels.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-600">
                Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} before saving.
              </p>
            )}
            <Button
              className="ml-auto bg-[#0056c1] text-white hover:bg-[#004899] px-8"
              onClick={handleSave}
            >
              Save Configuration
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
