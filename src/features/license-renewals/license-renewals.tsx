import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  History,
  Paperclip,
  PencilLine,
  X,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export type LicenseMode = 'current' | 'previous' | 'auto' | 'pause';
export type LicenseTab = 'current' | 'history';
export type LicensePreviewContext = 'current' | 'previous';
export type LicenseTimelineContext = 'current' | 'previous' | 'history-may' | 'history-apr' | 'history-mar' | 'history-feb';
export type LicenseReviewState = 'pending' | 'approved' | 'clarification-requested';
export type LicensePopupVariant = 'current' | 'previous';
type DualMonthKey = 'may' | 'june';
type TimelineTone = 'red' | 'amber' | 'blue' | 'slate' | 'green';

export type LicenseTimelineEvent = {
  time: string;
  title: string;
  detail: string;
  tone: TimelineTone;
};

type LicenseModeContent = {
  status: string;
  badgeClass: string;
  bannerClass: string;
  bannerText: string;
  bannerButtonClass: string;
  bannerButtonLabel: string;
  eyebrow: string;
  title: string;
  statusLabel: string;
  statusClass: string;
  statusTone: string;
  bodyClass: string;
  titleClass: string;
  metricCards: Array<{
    label: string;
    value: string;
    labelTone?: string;
    valueTone?: string;
    cardClass?: string;
  }>;
  primaryActionLabel: string;
  primaryAction: string;
  primaryActionClass: string;
  secondaryActionLabel?: string;
  secondaryActionClass?: string;
  showPreviewAction: boolean;
  warningClass: string;
  warning: string;
  timelineTitle: string;
  timeline: LicenseTimelineEvent[];
};

export const licenseModeContent: Record<LicenseMode, LicenseModeContent> = {
  current: {
    status: 'Pending Approval',
    badgeClass: 'bg-[#fff2c6] text-[#b87400]',
    bannerClass: 'border-[#f0d88d] bg-[#fcf4df] text-[#8c5610]',
    bannerText: 'If no action is taken, an invoice will be automatically sent to the finance team at rajath@acme.com based on the system-generated licence count. Post-deadline corrections will not be possible.',
    bannerButtonClass: 'bg-[#16823a] text-white hover:bg-[#116a30]',
    bannerButtonLabel: 'Approve',
    eyebrow: 'ACTION REQUIRED',
    title: 'June 2026 - Licence Approval',
    statusLabel: 'Pending Approval',
    statusClass: 'bg-[#fff2c6] text-[#b87400]',
    statusTone: 'text-[#c83c3c]',
    bodyClass: 'border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)]',
    titleClass: 'text-slate-900',
    metricCards: [
      {
        label: 'REPORT GENERATED',
        value: '30 Jun 2026, 2:15 PM',
      },
      {
        label: 'APPROVAL WINDOW',
        value: '1 Jul - 5 Jul 2026',
      },
      {
        label: 'DAYS REMAINING',
        value: '3 days',
        labelTone: 'text-[#d44a4a]',
        valueTone: 'text-[#d44a4a]',
        cardClass: 'bg-[#fff2f2]',
      },
    ],
    primaryActionLabel: 'Approve',
    primaryAction: 'Approve',
    primaryActionClass: 'bg-[#16823a] text-white hover:bg-[#116a30]',
    secondaryActionLabel: 'Request Clarification',
    secondaryActionClass: 'border-[#0056c1] text-[#0056c1] hover:bg-[#eef5ff]',
    showPreviewAction: true,
    warningClass: 'border border-[#fca5a5] bg-[#fff0f0] text-[#d72e2e]',
    warning: 'No approval by 5 Jul may cause disruption of service\nIf no action is taken, an invoice will be automatically sent to the finance team at rajath@acme.com based on the system-generated licence count. Post-deadline corrections will not be possible.',
    timelineTitle: 'JUNE 2026 LOGS',
    timeline: [
      { time: '5 Jul 2026 · end', title: 'Invoice generated based on system count', detail: 'If no action is taken before the deadline.', tone: 'slate' },
      { time: 'On deadline', title: 'Auto approval', detail: 'Automatic approval triggers at cutoff.', tone: 'slate' },
      { time: 'Now', title: 'Awaiting your approval', detail: 'Approval is pending from your side.', tone: 'blue' },
      { time: '1 Jul 2026, 9:00 AM', title: 'Reminder sent', detail: 'Reminder email sent before cutoff.', tone: 'green' },
      { time: '30 Jun 2026, 2:30 PM', title: 'Sent for approval', detail: 'Report validated and sent to you.', tone: 'green' },
      { time: '30 Jun 2026, 2:15 PM · start', title: 'Licence count report generated', detail: 'Licence count report generated.', tone: 'green' },
    ],
  },
  previous: {
    status: 'Overdue',
    badgeClass: 'bg-[#ffe7e7] text-[#cf6b6b]',
    bannerClass: 'border-[#ff8f8f] bg-[#fff5f5] text-[#b23a3a]',
    bannerText: 'Previous cycle is still open. Review logs if you need to understand what happened before acting.',
    bannerButtonClass: 'bg-[#0056c1] text-white hover:bg-[#004899]',
    bannerButtonLabel: 'Review & Approve',
    eyebrow: 'ACTION REQUIRED',
    title: 'May 2026 licence approval is still pending',
    statusLabel: 'Overdue',
    statusClass: 'bg-[#ffe7e7] text-[#cf6b6b]',
    statusTone: 'text-[#ef5a5a]',
    bodyClass: 'border-[#ff8f8f] bg-[#fffdf8] shadow-[0_2px_10px_rgba(15,23,42,0.08)]',
    titleClass: 'text-slate-900',
    metricCards: [
      {
        label: 'CUTOFF MISSED',
        value: 'May 2026',
      },
      {
        label: 'CURRENT STATUS',
        value: 'Awaiting your action',
        labelTone: 'text-[#ef5a5a]',
        valueTone: 'text-[#d97706]',
        cardClass: 'bg-[#fff5f5]',
      },
    ],
    primaryActionLabel: 'Approve',
    primaryAction: 'Approve',
    primaryActionClass: 'bg-[#16823a] text-white hover:bg-[#116a30]',
    secondaryActionLabel: 'Request Clarification',
    secondaryActionClass: 'border-[#0056c1] text-[#0056c1] hover:bg-[#eef5ff]',
    showPreviewAction: true,
    warningClass: 'border-l-4 border-[#ef5a5a] bg-[#fff0f0] text-[#d72e2e]',
    warning: 'No action by 5 Jun may trigger invoice processing based on the system-generated count. Post-deadline corrections may not be accepted.',
    timelineTitle: 'MAY 2026 LOGS',
    timeline: [
      { time: 'Now', title: 'Awaiting customer action', detail: 'Previous cycle is still open and needs approval or correction.', tone: 'red' },
      { time: '5 Jun 2026, 11:59 PM', title: 'Cutoff missed', detail: 'Approval was not completed before the monthly cutoff.', tone: 'red' },
      { time: '4 Jun 2026, 9:00 AM', title: 'Final reminder sent', detail: 'Customer was reminded before cutoff.', tone: 'amber' },
      { time: '31 May 2026, 2:30 PM', title: 'Sent for approval', detail: 'May report was validated and sent for approval.', tone: 'blue' },
    ],
  },
  auto: {
    status: 'Pending Approval',
    badgeClass: 'bg-[#fff2c6] text-[#b87400]',
    bannerClass: 'border-[#f0d88d] bg-[#fcf4df] text-[#8c5610]',
    bannerText: 'Approval cutoff missed. June 2026 count may be auto-approved using the system count.',
    bannerButtonClass: 'bg-[#0056c1] text-white hover:bg-[#004899]',
    bannerButtonLabel: 'Review & Approve',
    eyebrow: 'AUTO APPROVAL RISK',
    title: 'June 2026 - Auto Approval Risk',
    statusLabel: 'Pending Approval',
    statusClass: 'bg-[#fff2c6] text-[#b87400]',
    statusTone: 'text-[#c83c3c]',
    bodyClass: 'border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)]',
    titleClass: 'text-slate-900',
    metricCards: [
      {
        label: 'REPORT GENERATED',
        value: '30 Jun 2026, 2:15 PM',
      },
      {
        label: 'APPROVAL WINDOW',
        value: '1 Jul - 5 Jul 2026',
      },
      {
        label: 'DAYS REMAINING',
        value: '0 days',
        labelTone: 'text-[#d44a4a]',
        valueTone: 'text-[#d44a4a]',
        cardClass: 'bg-[#fff2f2]',
      },
    ],
    primaryActionLabel: 'Approve',
    primaryAction: 'Approve',
    primaryActionClass: 'bg-[#16823a] text-white hover:bg-[#116a30]',
    secondaryActionLabel: 'Request Clarification',
    secondaryActionClass: 'border-[#0056c1] text-[#0056c1] hover:bg-[#eef5ff]',
    showPreviewAction: true,
    warningClass: 'border-l-4 border-[#e64b4b] bg-[#fff0f0] text-[#d72e2e]',
    warning: 'The 5 Jul cutoff has passed. Invoice processing may proceed using the system-generated count unless an exception is accepted.',
    timelineTitle: 'JUNE 2026 LOGS',
    timeline: [
      { time: '6 Jul 2026, 12:00 AM', title: 'Auto approval risk started', detail: 'Cutoff missed without approval or correction.', tone: 'red' },
      { time: '5 Jul 2026, 11:59 PM', title: 'Approval cutoff missed', detail: 'Post-deadline corrections may not be accepted.', tone: 'red' },
      { time: '4 Jul 2026, 9:00 AM', title: 'Final reminder sent', detail: 'Customer warned before cutoff.', tone: 'amber' },
      { time: '30 Jun 2026, 2:30 PM', title: 'Sent for approval', detail: 'Report validated and sent to you.', tone: 'blue' },
    ],
  },
  pause: {
    status: 'Service Paused',
    badgeClass: 'bg-[#5a1414] text-white',
    bannerClass: 'border-[#5a1414] bg-[#5a1414] text-white',
    bannerText: 'Service termination risk: June 2026 approval remains unresolved after cutoff. Service access may be paused after 12 Jul.',
    bannerButtonClass: 'bg-white text-[#5a1414] hover:bg-white/90',
    bannerButtonLabel: 'Resolve Now',
    eyebrow: 'SERVICE PAUSED',
    title: 'June 2026 - Approval Overdue',
    statusLabel: 'Service Paused',
    statusClass: 'bg-[#5a1414] text-white',
    statusTone: 'text-[#c83c3c]',
    bodyClass: 'border-[#5a1414] bg-white shadow-[0_0_0_1px_rgba(90,20,20,0.22),0_2px_10px_rgba(90,20,20,0.12)]',
    titleClass: 'text-slate-900',
    metricCards: [
      {
        label: 'REPORT GENERATED',
        value: '30 Jun 2026, 2:15 PM',
      },
      {
        label: 'CUTOFF STATUS',
        value: 'Missed - Service Paused',
        labelTone: 'text-[#ff6b6b]',
        valueTone: 'text-[#d62f2f]',
        cardClass: 'bg-[#fff1f1]',
      },
    ],
    primaryActionLabel: 'Contact support',
    primaryAction: 'Contact support',
    primaryActionClass: 'bg-[#5a1414] text-white hover:bg-[#471010]',
    showPreviewAction: true,
    warningClass: 'border-l-4 border-[#e64b4b] bg-[#fff0f0] text-[#d72e2e]',
    warning: 'Your invoice was processed using the system-generated count. Contact support to dispute or make corrections to your invoice.',
    timelineTitle: 'JUNE 2026 LOGS',
    timeline: [
      { time: '6 Jul 2026, 9:00 AM', title: 'Service paused', detail: 'Approval remains unresolved after cutoff.', tone: 'red' },
      { time: '5 Jul 2026, 11:59 PM', title: 'Approval cutoff missed', detail: 'Risk window started.', tone: 'red' },
      { time: '4 Jul 2026, 9:00 AM', title: 'Final reminder sent', detail: 'Customer warned before cutoff.', tone: 'amber' },
      { time: '30 Jun 2026, 2:30 PM', title: 'Sent for approval', detail: 'Report validated and sent to you.', tone: 'blue' },
    ],
  },
};

export const licenseHistoryItems = [
  {
    month: 'Apr 2026',
    status: 'Approved',
    actor: 'John Doue',
    date: '5 May 2026',
    comment: 'Approved on submitted count',
    timelineContext: 'history-apr' as const,
  },
  {
    month: 'Mar 2026',
    status: 'Approved',
    actor: 'BlueTree Support',
    date: '6 Apr 2026',
    comment: 'Employee exit correction accepted',
    timelineContext: 'history-mar' as const,
  },
  {
    month: 'Feb 2026',
    status: 'Approved',
    actor: 'Finance Contact',
    date: '4 Mar 2026',
    comment: 'Approved from email link',
    timelineContext: 'history-feb' as const,
  },
];

export const licensePreviewSections = [
  {
    title: 'API SERVICES',
    rows: [
      { month: 'Jun-26', module: 'AADHAAR_VALIDATION', count: '2,155' },
      { month: '', module: 'FACE_VALIDATION', count: '2,013' },
      { month: '', module: 'BANK_ACCOUNT_VERIFICATION', count: '1,965' },
      { month: '', module: 'PAN_CHECK', count: '19' },
      { month: '', module: 'MOBILE_NO_VERIFICATION', count: '2,364' },
      { month: '', module: 'CRC_OPTIONAL_CHECK', count: '1,324' },
    ],
  },
];

const licensePreviewByMonth = {
  'June 2026': {
    monthLabel: 'Jun-26',
    supportComment:
      'We reconciled the June licence report. CORE changed to 17,501 after adding June joiners and excluding exited employees. API service counts are based on billable usage from 1-30 Jun 2026.',
  },
  'May 2026': {
    monthLabel: 'May-26',
    supportComment:
      'We reconciled the May licence report. CORE changed to 17,501 after adding May joiners and excluding exited employees. API service counts are based on billable usage from 1-31 May 2026.',
  },
};

export const licenseTimelineContent: Record<
  Exclude<LicenseTimelineContext, 'current'>,
  {
    title: string;
    timeline: LicenseTimelineEvent[];
  }
> = {
  previous: {
    title: 'May 2026 Logs',
    timeline: [
      { time: 'Now', title: 'Awaiting customer action', detail: 'Previous cycle is still open and needs approval or correction.', tone: 'red' },
      { time: '5 Jun 2026, 11:59 PM', title: 'Cutoff missed', detail: 'Approval was not completed before the monthly cutoff.', tone: 'red' },
      { time: '4 Jun 2026, 9:00 AM', title: 'Final reminder sent', detail: 'Customer was reminded before cutoff.', tone: 'amber' },
      { time: '31 May 2026, 2:30 PM', title: 'Sent for approval', detail: 'May report was validated and sent for approval.', tone: 'blue' },
      { time: '31 May 2026, 2:15 PM', title: 'Report generated', detail: 'May licence count report generated.', tone: 'slate' },
    ],
  },
  'history-may': {
    title: 'May 2026 Logs',
    timeline: [
      { time: '5 Jun 2026, 10:15 AM', title: 'Approved by John Doue', detail: 'Approved on submitted count.', tone: 'blue' },
      { time: '4 Jun 2026, 9:00 AM', title: 'Reminder sent', detail: 'Reminder email sent before cutoff.', tone: 'amber' },
      { time: '31 May 2026, 2:30 PM', title: 'Sent for approval', detail: 'May report was validated and sent for approval.', tone: 'blue' },
      { time: '31 May 2026, 2:15 PM', title: 'Report generated', detail: 'May licence count report generated.', tone: 'slate' },
    ],
  },
  'history-apr': {
    title: 'Apr 2026 Logs',
    timeline: [
      { time: '5 May 2026, 10:15 AM', title: 'Approved by John Doue', detail: 'Approved on submitted count.', tone: 'blue' },
      { time: '4 May 2026, 9:00 AM', title: 'Reminder sent', detail: 'Reminder email sent before cutoff.', tone: 'amber' },
      { time: '30 Apr 2026, 2:30 PM', title: 'Sent for approval', detail: 'April report validated and sent to customer.', tone: 'blue' },
      { time: '30 Apr 2026, 2:15 PM', title: 'Report generated', detail: 'April licence count report generated.', tone: 'slate' },
    ],
  },
  'history-mar': {
    title: 'Mar 2026 Logs',
    timeline: [
      { time: '6 Apr 2026, 4:20 PM', title: 'Correction closed', detail: 'Employee exit correction accepted by BlueTree Support.', tone: 'blue' },
      { time: '5 Apr 2026, 3:10 PM', title: 'Correction reviewed', detail: 'Support validated the requested employee exclusion.', tone: 'amber' },
      { time: '3 Apr 2026, 11:25 AM', title: 'Correction requested', detail: 'Customer reported an employee exit mismatch.', tone: 'red' },
      { time: '31 Mar 2026, 2:30 PM', title: 'Sent for approval', detail: 'March report validated and sent to customer.', tone: 'blue' },
    ],
  },
  'history-feb': {
    title: 'Feb 2026 Logs',
    timeline: [
      { time: '4 Mar 2026, 9:40 AM', title: 'Approved from email link', detail: 'Finance Contact approved without correction.', tone: 'blue' },
      { time: '3 Mar 2026, 9:00 AM', title: 'Reminder sent', detail: 'Reminder email sent before cutoff.', tone: 'amber' },
      { time: '28 Feb 2026, 2:30 PM', title: 'Sent for approval', detail: 'February report validated and sent to customer.', tone: 'blue' },
      { time: '28 Feb 2026, 2:15 PM', title: 'Report generated', detail: 'February licence count report generated.', tone: 'slate' },
    ],
  },
};

const licensePreviewCore = {
  month: '',
  module: 'WORKFORCE MANAGEMENT',
  count: '17,501',
};

function getLicensePreviewContent(monthName: string) {
  return licensePreviewByMonth[monthName as keyof typeof licensePreviewByMonth] ?? licensePreviewByMonth['June 2026'];
}

function AnimatedWarningIcon({
  className,
  iconSize = 18,
}: {
  className: string;
  iconSize?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      animate={shouldReduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 1.14, 1] }}
      transition={shouldReduceMotion ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
    >
      {!shouldReduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-[inherit] border border-current"
          animate={{ opacity: [0.75, 0], scale: [1, 1.85] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <AlertTriangle size={iconSize} />
    </motion.div>
  );
}

const timelineToneClasses: Record<TimelineTone, { dot: string; title: string; dotStyle?: string }> = {
  red: { dot: 'bg-[#ef5a5a]', title: 'text-[#d72e2e]' },
  amber: { dot: 'bg-[#f0a11a]', title: 'text-[#cc7d00]' },
  blue: { dot: 'bg-transparent border-2 border-[#0056c1]', title: 'text-[#0056c1]' },
  slate: { dot: 'bg-[#e2e8f0]', title: 'text-slate-400' },
  green: { dot: 'bg-[#16a34a]', title: 'text-[#15803d]' },
};

function SectionMetricCard({
  label,
  value,
  labelTone,
  valueTone,
  cardClass,
}: {
  label: string;
  value: string;
  labelTone?: string;
  valueTone?: string;
  cardClass?: string;
}) {
  return (
    <div className={`rounded-lg px-3 py-3 ${cardClass ?? 'bg-[#f7f8fb]'}`}>
      <div className={`text-[10px] font-bold uppercase tracking-[0.16em] ${labelTone ?? 'text-slate-400'}`}>{label}</div>
      <div className={`mt-1 text-sm font-bold ${valueTone ?? 'text-slate-900'}`}>{value}</div>
    </div>
  );
}

function TimelineRow({ event, includeDivider = false }: { event: LicenseTimelineEvent; includeDivider?: boolean }) {
  const tones = timelineToneClasses[event.tone];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${tones.dot}`} />
        {includeDivider && <span className="mt-1 h-full w-px bg-slate-200" />}
      </div>
      <div className="pb-2">
        <div className="text-xs text-slate-400">{event.time}</div>
        <div className={`text-sm font-bold ${tones.title}`}>{event.title}</div>
      </div>
    </div>
  );
}

function LicensePreviewTable({
  colLabel,
  rows,
}: {
  colLabel: string;
  rows: Array<{ month: string; module: string; count: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0056c1]">
          <tr>
            <th className="px-4 py-3">Month</th>
            <th className="px-4 py-3">{colLabel}</th>
            <th className="px-4 py-3 text-right">Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => (
            <tr
              key={`${row.module}-${index}`}
              className={`bg-white ${index === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}`}
            >
              <td className="px-4 py-3 text-slate-500">{row.month || ''}</td>
              <td className="px-4 py-3">{row.module}</td>
              <td className="px-4 py-3 text-right">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LicensePreviewNudge({
  reviewState = 'pending',
  clarificationSummary,
  supportComment,
}: {
  reviewState?: LicenseReviewState;
  clarificationSummary?: ClarificationSummary | null;
  supportComment: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hasClarification = reviewState === 'clarification-requested' && clarificationSummary;
  const Icon = reviewState === 'approved' ? Check : hasClarification ? PencilLine : AlertTriangle;
  const toneClass = reviewState === 'approved'
    ? 'border-[#b7e3c5] bg-[#eaf8ef] text-[#166534]'
    : hasClarification
      ? 'border-[#bcd0ff] bg-[#eef5ff] text-[#0056c1]'
      : 'border-[#f0d88d] bg-[#fff4de] text-[#8c5610]';
  const iconClass = reviewState === 'approved'
    ? 'bg-white text-[#16823a]'
    : hasClarification
      ? 'bg-white text-[#0056c1]'
      : 'bg-white text-[#c26f00]';

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-3 py-3 text-sm leading-5 ${toneClass}`}>
      <motion.div
        className={`relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${iconClass}`}
        animate={shouldReduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 1.14, 1] }}
        transition={shouldReduceMotion ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      >
        {!shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-md border border-current"
            animate={{ opacity: [0.75, 0], scale: [1, 1.85] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <Icon size={15} />
      </motion.div>
      <div className="min-w-0 flex-1">
        {reviewState === 'approved' ? (
          <>
            <div className="font-bold text-[#16823a]">Licence count approved</div>
            <div className="mt-0.5 text-[#166534]">This report is approved and queued for invoice processing.</div>
          </>
        ) : hasClarification ? (
          <>
            <div className="font-bold text-[#0056c1]">Clarification requested</div>
            <div className="mt-0.5 break-words text-[#2e5fd4]">{clarificationSummary.comment}</div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-[#0056c1]">
              <span>{clarificationSummary.submittedAt}</span>
              {clarificationSummary.attachmentName && <span>Attachment: {clarificationSummary.attachmentName}</span>}
            </div>
          </>
        ) : (
          <>
            <div className="font-bold text-[#8c5610]">BlueTree support comment</div>
            <div className="mt-0.5 text-[#8c5610]">{supportComment}</div>
            <div className="mt-1 text-xs font-semibold text-[#8c5610]">
              Review the workbook before approving or requesting clarification.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function LicenseUrgencyBanner({
  mode,
  onReview,
  onApprove,
}: {
  mode: LicenseMode;
  onReview: () => void;
  onApprove?: () => void;
}) {
  const content = licenseModeContent[mode];

  return (
    <div className={`border-b px-4 py-2.5 ${content.bannerClass}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <AnimatedWarningIcon
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-current"
            iconSize={16}
          />
          <div>
            <div className="text-sm font-bold leading-tight">Licence approval action required</div>
            <div className="text-xs leading-snug text-current/85">{content.bannerText}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            className="text-sm font-semibold underline underline-offset-2 opacity-80 hover:opacity-100"
            onClick={onReview}
          >
            View More
          </button>
          <Button size="sm" className={content.bannerButtonClass} onClick={onApprove ?? onReview}>
            <Check size={14} className="mr-1" />
            {content.bannerButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function LicenseLandingPopup({
  open,
  variant,
  onOpenChange,
  onReview,
  onRequestClarification,
  onPreview,
  onReviewAll,
}: {
  open: boolean;
  variant: LicensePopupVariant;
  onOpenChange: (open: boolean) => void;
  onReview: () => void;
  onRequestClarification?: () => void;
  onPreview?: () => void;
  onReviewAll: () => void;
}) {
  const [popupApproved, setPopupApproved] = useState(false);

  if (variant === 'current') {
    if (popupApproved) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-[520px] overflow-hidden rounded-[18px] border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:w-full">
            <DialogHeader className="border-b px-5 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dcfce7] text-[#16a34a]">
                  <Check size={20} />
                </div>
                <DialogTitle className="text-[1.08rem] font-bold text-slate-900">Approved June 2026 license count</DialogTitle>
              </div>
            </DialogHeader>

            <div className="space-y-3 px-5 py-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-100 bg-[#f7f9fc] px-4 py-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">REPORT GENERATED</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">30 Jun 2026, 2:15 PM</div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-[#f7f9fc] px-4 py-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">APPROVED ON</div>
                  <div className="mt-1 text-sm font-bold text-slate-900">2 Jul 2026, 10:24 AM</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                <Check size={16} className="mt-0.5 shrink-0 text-[#16a34a]" />
                <div>
                  <div className="text-sm font-bold text-[#15803d]">Approved on 2 Jul 2026</div>
                  <div className="mt-0.5 text-sm text-[#166534]">Invoice was generated from the license count and sent to the finance team at rajath@ACME.com. No further action is needed.</div>
                </div>
              </div>
              <button className="text-sm font-semibold text-[#0056c1] underline underline-offset-2 hover:text-[#004899]" onClick={() => { onReview(); onOpenChange(false); }}>
                View More
              </button>
            </div>

            <div className="border-t px-5 py-4">
              {onPreview && (
                <Button variant="outline" className="gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]" onClick={() => { onPreview(); onOpenChange(false); }}>
                  <Eye size={16} />
                  Preview
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[520px] overflow-hidden rounded-[18px] border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:w-full">
          <DialogHeader className="border-b px-5 py-4 text-left">
            <div className="flex items-start gap-3">
              <AnimatedWarningIcon
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#ef5a5a]"
                iconSize={18}
              />
              <div className="pr-8">
                <DialogTitle className="text-[1.08rem] font-bold text-slate-900">Waiting for your Approval – June 2026 License</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 px-5 py-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-100 bg-[#f7f9fc] px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">APPROVAL CUTOFF</div>
                <div className="mt-1 text-sm font-bold text-slate-900">5 Jul 2026, 11:59 PM</div>
              </div>
              <div className="rounded-lg border border-[#fca5a5] bg-[#fff0f0] px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#cf6b6b]">TIME REMAINING</div>
                <div className="mt-1 text-sm font-bold text-[#d72e2e]">3 days</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#fca5a5] bg-[#fff0f0] px-4 py-3">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#ef5a5a]" />
              <div className="text-sm leading-5 text-[#7a2e2e]">
                <div className="font-bold text-[#d72e2e]">No approval by 5 Jul may cause disruption of service</div>
                <div className="mt-1">If no action is taken, an invoice will be automatically sent to the finance team at <span className="font-medium text-[#0056c1]">rajath@acme.com</span> based on the system-generated licence count. Post-deadline corrections will not be possible.</div>
              </div>
            </div>

            <button className="text-sm font-semibold text-[#0056c1] underline underline-offset-2 hover:text-[#004899]" onClick={() => { onReview(); onOpenChange(false); }}>
              View More
            </button>
          </div>

          <div className="flex items-center gap-3 border-t px-5 py-4">
            <Button className="bg-[#16823a] text-white hover:bg-[#116a30]" onClick={() => setPopupApproved(true)}>
              <Check size={15} className="mr-1" />
              Approve
            </Button>
            {onPreview && (
              <Button variant="outline" className="gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]" onClick={() => { onPreview(); onOpenChange(false); }}>
                <Eye size={16} />
                Preview
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[592px] overflow-hidden rounded-[18px] border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:w-full">
        <DialogHeader className="border-b px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <AnimatedWarningIcon
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe5e5] text-[#ef5a5a]"
              iconSize={18}
            />
            <div className="pr-10">
              <DialogTitle className="text-[1.08rem] font-bold text-slate-900">
                2 license counts need your approval
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-600">
                Current month&apos;s cutoff is in 3 days - 1 previous month is also unresolved.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Current Month
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[1.06rem] font-bold text-slate-900">June 2026</div>
                  <div className="mt-1 text-sm text-slate-500">Cutoff: 5 Jul 2026, 11:59 PM</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#fff4de] px-3 py-1 text-xs font-bold text-[#cf7f00]">3 Days Left</span>
                  <Button
                    variant="outline"
                    className="border-[#0056c1] text-[#0056c1] hover:bg-[#eef5ff]"
                    onClick={() => {
                      onReview();
                      onOpenChange(false);
                    }}
                  >
                    Review &amp; Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Previous Months - Overdue
            </div>
            <div className="rounded-xl border border-[#ff8f8f] bg-white px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[1.06rem] font-bold text-slate-900">May 2026</div>
                  <div className="mt-1 text-sm text-slate-500">Cutoff passed 5 Jun 2026</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#ffe7e7] px-3 py-1 text-xs font-bold text-[#cf6b6b]">Overdue</span>
                  <Button
                    variant="outline"
                    className="border-[#0056c1] text-[#0056c1] hover:bg-[#eef5ff]"
                    onClick={() => {
                      onReview();
                      onOpenChange(false);
                    }}
                  >
                    Review &amp; Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-start gap-2 border-t px-5 py-4">
          <Button
            className="bg-[#0056c1] text-white hover:bg-[#004899]"
            onClick={() => {
              onReviewAll();
              onOpenChange(false);
            }}
          >
            Review All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ConversationMessage =
  | { type: 'question'; text: string }
  | { type: 'reply'; time: string; sender: string; text?: string; attachment?: string }
  | { type: 'user'; text: string };

const PREVIEW_SEED_MESSAGES: ConversationMessage[] = [
  { type: 'question', text: 'PAN_Check shows 19 — much lower than usual. Were June joiners counted before the billing cutoff?' },
  { type: 'reply', time: '1 Jul, 9:00 AM', sender: 'John Doe', text: '19 reflects post-15 Jun transactions only — pre-update calls billed separately. June joiners included as of 30 Jun EOD.' },
  { type: 'reply', time: '1 Jul, 9:00 AM', sender: 'BlueTree support', attachment: 'june 2026 license count V2.csv' },
];

export function LicenceCountPreviewDialog({
  open,
  monthName = 'June 2026',
  reviewState = 'pending',
  clarificationSummary = null,
  onOpenChange,
  onApprove,
  onClarification,
}: {
  open: boolean;
  monthName?: string;
  reviewState?: LicenseReviewState;
  clarificationSummary?: ClarificationSummary | null;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onClarification: () => void;
}) {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ConversationMessage[]>(PREVIEW_SEED_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const chatAttachRef = useRef<HTMLInputElement>(null);
  const isApproved = reviewState === 'approved';

  const previewContent = getLicensePreviewContent(monthName);
  const platformRows = [{ ...licensePreviewCore, month: previewContent.monthLabel }];
  const apiRows = licensePreviewSections[0].rows.map((row, index) => ({
    ...row,
    month: index === 0 ? previewContent.monthLabel : '',
  }));

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [...prev, { type: 'user', text }]);
    setChatInput('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[900px] overflow-hidden rounded-2xl border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:w-full">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e9f1ff] text-[#0056c1]">
              <Eye size={17} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[1.05rem] font-bold text-slate-900">Licence Count Preview</span>
                {isApproved && <span className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-bold text-[#15803d]">Approved</span>}
              </div>
              <div className="text-sm text-slate-500">{monthName} summary from the downloaded licence report.</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body: single or two-panel */}
        <div className={`grid ${showChat ? 'grid-cols-1 md:grid-cols-[1fr_340px]' : 'grid-cols-1'}`} style={{ maxHeight: '65vh' }}>
          {/* Left: tables */}
          <div className="overflow-y-auto px-6 py-5 space-y-4 border-r border-slate-100">
            <LicensePreviewTable colLabel="Platform" rows={platformRows} />
            <LicensePreviewTable colLabel="API Services" rows={apiRows} />
          </div>

          {/* Right: conversation */}
          {showChat && (
          <div className="flex flex-col overflow-hidden">
            {/* Conversation header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Conversation</span>
              <button type="button" className="text-xs font-semibold text-[#0056c1] hover:underline">View Older</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {chatMessages.map((msg, i) => {
                if (msg.type === 'question') {
                  return (
                    <p key={i} className="text-sm leading-5 text-slate-800">{msg.text}</p>
                  );
                }
                if (msg.type === 'reply') {
                  return (
                    <div key={i}>
                      <div className="mb-1 flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-[#0056c1]">{msg.time}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{msg.sender}</span>
                      </div>
                      {msg.text && <p className="text-sm leading-5 text-slate-800">{msg.text}</p>}
                      {msg.attachment && (
                        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                          {msg.attachment}
                          <Download size={11} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  );
                }
                if (msg.type === 'user') {
                  return (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl bg-[#0056c1] px-3 py-2 text-sm leading-5 text-white">{msg.text}</div>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Input — hidden when approved */}
            {!isApproved && (
              <div className="border-t border-slate-100 px-3 py-3">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                  placeholder="Example: Emp 10432 was terminated on 15 Jun and should be excluded. Expected count: 17,500."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-[#f8fafc] px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0056c1]"
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between">
                  <input ref={chatAttachRef} type="file" className="hidden" />
                  <button type="button" onClick={() => chatAttachRef.current?.click()} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-[#0056c1]">
                    <Paperclip size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={sendChat}
                    disabled={!chatInput.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0056c1] text-white hover:bg-[#004899] disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-3">
            {!isApproved && (
              <Button className="bg-[#16823a] text-white hover:bg-[#116a30]" onClick={onApprove}>
                <Check size={15} className="mr-1" />
                Approve
              </Button>
            )}
            <div className="group relative">
              <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 text-slate-500 hover:bg-slate-50">
                <Download size={15} />
              </Button>
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#1e293b] px-3 py-2 text-center text-xs leading-4 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Downloaded license report.<br />generated by System
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1e293b]" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChat((v) => !v)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${showChat ? 'border-[#0056c1] bg-[#0056c1] text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RequestClarificationDialog({
  open,
  onOpenChange,
  comment,
  onCommentChange,
  attachmentName,
  onAttachmentChange,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: string;
  onCommentChange: (value: string) => void;
  attachmentName: string | null;
  onAttachmentChange: (value: string | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[560px] overflow-hidden rounded-[18px] border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:w-full">
        <DialogHeader className="border-b px-4 py-3.5 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f1ff] text-[#0056c1]">
              <PencilLine size={18} />
            </div>
            <div className="pr-10">
              <DialogTitle className="text-[1.08rem] font-bold text-slate-900">Request Clarification</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-600">
                Tell BlueTree what needs to be corrected and why before this approval can proceed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-4 py-4">
          <div className="rounded-lg bg-[#fff4de] px-4 py-3 text-sm leading-6 text-[#c26f00]">
            Use the downloaded report to mention employee IDs, API services, or count mismatch details. A reason is required so the support team can review the correction.
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-800">What needs correction and why?</span>
            <textarea
              value={comment}
              onChange={(event) => onCommentChange(event.target.value)}
              placeholder="Example: Emp 10432 was terminated on 15 Jun and should be excluded. Expected count: 17,500."
              className="min-h-[104px] w-full resize-none rounded-lg border border-[#bcd0ff] px-3 py-2 text-sm text-slate-800 outline-none ring-2 ring-[#e6f0ff] placeholder:text-slate-400 focus:border-[#0056c1] focus:ring-[#d7e6ff]"
            />
          </label>

          <input
            ref={attachmentInputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onAttachmentChange(file ? file.name : null);
            }}
          />

          {attachmentName ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcd0ff] bg-[#eef5ff] px-3 py-1.5 text-xs font-semibold text-[#0056c1]">
                <Paperclip size={13} />
                {attachmentName}
                <button
                  type="button"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[#0056c1] transition-colors hover:bg-[#dbe9ff]"
                  onClick={() => onAttachmentChange(null)}
                >
                  <X size={12} />
                  <span className="sr-only">Remove attachment</span>
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-8 gap-2 border-[#0056c1] px-3 text-[#0056c1] hover:bg-[#eef5ff]"
                onClick={() => attachmentInputRef.current?.click()}
              >
                <Paperclip size={15} />
                Replace attachment
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-8 gap-2 border-[#0056c1] px-3 text-[#0056c1] hover:bg-[#eef5ff]"
              onClick={() => attachmentInputRef.current?.click()}
            >
              <Paperclip size={15} />
              Add Attachment
            </Button>
          )}
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 border-t px-4 py-4">
          <Button type="button" variant="outline" className="px-4" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#0056c1] text-white hover:bg-[#004899] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={comment.trim().length === 0}
            onClick={() => {
              onSubmit();
              onOpenChange(false);
            }}
          >
            Request Clarification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LicenseLogsDialog({
  open,
  onOpenChange,
  context,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: Exclude<LicenseTimelineContext, 'current'> | null;
}) {
  const content = context ? licenseTimelineContent[context] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[520px] overflow-hidden rounded-[18px] border-none bg-white p-0 shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:w-full">
        <DialogHeader className="border-b px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f1ff] text-[#0056c1]">
              <History size={18} />
            </div>
            <div className="pr-10">
              <DialogTitle className="text-[1.08rem] font-bold text-slate-900">{content?.title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-slate-600">
                Month-specific approval log with the back-and-forth for this cycle.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 px-5 py-5">
          {content?.timeline.map((event, index) => (
            <TimelineRow
              key={`${event.time}-${event.title}`}
              event={event}
              includeDivider={index < content.timeline.length - 1}
            />
          ))}
        </div>

        <DialogFooter className="border-t px-5 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryMonthCard({
  month,
  status,
  actor,
  date,
  comment,
  onViewLogs,
}: {
  month: string;
  status: string;
  actor: string;
  date: string;
  comment: string;
  onViewLogs: () => void;
}) {
  return (
    <Card className="border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
      <CardContent className="p-5">
        <div>
          <div className="text-lg font-bold text-slate-900">{month}</div>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
              status === 'Approved'
                ? 'bg-[#e7f7ec] text-[#15803d]'
                : 'bg-[#fff2c6] text-[#b87400]'
            }`}
          >
            {status}
          </span>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="font-semibold text-slate-700">{actor}</div>
          <div className="text-slate-500">
            {date} · {comment}
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1 gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]">
            <Download size={16} />
            Download
          </Button>
          <Button variant="outline" className="flex-1 gap-2" onClick={onViewLogs}>
            <History size={16} />
            View logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type ClarificationSummary = {
  submittedAt: string;
  comment: string;
  attachmentName: string | null;
};

type MonthCardState = {
  reviewState: LicenseReviewState;
  approvedAt: string | null;
  clarificationSummary: ClarificationSummary | null;
};

const createInitialMonthCardStates = (): Record<DualMonthKey, MonthCardState> => ({
  may: {
    reviewState: 'pending',
    approvedAt: null,
    clarificationSummary: null,
  },
  june: {
    reviewState: 'pending',
    approvedAt: null,
    clarificationSummary: null,
  },
});

function CurrentStateCard({
  mode,
  reviewState,
  expanded,
  approvedAt,
  clarificationSummary,
  onToggleExpanded,
  onPreview,
  onClarification,
  onApprove,
}: {
  mode: LicenseMode;
  reviewState: LicenseReviewState;
  expanded: boolean;
  approvedAt: string | null;
  clarificationSummary: ClarificationSummary | null;
  onToggleExpanded: () => void;
  onPreview: () => void;
  onClarification: () => void;
  onApprove: () => void;
}) {
  const baseContent = licenseModeContent[mode];
  const isApproved = reviewState === 'approved';
  const isClarificationRequested = reviewState === 'clarification-requested';
  const displayMonthLabel = mode === 'previous' ? 'May 2026' : 'June 2026';
  const reportGeneratedValue = mode === 'previous' ? '31 May 2026, 2:15 PM' : '30 Jun 2026, 2:15 PM';
  const statusLabel = isApproved
    ? 'Approved'
    : isClarificationRequested
      ? 'Clarification sent'
      : baseContent.statusLabel;
  const statusClass = isApproved
    ? 'bg-[#e7f7ec] text-[#15803d]'
    : isClarificationRequested
      ? 'bg-[#eef5ff] text-[#0056c1]'
      : baseContent.statusClass;
  const eyebrow = isApproved
    ? 'APPROVED'
    : isClarificationRequested
      ? 'CLARIFICATION SENT'
      : baseContent.eyebrow;
  const eyebrowTone = isApproved
    ? 'text-[#15803d]'
    : isClarificationRequested
      ? 'text-[#0056c1]'
      : mode === 'pause'
        ? 'text-[#ef5a5a]'
        : baseContent.statusTone;
  const cardClass = isApproved
    ? 'border-[#b7e1c0] bg-white shadow-[0_2px_10px_rgba(21,128,61,0.08)]'
    : isClarificationRequested
      ? 'border-[#bcd0ff] bg-white shadow-[0_2px_10px_rgba(37,99,235,0.08)]'
      : baseContent.bodyClass;
  const title = isApproved
    ? `${displayMonthLabel} - Licence Approved`
    : isClarificationRequested
      ? `${displayMonthLabel} - Clarification Requested`
      : baseContent.title;
  const titleClass = isApproved || isClarificationRequested ? 'text-slate-900' : baseContent.titleClass;
  const headerNote = isApproved
    ? approvedAt
      ? `Approved on ${approvedAt}`
      : 'Approved'
    : isClarificationRequested && clarificationSummary
      ? `Request sent on ${clarificationSummary.submittedAt}`
      : null;
  const metricCards = isApproved
    ? [
        { label: 'REPORT GENERATED', value: reportGeneratedValue },
        { label: 'APPROVED ON', value: approvedAt ?? '2 Jul 2026, 10:24 AM' },
        { label: 'STATUS', value: 'Invoice generated', cardClass: 'bg-[#eefaf1]', valueTone: 'text-[#15803d]' },
      ]
    : isClarificationRequested
      ? [
        { label: 'REPORT GENERATED', value: reportGeneratedValue },
        { label: 'REQUEST SENT', value: clarificationSummary?.submittedAt ?? '5 Jul 2026, 11:20 AM' },
        {
          label: 'ATTACHMENT',
          value: clarificationSummary?.attachmentName ?? 'Uploaded',
          cardClass: 'bg-[#eef5ff]',
          valueTone: 'text-[#0056c1]',
        },
      ]
      : baseContent.metricCards;
  const warning = isClarificationRequested
    ? 'BlueTree support will review the request and attached evidence before the cutoff.'
    : baseContent.warning;
  const warningClass = isClarificationRequested
    ? 'border-l-4 border-[#0056c1] bg-[#eef5ff] text-[#0056c1]'
    : baseContent.warningClass;
  const summaryComment = isClarificationRequested && clarificationSummary ? clarificationSummary.comment : null;

  if (!expanded) {
    return (
      <Card className={cardClass}>
        <CardHeader className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              {!isApproved && (
                <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${eyebrowTone}`}>
                  <AlertTriangle size={14} />
                  {eyebrow}
                </div>
              )}
              <CardTitle className={`${isApproved ? '' : 'mt-1'} text-[1.05rem] font-bold ${titleClass}`}>{title}</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-md px-3 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
              <button
                type="button"
                aria-label="Expand licence approval card"
                onClick={onToggleExpanded}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={cardClass}>
      <CardHeader className="border-b border-slate-200 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            {!isApproved && (
              <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] ${eyebrowTone}`}>
                <AlertTriangle size={14} />
                {eyebrow}
              </div>
            )}
            <CardTitle className={`${isApproved ? '' : 'mt-1'} text-[1.05rem] font-bold ${titleClass}`}>{title}</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-md px-3 py-1 text-xs font-bold ${statusClass}`}>{statusLabel}</span>
            <button
              type="button"
              aria-label="Collapse licence approval card"
              onClick={onToggleExpanded}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            >
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className={`grid grid-cols-1 gap-3 ${metricCards.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          {metricCards.map((metric) => (
            <SectionMetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              labelTone={metric.labelTone}
              valueTone={metric.valueTone}
              cardClass={metric.cardClass}
            />
          ))}
        </div>

        {summaryComment && (
          <div className="mt-4 rounded-lg border border-[#bcd0ff] bg-[#f5f9ff] px-4 py-3 text-sm leading-6 text-[#004899]">
            <div className="font-semibold">Clarification note</div>
            <div className="mt-1">{summaryComment}</div>
            {clarificationSummary?.attachmentName && (
              <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0056c1] shadow-sm">
                <Paperclip size={13} className="mr-1.5" />
                {clarificationSummary.attachmentName}
              </div>
            )}
          </div>
        )}

        {isApproved ? (
          <>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
              <Check size={15} className="mt-0.5 shrink-0 text-[#16a34a]" />
              <div>
                <div className="text-sm font-bold text-[#15803d]">Approved by you on {approvedAt ? approvedAt.split(',')[0] : '2 Jul 2026'}</div>
                <div className="mt-0.5 text-sm text-[#166534]">Invoice was generated from the license count and sent to the finance team at rajath@ACME.com. No further action is needed.</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]" onClick={onPreview}>
                <Eye size={16} />
                Preview
              </Button>
            </div>
          </>
        ) : isClarificationRequested ? (
          <>
            <div className={`mt-4 border-l-4 px-4 py-3 text-sm leading-6 ${warningClass}`}>
              {warning}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" className="gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]" onClick={onPreview}>
                <Eye size={16} />
                Preview
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db] text-slate-500 hover:bg-slate-50">
                <Download size={16} />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${warningClass}`}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[#ef5a5a]" />
                <div>
                  <div className="font-bold">{warning.split('\n')[0]}</div>
                  {warning.split('\n')[1] && <div className="mt-0.5">{warning.split('\n')[1]}</div>}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Button className={baseContent.primaryActionClass} onClick={onApprove}>
                  <Check size={15} className="mr-1" />
                  {baseContent.primaryActionLabel}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {baseContent.showPreviewAction && (
                  <Button variant="outline" className="gap-2 border-[#bcd0ff] text-[#0056c1] hover:bg-[#eef5ff]" onClick={onPreview}>
                    <Eye size={16} />
                    Preview
                  </Button>
                )}
                <Button variant="outline" size="icon" className="h-10 w-10 border-[#d1d5db] text-slate-500 hover:bg-slate-50">
                  <Download size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

const approvedTimeline: LicenseTimelineEvent[] = [
  { time: '2 Jul 2026, 10:24 AM', title: 'Invoice generated based on system count', detail: '', tone: 'green' },
  { time: '2 Jul 2026, 10:24 AM', title: 'Approved', detail: '', tone: 'green' },
  { time: '1 Jul 2026, 9:00 AM', title: 'Reminder sent', detail: '', tone: 'green' },
  { time: '30 Jun 2026, 2:30 PM', title: 'Sent for approval', detail: '', tone: 'green' },
  { time: '30 Jun 2026, 2:15 PM · start', title: 'Licence count report generated', detail: '', tone: 'green' },
];

function TimelinePanel({
  mode,
  reviewState,
  expanded,
  onToggleExpanded,
}: {
  mode: LicenseMode;
  reviewState?: LicenseReviewState;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const content = licenseModeContent[mode];
  const timeline = mode === 'current' && reviewState === 'approved' ? approvedTimeline : content.timeline;
  const visibleEvents = expanded ? timeline : timeline.slice(0, 4);

  return (
    <Card className="border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
      <CardHeader className="border-b border-slate-200 px-5 py-4">
        <CardTitle className="text-[0.95rem] font-bold uppercase tracking-[0.08em] text-slate-800">
          {mode === 'current' && reviewState === 'approved' ? 'JUNE 2026 LOGS' : content.timelineTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {visibleEvents.map((event, index) => (
            <TimelineRow key={`${event.time}-${event.title}`} event={event} includeDivider={index < visibleEvents.length - 1} />
          ))}
        </div>

        <Button variant="outline" size="sm" className="mt-4" type="button" onClick={onToggleExpanded}>
          {expanded ? 'Show less' : 'Show full timeline'}
        </Button>
      </CardContent>
    </Card>
  );
}

export function LicenceRenewalsPage({
  mode,
  licenseTab,
  onLicenseTabChange,
  initialReviewState = 'pending',
}: {
  mode: LicenseMode;
  licenseTab: LicenseTab;
  onLicenseTabChange: (tab: LicenseTab) => void;
  initialReviewState?: LicenseReviewState;
}) {
  const [expandedTimeline, setExpandedTimeline] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [reviewState, setReviewState] = useState<LicenseReviewState>(initialReviewState);

  useEffect(() => {
    if (initialReviewState === 'approved') {
      setReviewState('approved');
      setApprovedAt('2 Jul 2026, 10:24 AM');
      setIsCardExpanded(true);
    }
  }, [initialReviewState]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMonthName, setPreviewMonthName] = useState('June 2026');
  const [isClarificationOpen, setIsClarificationOpen] = useState(false);
  const [clarificationComment, setClarificationComment] = useState('');
  const [clarificationAttachment, setClarificationAttachment] = useState<string | null>(null);
  const [clarificationSummary, setClarificationSummary] = useState<ClarificationSummary | null>(null);
  const [approvedAt, setApprovedAt] = useState<string | null>(null);
  const [logModalContext, setLogModalContext] = useState<Exclude<LicenseTimelineContext, 'current'> | null>(null);
  const [dualActiveMonth, setDualActiveMonth] = useState<DualMonthKey>('may');
  const [dualMonthStates, setDualMonthStates] = useState<Record<DualMonthKey, MonthCardState>>(createInitialMonthCardStates);
  const [dualClarificationMonth, setDualClarificationMonth] = useState<DualMonthKey>('may');
  const [dualClarificationComment, setDualClarificationComment] = useState('');
  const [dualClarificationAttachment, setDualClarificationAttachment] = useState<string | null>(null);
  const historyItems = licenseHistoryItems;

  useEffect(() => {
    setExpandedTimeline(false);
    setIsCardExpanded(true);
    setReviewState('pending');
    setIsPreviewOpen(false);
    setPreviewMonthName('June 2026');
    setIsClarificationOpen(false);
    setClarificationComment('');
    setClarificationAttachment(null);
    setClarificationSummary(null);
    setApprovedAt(null);
    setLogModalContext(null);
    setDualActiveMonth('may');
    setDualMonthStates(createInitialMonthCardStates());
    setDualClarificationMonth('may');
    setDualClarificationComment('');
    setDualClarificationAttachment(null);
  }, [mode]);

  const openPreview = (monthName = 'June 2026') => {
    setPreviewMonthName(monthName);
    setIsPreviewOpen(true);
  };

  const openClarification = () => {
    setClarificationComment('');
    setClarificationAttachment(null);
    setIsClarificationOpen(true);
  };

  const handleApprove = () => {
    setReviewState('approved');
    setApprovedAt('5 Jul 2026, 11:58 PM');
    setIsCardExpanded(false);
    setExpandedTimeline(false);
  };

  const handleClarificationSubmit = () => {
    setReviewState('clarification-requested');
    setClarificationSummary({
      submittedAt: '5 Jul 2026, 11:20 AM',
      comment: clarificationComment.trim(),
      attachmentName: clarificationAttachment,
    });
    setIsClarificationOpen(false);
    setIsCardExpanded(true);
  };

  const updateDualMonthState = (month: DualMonthKey, nextState: Partial<MonthCardState>) => {
    setDualMonthStates((current) => ({
      ...current,
      [month]: {
        ...current[month],
        ...nextState,
      },
    }));
  };

  const handleDualApprove = (month: DualMonthKey) => {
    updateDualMonthState(month, {
      reviewState: 'approved',
      approvedAt: month === 'may' ? '5 Jun 2026, 11:58 PM' : '5 Jul 2026, 11:58 PM',
    });
  };

  const openDualPreview = (month: DualMonthKey) => {
    openPreview(month === 'may' ? 'May 2026' : 'June 2026');
  };

  const openDualClarification = (month: DualMonthKey) => {
    setDualClarificationMonth(month);
    setDualClarificationComment('');
    setDualClarificationAttachment(null);
    setIsClarificationOpen(true);
  };

  const handleDualClarificationSubmit = () => {
    updateDualMonthState(dualClarificationMonth, {
      reviewState: 'clarification-requested',
      clarificationSummary: {
        submittedAt: dualClarificationMonth === 'may' ? '5 Jun 2026, 11:20 AM' : '5 Jul 2026, 11:20 AM',
        comment: dualClarificationComment.trim(),
        attachmentName: dualClarificationAttachment,
      },
    });
    setIsClarificationOpen(false);
  };

  return (
    <>
      <ScrollArea className="flex-1 bg-slate-50">
        <div className="min-h-full px-6 pb-3 pt-4 lg:px-8">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Licence Renewals</h1>
              <p className="mt-1 text-sm text-slate-500">
                Review the current approval cycle and act before the billing cutoff.
              </p>
            </div>

            <div className="flex rounded-lg border bg-white p-1 shadow-[0_2px_10px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                onClick={() => onLicenseTabChange('current')}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${licenseTab === 'current' ? 'bg-[#eef5ff] text-[#0056c1]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Current Month
              </button>
              <button
                type="button"
                onClick={() => onLicenseTabChange('history')}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${licenseTab === 'history' ? 'bg-[#eef5ff] text-[#0056c1]' : 'text-slate-500 hover:text-slate-900'}`}
              >
                History
              </button>
            </div>
          </div>

          {licenseTab === 'history' ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {historyItems.map((item) => (
                <HistoryMonthCard
                  key={item.month}
                  month={item.month}
                  status={item.status}
                  actor={item.actor}
                  date={item.date}
                  comment={item.comment}
                  onViewLogs={() => setLogModalContext(item.timelineContext)}
                />
              ))}
            </div>
          ) : mode === 'previous' ? (
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.94fr)]">
              <div className="space-y-4">
                <CurrentStateCard
                  mode="previous"
                  reviewState={dualMonthStates.may.reviewState}
                  expanded={dualActiveMonth === 'may'}
                  approvedAt={dualMonthStates.may.approvedAt}
                  clarificationSummary={dualMonthStates.may.clarificationSummary}
                  onToggleExpanded={() => setDualActiveMonth('may')}
                  onPreview={() => openDualPreview('may')}
                  onClarification={() => openDualClarification('may')}
                  onApprove={() => handleDualApprove('may')}
                />

                <CurrentStateCard
                  mode="current"
                  reviewState={dualMonthStates.june.reviewState}
                  expanded={dualActiveMonth === 'june'}
                  approvedAt={dualMonthStates.june.approvedAt}
                  clarificationSummary={dualMonthStates.june.clarificationSummary}
                  onToggleExpanded={() => setDualActiveMonth('june')}
                  onPreview={() => openDualPreview('june')}
                  onClarification={() => openDualClarification('june')}
                  onApprove={() => handleDualApprove('june')}
                />
              </div>

              <TimelinePanel
                mode={dualActiveMonth === 'may' ? 'previous' : 'current'}
                expanded={expandedTimeline}
                onToggleExpanded={() => setExpandedTimeline((value) => !value)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.94fr)]">
              <CurrentStateCard
                mode={mode}
                reviewState={mode === 'pause' ? 'pending' : reviewState}
                expanded={isCardExpanded || mode === 'pause'}
                approvedAt={approvedAt}
                clarificationSummary={clarificationSummary}
                onToggleExpanded={() => setIsCardExpanded((value) => !value)}
                onPreview={() => openPreview('June 2026')}
                onClarification={openClarification}
                onApprove={handleApprove}
              />

              <TimelinePanel mode={mode} reviewState={mode === 'pause' ? 'pending' : reviewState} expanded={expandedTimeline} onToggleExpanded={() => setExpandedTimeline((value) => !value)} />
            </div>
          )}
        </div>
      </ScrollArea>

      <LicenseLogsDialog
        open={logModalContext !== null}
        onOpenChange={(open) => !open && setLogModalContext(null)}
        context={logModalContext}
      />

      <LicenceCountPreviewDialog
        open={isPreviewOpen}
        monthName={previewMonthName}
        reviewState={mode === 'previous' ? dualMonthStates[dualActiveMonth].reviewState : reviewState}
        clarificationSummary={mode === 'previous' ? dualMonthStates[dualActiveMonth].clarificationSummary : clarificationSummary}
        onOpenChange={setIsPreviewOpen}
        onApprove={() => {
          setIsPreviewOpen(false);
          if (mode === 'previous') {
            handleDualApprove(dualActiveMonth);
            return;
          }
          handleApprove();
        }}
        onClarification={() => {
          setIsPreviewOpen(false);
          if (mode === 'previous') {
            openDualClarification(dualActiveMonth);
            return;
          }
          openClarification();
        }}
      />

      <RequestClarificationDialog
        open={isClarificationOpen}
        onOpenChange={setIsClarificationOpen}
        comment={mode === 'previous' ? dualClarificationComment : clarificationComment}
        onCommentChange={mode === 'previous' ? setDualClarificationComment : setClarificationComment}
        attachmentName={mode === 'previous' ? dualClarificationAttachment : clarificationAttachment}
        onAttachmentChange={mode === 'previous' ? setDualClarificationAttachment : setClarificationAttachment}
        onSubmit={mode === 'previous' ? handleDualClarificationSubmit : handleClarificationSubmit}
        onCancel={() => setIsClarificationOpen(false)}
      />
    </>
  );
}
