import { useRef, useState } from 'react';
import { 
  Search, 
  Menu, 
  Grid, 
  HelpCircle,
  Headset,
  Clock,
  FileText,
  Users,
  ChevronRight,
  UserPlus,
  TrendingUp,
  History,
  UserX,
  AlertTriangle,
  LayoutPanelLeft,
  Handshake,
  Fingerprint,
  CalendarClock,
  ReceiptText,
  Landmark,
  UserMinus,
  Shield,
  Disc,
  Download,
  Paperclip,
  X,
  Settings2,
  type LucideIcon
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnnouncementMic from '@/components/AnnouncementMic';
import {
  LicenseLandingPopup,
  LicenceRenewalsPage,
  licenseHistoryItems,
  licenseModeContent,
  licensePreviewSections,
  licenseTimelineContent,
  LicenceCountPreviewDialog,
  LicenseUrgencyBanner,
} from '@/features/license-renewals/license-renewals';
import { InvoiceApprovalConfigPage } from '@/features/invoice-approval-config/invoice-approval-config';
import type {
  LicenseMode,
  LicensePreviewContext,
  LicensePopupVariant,
  LicenseTab,
  LicenseTimelineContext,
} from '@/features/license-renewals/license-renewals';
import logo from './assets/beeforce-logo.png';
import blueTreeLogo from './assets/bluetree-logo.png';

type SidebarNavItem = {
  name: string;
  icon: LucideIcon;
  id?: string;
  badge?: string;
  badgeTitle?: string;
  visible?: boolean;
};

const PREVIOUS_LICENSE_RENEWAL_MONTHS = 2;

function BlueTreeSupportComment({ supportComment }: { supportComment: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mt-3 flex items-start gap-3 rounded-lg border border-[#f0d88d] bg-[#fff4de] px-3 py-3 text-sm leading-5 text-[#8c5610]">
      <motion.div
        className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#c26f00]"
        animate={shouldReduceMotion ? undefined : { opacity: [1, 0.35, 1], scale: [1, 1.14, 1] }}
        transition={shouldReduceMotion ? undefined : { duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      >
        {!shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-md border border-[#f0a11a]"
            animate={{ opacity: [0.75, 0], scale: [1, 1.85] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <AlertTriangle size={15} />
      </motion.div>
      <div className="min-w-0 flex-1">
        <div className="font-bold text-[#8c5610]">BlueTree support comment</div>
        <div className="mt-0.5 text-[#8c5610]">{supportComment}</div>
        <div className="mt-1 text-xs font-semibold text-[#8c5610]">
          Review the workbook before approving or requesting clarification.
        </div>
      </div>
    </div>
  );
}

const licenseSidebarNavItems: SidebarNavItem[] = [
  { name: 'Onboarding', icon: Handshake },
  { name: 'Core', icon: Fingerprint },
  { name: 'Time & Attendance', icon: CalendarClock },
  { name: 'Payout', icon: ReceiptText },
  {
    name: 'Licence Renewals',
    icon: FileText,
    id: 'licence-renewals',
  },
  {
    name: 'Licence Renewals (2)',
    icon: FileText,
    id: 'licence-renewals-2',
    badgeTitle: `${PREVIOUS_LICENSE_RENEWAL_MONTHS} previous months pending`,
  },
  { name: 'Auto Approval', icon: FileText, id: 'licence-renewals-auto-approval' },
  { name: 'Service Pause', icon: AlertTriangle, id: 'licence-renewals-service-pause' },
  { name: 'Invoice Approval Config', icon: Settings2, id: 'invoice-approval-config' },
  { name: 'Compliance', icon: Landmark },
  { name: 'Offboarding', icon: UserMinus },
  { name: 'Help Desk', icon: Headset },
];

const getSidebarNavKey = (item: SidebarNavItem) => item.id ?? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');


interface WorkforceInsightsData {
  headcount: {
    totalWorkforce: { value: string; change: string; direction: string; color: string };
    activeApproved: { value: string; change: string };
    onHoldPending: { value: string; change: string; direction: string; color: string };
    exitedMonth: { value: string; change: string; direction: string; color: string; percentChange?: string };
    onboardedMonth: { value: string; change: string; direction: string; color: string; percentChange?: string };
  };
  exitBreakdown: {
    totalExits: number;
    attritionRate: string;
    categories: Array<{ name: string; count: number; color: string; dotColor: string }>;
  };
  onboardingBreakdown: {
    totalOnboarding: number;
    completionRate: string;
    categories: Array<{ name: string; count: number; icon: 'check' | 'users' | 'cancel' }>;
  };
  pulse: {
    present: { value: string; label: string; subValue: string };
    absent: { value: string; label: string; subValue: string };
    leave: { value: string; label: string; subValue: string };
    compliance: { value: string; label: string; subValue: string };
    joining: { value: string; label: string; subValue: string };
    regularization: { value: string; label: string; subValue: string };
    payroll: { value: string; label: string; subValue: string };
  };
  overtime: Array<{ name: string; role: string; hours: string; text: string }>;
}

const WORKFORCE_INSIGHTS_DATA: Record<'all' | 'hosur' | 'nashik', Record<'this-month' | 'last-month', WorkforceInsightsData>> = {
  all: {
    'this-month': {
      headcount: {
        totalWorkforce: { value: "22,342", change: "+184 vs last month", direction: "up", color: "green" },
        activeApproved: { value: "20,892", change: "93.5% of total" },
        onHoldPending: { value: "847", change: "+62 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "21,491", change: "+1,086 vs last month", percentChange: "+5.3%", direction: "up", color: "red" },
        onboardedMonth: { value: "4,736", change: "+124 vs last month", percentChange: "+2.7%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 21491,
        attritionRate: "2.7%",
        categories: [
          { name: "Direct Termination", count: 96, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 11, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 2710, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 15961, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 2538, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 175, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 4736,
        completionRate: "95.1%",
        categories: [
          { name: "Total", count: 4736, icon: "check" },
          { name: "Mobile Pending", count: 102, icon: "users" },
          { name: "Vendor Pending", count: 16, icon: "users" },
          { name: "Client Confirmation Pending", count: 5, icon: "users" },
          { name: "Safety Pending", count: 37, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 4502, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 3, icon: "check" },
          { name: "Rejected", count: 70, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "89.2%", label: "Present today", subValue: "18,640 Present" },
        absent: { value: "6.8%", label: "Absent today", subValue: "1,420 Absent" },
        leave: { value: "4.0%", label: "On leave", subValue: "832 On leave" },
        compliance: { value: "0.17%", label: "Compliance breach", subValue: "38 Breaches" },
        joining: { value: "0.55%", label: "Joining this week", subValue: "124 Joining" },
        regularization: { value: "1.40%", label: "Regularization pending", subValue: "312 Pending" },
        payroll: { value: "4 Days", label: "Payroll closes", subValue: "Closes soon" }
      },
      overtime: [
        { name: "Ramesh Kumar", role: "Plant - Hosur", hours: "62 hrs", text: "this month" },
        { name: "Priya Nair", role: "Plant - Nashik", hours: "58 hrs", text: "this month" },
        { name: "Suresh Babu", role: "HO - Bangalore", hours: "54 hrs", text: "this month" },
        { name: "Amit Patel", role: "Plant - Hosur", hours: "48 hrs", text: "this month" },
        { name: "Kiran Rao", role: "Plant - Nashik", hours: "42 hrs", text: "this month" },
        { name: "Meena Pillai", role: "Plant - Hosur", hours: "38 hrs", text: "this month" },
        { name: "Vikram Singh", role: "Plant - Nashik", hours: "35 hrs", text: "this month" }
      ]
    },
    'last-month': {
      headcount: {
        totalWorkforce: { value: "22,158", change: "+142 vs prev month", direction: "up", color: "green" },
        activeApproved: { value: "20,706", change: "93.4% of total" },
        onHoldPending: { value: "890", change: "+45 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "20,405", change: "+980 vs prev month", percentChange: "+5.0%", direction: "up", color: "red" },
        onboardedMonth: { value: "4,500", change: "+110 vs prev month", percentChange: "+2.5%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 20405,
        attritionRate: "2.5%",
        categories: [
          { name: "Direct Termination", count: 90, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 10, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 2570, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 15160, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 2410, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 165, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 4500,
        completionRate: "95.1%",
        categories: [
          { name: "Total", count: 4500, icon: "check" },
          { name: "Mobile Pending", count: 98, icon: "users" },
          { name: "Vendor Pending", count: 15, icon: "users" },
          { name: "Client Confirmation Pending", count: 5, icon: "users" },
          { name: "Safety Pending", count: 35, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 4280, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 3, icon: "check" },
          { name: "Rejected", count: 64, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "88.7%", label: "Present avg", subValue: "18,420 Present" },
        absent: { value: "7.1%", label: "Absent avg", subValue: "1,470 Absent" },
        leave: { value: "4.2%", label: "On leave avg", subValue: "880 On leave" },
        compliance: { value: "0.20%", label: "Compliance breach", subValue: "45 Breaches" },
        joining: { value: "0.52%", label: "Joined last week", subValue: "115 Joined" },
        regularization: { value: "1.26%", label: "Regularization processed", subValue: "280 Processed" },
        payroll: { value: "Closed", label: "Payroll closed", subValue: "Closed on 5th" }
      },
      overtime: [
        { name: "Ramesh Kumar", role: "Plant - Hosur", hours: "58 hrs", text: "last month" },
        { name: "Priya Nair", role: "Plant - Nashik", hours: "52 hrs", text: "last month" },
        { name: "Suresh Babu", role: "HO - Bangalore", hours: "50 hrs", text: "last month" },
        { name: "Amit Patel", role: "Plant - Hosur", hours: "45 hrs", text: "last month" },
        { name: "Kiran Rao", role: "Plant - Nashik", hours: "40 hrs", text: "last month" }
      ]
    }
  },
  hosur: {
    'this-month': {
      headcount: {
        totalWorkforce: { value: "1,840", change: "+22 vs last month", direction: "up", color: "green" },
        activeApproved: { value: "1,612", change: "87.6% of total" },
        onHoldPending: { value: "147", change: "+12 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "1,791", change: "+93 vs last month", percentChange: "+5.5%", direction: "up", color: "red" },
        onboardedMonth: { value: "395", change: "+20 vs last month", percentChange: "+5.3%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 1791,
        attritionRate: "4.4%",
        categories: [
          { name: "Direct Termination", count: 8, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 1, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 226, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 1330, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 211, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 15, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 395,
        completionRate: "95.4%",
        categories: [
          { name: "Total", count: 395, icon: "check" },
          { name: "Mobile Pending", count: 8, icon: "users" },
          { name: "Vendor Pending", count: 1, icon: "users" },
          { name: "Client Confirmation Pending", count: 0, icon: "users" },
          { name: "Safety Pending", count: 3, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 377, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 0, icon: "check" },
          { name: "Rejected", count: 6, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "91.6%", label: "Present today", subValue: "1,612 Present" },
        absent: { value: "5.4%", label: "Absent today", subValue: "95 Absent" },
        leave: { value: "3.0%", label: "On leave", subValue: "53 On leave" },
        compliance: { value: "0.82%", label: "Compliance breach", subValue: "15 Breaches" },
        joining: { value: "0.65%", label: "Joining this week", subValue: "12 Joining" },
        regularization: { value: "2.45%", label: "Regularization pending", subValue: "45 Pending" },
        payroll: { value: "4 Days", label: "Payroll closes", subValue: "Closes soon" }
      },
      overtime: [
        { name: "Ramesh Kumar", role: "Plant - Hosur", hours: "62 hrs", text: "this month" },
        { name: "Amit Patel", role: "Plant - Hosur", hours: "48 hrs", text: "this month" },
        { name: "Meena Pillai", role: "Plant - Hosur", hours: "38 hrs", text: "this month" },
        { name: "Rajesh Verma", role: "Plant - Hosur", hours: "32 hrs", text: "this month" },
        { name: "Sanjay Dutt", role: "Plant - Hosur", hours: "28 hrs", text: "this month" }
      ]
    },
    'last-month': {
      headcount: {
        totalWorkforce: { value: "1,818", change: "+15 vs prev month", direction: "up", color: "green" },
        activeApproved: { value: "1,595", change: "87.7% of total" },
        onHoldPending: { value: "142", change: "+8 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "1,698", change: "+85 vs prev month", percentChange: "+5.3%", direction: "up", color: "red" },
        onboardedMonth: { value: "375", change: "+15 vs prev month", percentChange: "+4.2%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 1698,
        attritionRate: "4.0%",
        categories: [
          { name: "Direct Termination", count: 8, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 1, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 215, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 1260, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 200, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 14, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 375,
        completionRate: "95.2%",
        categories: [
          { name: "Total", count: 375, icon: "check" },
          { name: "Mobile Pending", count: 8, icon: "users" },
          { name: "Vendor Pending", count: 1, icon: "users" },
          { name: "Client Confirmation Pending", count: 0, icon: "users" },
          { name: "Safety Pending", count: 3, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 357, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 0, icon: "check" },
          { name: "Rejected", count: 6, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "91.4%", label: "Present avg", subValue: "1,595 Present" },
        absent: { value: "5.6%", label: "Absent avg", subValue: "98 Absent" },
        leave: { value: "3.0%", label: "On leave avg", subValue: "52 On leave" },
        compliance: { value: "0.99%", label: "Compliance breach", subValue: "18 Breaches" },
        joining: { value: "0.55%", label: "Joined last week", subValue: "10 Joined" },
        regularization: { value: "2.20%", label: "Regularization processed", subValue: "40 Processed" },
        payroll: { value: "Payroll", label: "Closed on 5th", subValue: "Closed" }
      },
      overtime: [
        { name: "Ramesh Kumar", role: "Plant - Hosur", hours: "58 hrs", text: "last month" },
        { name: "Amit Patel", role: "Plant - Hosur", hours: "45 hrs", text: "last month" },
        { name: "Meena Pillai", role: "Plant - Hosur", hours: "35 hrs", text: "last month" }
      ]
    }
  },
  nashik: {
    'this-month': {
      headcount: {
        totalWorkforce: { value: "1,520", change: "+15 vs last month", direction: "up", color: "green" },
        activeApproved: { value: "1,350", change: "88.8% of total" },
        onHoldPending: { value: "110", change: "+9 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "1,433", change: "+73 vs last month", percentChange: "+5.4%", direction: "up", color: "red" },
        onboardedMonth: { value: "315", change: "+15 vs last month", percentChange: "+5.0%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 1433,
        attritionRate: "3.9%",
        categories: [
          { name: "Direct Termination", count: 6, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 1, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 181, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 1064, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 169, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 12, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 315,
        completionRate: "95.2%",
        categories: [
          { name: "Total", count: 315, icon: "check" },
          { name: "Mobile Pending", count: 7, icon: "users" },
          { name: "Vendor Pending", count: 1, icon: "users" },
          { name: "Client Confirmation Pending", count: 0, icon: "users" },
          { name: "Safety Pending", count: 2, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 300, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 0, icon: "check" },
          { name: "Rejected", count: 5, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "92.5%", label: "Present today", subValue: "1,350 Present" },
        absent: { value: "4.5%", label: "Absent today", subValue: "66 Absent" },
        leave: { value: "3.0%", label: "On leave", subValue: "44 On leave" },
        compliance: { value: "0.53%", label: "Compliance breach", subValue: "8 Breaches" },
        joining: { value: "0.66%", label: "Joining this week", subValue: "10 Joining" },
        regularization: { value: "2.11%", label: "Regularization pending", subValue: "32 Pending" },
        payroll: { value: "4 Days", label: "Payroll closes", subValue: "Closes soon" }
      },
      overtime: [
        { name: "Priya Nair", role: "Plant - Nashik", hours: "58 hrs", text: "this month" },
        { name: "Kiran Rao", role: "Plant - Nashik", hours: "42 hrs", text: "this month" },
        { name: "Vikram Singh", role: "Plant - Nashik", hours: "35 hrs", text: "this month" },
        { name: "Sunil K", role: "Plant - Nashik", hours: "30 hrs", text: "this month" },
        { name: "Anita K", role: "Plant - Nashik", hours: "25 hrs", text: "this month" }
      ]
    },
    'last-month': {
      headcount: {
        totalWorkforce: { value: "1,505", change: "+12 vs prev month", direction: "up", color: "green" },
        activeApproved: { value: "1,340", change: "89.0% of total" },
        onHoldPending: { value: "105", change: "+6 this week", direction: "up", color: "orange" },
        exitedMonth: { value: "1,360", change: "+68 vs prev month", percentChange: "+5.3%", direction: "up", color: "red" },
        onboardedMonth: { value: "300", change: "+12 vs prev month", percentChange: "+4.2%", direction: "up", color: "green" }
      },
      exitBreakdown: {
        totalExits: 1360,
        attritionRate: "3.6%",
        categories: [
          { name: "Direct Termination", count: 6, color: "bg-[#e05638]", dotColor: "bg-[#e05638]" },
          { name: "Demise", count: 1, color: "bg-[#64748b]", dotColor: "bg-[#64748b]" },
          { name: "Resignation", count: 172, color: "bg-[#f59e0b]", dotColor: "bg-[#f59e0b]" },
          { name: "Absconding", count: 1010, color: "bg-[#3b82f6]", dotColor: "bg-[#3b82f6]" },
          { name: "Contract Management", count: 160, color: "bg-[#6366f1]", dotColor: "bg-[#6366f1]" },
          { name: "Termination", count: 11, color: "bg-[#ec4899]", dotColor: "bg-[#ec4899]" }
        ]
      },
      onboardingBreakdown: {
        totalOnboarding: 300,
        completionRate: "95.3%",
        categories: [
          { name: "Total", count: 300, icon: "check" },
          { name: "Mobile Pending", count: 6, icon: "users" },
          { name: "Vendor Pending", count: 1, icon: "users" },
          { name: "Client Confirmation Pending", count: 0, icon: "users" },
          { name: "Safety Pending", count: 2, icon: "users" },
          { name: "Onboarded", count: 0, icon: "check" },
          { name: "Approved", count: 286, icon: "check" },
          { name: "Onboarding Failed", count: 0, icon: "check" },
          { name: "Verification Failed", count: 0, icon: "check" },
          { name: "Rejected", count: 5, icon: "cancel" }
        ]
      },
      pulse: {
        present: { value: "92.1%", label: "Present avg", subValue: "1,340 Present" },
        absent: { value: "4.7%", label: "Absent avg", subValue: "69 Absent" },
        leave: { value: "3.2%", label: "On leave avg", subValue: "46 On leave" },
        compliance: { value: "0.66%", label: "Compliance breach", subValue: "10 Breaches" },
        joining: { value: "0.53%", label: "Joined last week", subValue: "8 Joined" },
        regularization: { value: "1.86%", label: "Regularization processed", subValue: "28 Processed" },
        payroll: { value: "Closed", label: "Payroll closed", subValue: "Closed" }
      },
      overtime: [
        { name: "Priya Nair", role: "Plant - Nashik", hours: "52 hrs", text: "last month" },
        { name: "Kiran Rao", role: "Plant - Nashik", hours: "40 hrs", text: "last month" },
        { name: "Vikram Singh", role: "Plant - Nashik", hours: "30 hrs", text: "last month" }
      ]
    }
  }
};



const needsAttentionDetails: Record<number, any> = {
  1: {
    title: 'Regularization Approval',
    typeLabel: 'Type: Missed Punch',
    link: '#attendance-regularization',
    rows: [
      { id: 'ATSFL00069', name: 'SHANMATHI S S', start: '09-06-2026 08:35 AM', end: '09-06-2026 05:58 PM', age: '8 hours' },
      { id: 'ATSFL00078', name: 'Ragul S S', start: '08-06-2026 08:32 AM', end: '08-06-2026 05:40 PM', age: 'a day' },
      { id: 'ATSFL00070', name: 'Anand Kumar Verma', start: '08-06-2026 08:32 AM', end: '08-06-2026 05:40 PM', age: '2 days', typeLabel: 'Type: On Duty' },
      { id: 'ATSFL00047', name: 'Aryan Chaurasiya', start: '07-06-2026 08:32 AM', end: '07-06-2026 05:40 PM', age: '2 days', typeLabel: 'Type: On Duty' },
      { id: 'ATSFL00072', name: 'Sanjeeb Kumar Dhara', start: '06-06-2026 08:15 AM', end: '06-06-2026 06:39 PM', age: '3 days', typeLabel: 'Type: Missed Punch' }
    ]
  },
  2: {
    title: 'Time-off Approval',
    typeLabel: 'Type: Sick Leave',
    link: '#time-off',
    rows: [
      { id: 'EMP00123', name: 'John Doe', start: '10-06-2026 09:00 AM', end: '12-06-2026 06:00 PM', age: '2 hours' },
      { id: 'EMP00124', name: 'Jane Smith', start: '15-06-2026 09:00 AM', end: '16-06-2026 06:00 PM', age: '5 hours', typeLabel: 'Type: Casual Leave' },
      { id: 'EMP00125', name: 'Robert Johnson', start: '20-06-2026 09:00 AM', end: '25-06-2026 06:00 PM', age: '1 day', typeLabel: 'Type: Earned Leave' }
    ]
  },
  3: {
    title: 'Overtime Approval',
    typeLabel: 'Type: Overtime',
    link: '#overtime',
    rows: [
      { id: 'EMP00126', name: 'Emily Davis', start: '01-06-2026 09:00 AM', end: '07-06-2026 06:00 PM', age: '1 day' },
      { id: 'EMP00127', name: 'Michael Wilson', start: '01-06-2026 09:00 AM', end: '07-06-2026 06:00 PM', age: '2 days' }
    ]
  },
  4: {
    title: 'Onboarding Task',
    typeLabel: 'Type: IT Setup',
    link: '#onboarding',
    rows: [
      { id: 'NEW00001', name: 'Sarah Brown', start: '15-06-2026 09:00 AM', end: '- -', age: '3 days' },
      { id: 'NEW00002', name: 'David Miller', start: '20-06-2026 09:00 AM', end: '- -', age: '5 days', typeLabel: 'Type: Background Check' }
    ]
  },
  5: {
    title: 'Compliance Sign-off',
    typeLabel: 'Type: Policy Acknowledgment',
    link: '#compliance',
    rows: [
      { id: 'EMP00128', name: 'James Taylor', start: '01-01-2026 09:00 AM', end: '31-01-2026 06:00 PM', age: '10 days' },
      { id: 'EMP00129', name: 'Linda Anderson', start: '01-01-2026 09:00 AM', end: '31-01-2026 06:00 PM', age: '12 days', typeLabel: 'Type: POSH Training' }
    ]
  }
};

const dashboard2NeedsAttention = [
  {
    id: 1,
    title: 'Attendance regularization',
    subtitle: 'Payroll Impact',
    module: 'Time & Attendance',
    subtitleIcon: <Users size={14} className="text-slate-400" />,
    count: 8,
    color: 'red',
    icon: <CalendarClock size={18} className="text-blue-700" />,
    iconBg: 'bg-blue-50'
  },
  {
    id: 2,
    title: 'Time-off requests',
    subtitle: 'Awaiting Approval',
    module: 'Core',
    subtitleIcon: <Users size={14} className="text-slate-400" />,
    count: 5,
    color: 'orange',
    icon: <Fingerprint size={18} className="text-blue-700" />,
    iconBg: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'Overtime approvals',
    subtitle: 'Required for Salary Processing',
    module: 'Payout',
    subtitleIcon: <AlertTriangle size={14} className="text-amber-500" />,
    count: 12,
    color: 'blue',
    icon: <ReceiptText size={18} className="text-blue-700" />,
    iconBg: 'bg-blue-50'
  },
  {
    id: 4,
    title: 'Onboarding tasks',
    subtitle: 'New Joiners Waiting',
    module: 'Onboarding',
    subtitleIcon: <Disc size={14} className="text-purple-500" />,
    count: 3,
    color: 'purple',
    icon: <Handshake size={18} className="text-blue-700" />,
    iconBg: 'bg-blue-50'
  },
  {
    id: 5,
    title: 'Compliance sign-offs',
    subtitle: 'Action Required for Compliance',
    module: 'Compliance',
    subtitleIcon: <Shield size={14} className="text-slate-400" />,
    count: 6,
    color: 'red',
    icon: <Landmark size={18} className="text-blue-700" />,
    iconBg: 'bg-blue-50'
  }
];

const getLicenseMode = (activeNav: string): LicenseMode => {
  if (activeNav === 'licence-renewals-auto-approval') return 'auto';
  if (activeNav === 'licence-renewals-service-pause') return 'pause';
  if (activeNav === 'licence-renewals-2') return 'previous';
  return 'current';
};

export default function App() {
  const [activeNav, setActiveNav] = useState('licence-renewals');
  const [bannerApproved, setBannerApproved] = useState(false);
  const [selectedNeedsAttention, setSelectedNeedsAttention] = useState<number | null>(null);
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [correctionComment, setCorrectionComment] = useState('');
  const [correctionAttachment, setCorrectionAttachment] = useState<string | null>(null);
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContext, setPreviewContext] = useState<LicensePreviewContext>('current');
  const [licensePopupVariant, setLicensePopupVariant] = useState<LicensePopupVariant | null>(null);
  const [licenseTab, setLicenseTab] = useState<LicenseTab>('current');
  const [isPreviousMonthOpen, setIsPreviousMonthOpen] = useState(false);
  const [showFullTimeline, setShowFullTimeline] = useState(false);
  const [logsPanelContext, setLogsPanelContext] = useState<'current' | 'previous'>('current');
  const [logModalContext, setLogModalContext] = useState<Exclude<LicenseTimelineContext, 'current'> | null>(null);
  
  // Workforce Insights filters
  const [locationFilter, setLocationFilter] = useState<'all' | 'hosur' | 'nashik'>('all');
  const [timeframeFilter, setTimeframeFilter] = useState<'this-month' | 'last-month'>('this-month');
  
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('All');
  const correctionAttachmentInputRef = useRef<HTMLInputElement>(null);
  const licenseMode = getLicenseMode(activeNav);
  const isLicenseNav = activeNav.startsWith('licence-renewals') || activeNav === 'invoice-approval-config';
  const licenseContent = licenseModeContent[licenseMode];
  const logsPanelContent = logsPanelContext === 'previous'
    ? licenseTimelineContent.previous
    : { title: 'June 2026 Logs', timeline: licenseContent.timeline };
  const logModalContent = logModalContext ? licenseTimelineContent[logModalContext] : null;
  const historyItems = licenseHistoryItems;
  const previewContent = {
    monthName: previewContext === 'previous' ? 'May 2026' : 'June 2026',
    monthLabel: previewContext === 'previous' ? 'May-26' : 'Jun-26',
    supportComment:
      previewContext === 'previous'
        ? 'We reconciled the May licence report. CORE changed to 17,501 after adding May joiners and excluding exited employees. API service counts are based on billable usage from 1-31 May 2026.'
        : 'We reconciled the June licence report. CORE changed to 17,501 after adding June joiners and excluding exited employees. API service counts are based on billable usage from 1-30 Jun 2026.',
    helperText:
      previewContext === 'previous'
        ? 'This preview is for the unresolved May 2026 approval. Download the workbook for employee-level and API-service detail before approving or requesting a correction.'
        : 'Preview shows summary counts only. Download the workbook for employee-level and API-service detail before requesting a correction.',
  };
  const licensePreviewRows = [
    { month: previewContent.monthLabel, label: 'CORE', count: '17,501', section: 'core' },
    ...licensePreviewSections[0].rows.map((row, index) => ({
      month: index === 0 ? previewContent.monthLabel : '',
      label: row.module,
      count: row.count,
      section: 'api',
    })),
  ];

  const openPreview = (context: LicensePreviewContext = 'current') => {
    setPreviewContext(context);
    setIsPreviewOpen(true);
  };

  const openCorrection = () => {
    setCorrectionSubmitted(false);
    setCorrectionComment('');
    setCorrectionAttachment(null);
    setIsCorrectionOpen(true);
  };

  const openLicenseRenewal2Screen = (expandMayCard: boolean) => {
    setLicensePopupVariant(null);
    setActiveNav('licence-renewals-2');
    setLicenseTab('current');
    setIsPreviousMonthOpen(expandMayCard);
    setLogsPanelContext(expandMayCard ? 'previous' : 'current');
    setShowFullTimeline(false);
  };

  const openDashboardTwo = () => {
    setActiveNav('dashboard2');
    setLicensePopupVariant('previous');
  };

  const openDashboard = () => {
    setActiveNav('dashboard');
    setLicensePopupVariant('current');
  };

  const togglePreviousMonth = () => {
    const nextOpen = !isPreviousMonthOpen;
    setIsPreviousMonthOpen(nextOpen);
    setLogsPanelContext(nextOpen ? 'previous' : 'current');
    setShowFullTimeline(false);
  };

  if (isLicenseNav) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <aside className="hidden w-64 flex-col border-r bg-white md:flex">
          <div className="flex h-16 w-full items-center justify-center border-b px-4">
            <img src={logo} alt="BeeForce" className="h-auto w-40 object-contain" />
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openDashboard();
              }}
              className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors ${activeNav === 'dashboard' ? 'bg-blue-50 text-brand' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutPanelLeft size={20} className={activeNav === 'dashboard' ? 'text-brand' : 'text-slate-400'} />
              Dashboard
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openDashboardTwo();
              }}
              className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors ${activeNav === 'dashboard2' ? 'bg-blue-50 text-brand' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutPanelLeft size={20} className={activeNav === 'dashboard2' ? 'text-brand' : 'text-slate-400'} />
              Dashboard 2
            </a>
            {licenseSidebarNavItems.map((item) => {
              const navKey = getSidebarNavKey(item);
              return (
                <a
                  href="#"
                  key={item.name}
                  title={item.badgeTitle}
                  onClick={(e) => {
                    e.preventDefault();
                    if (navKey === 'licence-renewals-2') {
                      openLicenseRenewal2Screen(false);
                      return;
                    }
                    if (navKey === 'licence-renewals') {
                      setLicenseTab('current');
                    }
                    setActiveNav(navKey);
                  }}
                  className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                    activeNav === navKey
                      ? 'bg-blue-50 text-brand'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      size={20}
                      className={
                        activeNav === navKey
                          ? 'text-brand'
                          : 'text-slate-400'
                      }
                    />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span
                        title={item.badgeTitle}
                        className="inline-flex min-w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500"
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className={`opacity-70 ${activeNav === navKey ? 'text-brand' : 'text-slate-300'}`}
                  />
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="relative flex h-screen flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between bg-brand px-4 text-white lg:px-8">
            <div className="flex flex-1 items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80 md:hidden">
                <Menu />
              </Button>
              <div className="relative hidden w-full max-w-md md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Smart Search"
                  className="w-full rounded-md border border-white/20 bg-white/10 py-1.5 pl-10 pr-4 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden gap-2 text-white hover:bg-brand/80 sm:flex">
                <Grid size={18} />
                APPS
              </Button>
              <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                  <HelpCircle size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                  <Headset size={20} />
                </Button>
                <div className="ml-2 flex items-center gap-3 border-l border-white/20 pl-4">
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-medium">John Doue</div>
                    <div className="text-xs text-white/70">jdoe@acme.com</div>
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          {activeNav === 'invoice-approval-config' ? (
            <InvoiceApprovalConfigPage />
          ) : (
            <LicenceRenewalsPage
              key={bannerApproved ? 'approved' : 'pending'}
              mode={licenseMode}
              licenseTab={licenseTab}
              initialReviewState={bannerApproved ? 'approved' : 'pending'}
              onLicenseTabChange={setLicenseTab}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="h-16 border-b flex items-center justify-center px-4 w-full">
          <img src={logo} alt="BeeForce" className="w-40 h-auto object-contain" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" onClick={(e) => { e.preventDefault(); openDashboard(); }} className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${activeNav === 'dashboard' ? 'text-brand bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutPanelLeft size={20} className={activeNav === 'dashboard' ? 'text-brand' : 'text-slate-400'} />
            Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); openDashboardTwo(); }} className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${activeNav === 'dashboard2' ? 'text-brand bg-blue-50' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutPanelLeft size={20} className={activeNav === 'dashboard2' ? 'text-brand' : 'text-slate-400'} />
            Dashboard 2
          </a>
          {licenseSidebarNavItems.map((item) => {
            const navKey = getSidebarNavKey(item);
            return (
              <a
                href="#"
                key={item.name}
                title={item.badgeTitle}
                onClick={(e) => {
                  e.preventDefault();
                  if (navKey === 'licence-renewals-2') {
                    openLicenseRenewal2Screen(false);
                    return;
                  }
                  if (navKey === 'licence-renewals') {
                    setLicenseTab('current');
                  }
                  setActiveNav(navKey);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-md group transition-colors ${
                  activeNav === navKey
                    ? 'text-brand bg-blue-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={20}
                    className={
                      activeNav === navKey
                        ? 'text-brand'
                        : 'text-slate-400 group-hover:text-slate-500'
                    }
                  />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      title={item.badgeTitle}
                      className="inline-flex min-w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <ChevronRight
                  size={16}
                  className={`opacity-70 group-hover:opacity-100 ${
                    activeNav === navKey
                      ? 'text-brand'
                      : 'text-slate-300'
                  }`}
                />
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {isLicenseNav ? (
          <>
            <header className="h-16 bg-brand text-white flex items-center justify-between px-4 lg:px-8 shrink-0">
              <div className="flex items-center gap-4 flex-1">
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-brand/80">
                  <Menu />
                </Button>
                <div className="relative w-full max-w-md hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
                  <input
                    type="text"
                    placeholder="Smart Search"
                    className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-1.5 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-white hover:bg-brand/80 hidden sm:flex gap-2">
                  <Grid size={18} />
                  APPS
                </Button>
                <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                    <HelpCircle size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                    <Headset size={20} />
                  </Button>
                  <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium">John Doue</div>
                      <div className="text-xs text-white/70">jdoe@acme.com</div>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-white/20">
                      <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </header>
            <ScrollArea className="flex-1 bg-slate-50">
              <div className="px-6 py-5 lg:px-8">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Licence Renewals</h1>
                    <p className="mt-1 text-sm text-slate-500">
                      {licenseTab === 'history'
                        ? 'Review past licence count approvals and download previous reports.'
                        : 'Review the current approval cycle and act before the billing cutoff.'}
                    </p>
                  </div>
                  <div className="flex rounded-lg border bg-white p-1 shadow-sm">
                    <button
                      onClick={() => setLicenseTab('current')}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${licenseTab === 'current' ? 'bg-blue-50 text-brand' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Current Month
                    </button>
                    <button
                      onClick={() => setLicenseTab('history')}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${licenseTab === 'history' ? 'bg-blue-50 text-brand' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      History
                    </button>
                  </div>
                </div>

                {licenseTab === 'history' ? (
                  <div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      {historyItems.map((item) => (
                        <Card key={item.month} className="border-slate-200 bg-white shadow-md">
                          <CardContent className="p-5">
                            <div>
                              <div className="text-lg font-bold text-slate-900">{item.month}</div>
                              <span className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">{item.status}</span>
                            </div>
                            <div className="mt-5 space-y-2 text-sm">
                              <div className="font-semibold text-slate-700">{item.actor}</div>
                              <div className="text-slate-500">{item.date} · {item.comment}</div>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                              <Button variant="outline" className="flex-1 gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Download size={16} />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={() => setLogModalContext(item.timelineContext)}
                              >
                                <History size={16} />
                                View logs
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
                    <div className="space-y-4">
                      <Card className="border-amber-200 bg-white shadow-sm">
                        <button
                          onClick={togglePreviousMonth}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <div>
                            <div className="text-sm font-bold text-slate-900">May 2026 licence approval is still pending</div>
                            <div className="mt-1 text-xs text-slate-500">Previous cycle is still open. Review logs if you need to understand what happened before acting.</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Pending</span>
                            <ChevronRight size={18} className={`text-slate-400 transition-transform ${isPreviousMonthOpen ? 'rotate-90' : ''}`} />
                          </div>
                        </button>
                        {isPreviousMonthOpen && (
                          <div className="border-t bg-amber-50/50 px-5 py-4">
                            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Cutoff missed</div>
                                <div className="font-bold text-slate-800">5 Jun 2026</div>
                              </div>
                              <div>
                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Current status</div>
                                <div className="font-bold text-amber-700">Awaiting customer action</div>
                              </div>
                            </div>
                            <div className="mt-5 flex flex-wrap gap-2">
                              <Button size="sm" className="bg-green-700 hover:bg-green-800">Approve</Button>
                              <Button size="sm" variant="outline" onClick={openCorrection}>Request Correction</Button>
                              <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => openPreview('previous')}>Preview</Button>
                              <Button size="sm" variant="outline" className="gap-1.5">
                                <Download size={15} />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>

                      <Card className="border-slate-200 bg-white shadow-md">
                        <CardHeader
                          className="border-b bg-slate-50/60 px-5 py-4"
                          onClick={() => {
                            setIsPreviousMonthOpen(false);
                            setLogsPanelContext('current');
                          }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-600">
                                <AlertTriangle size={14} />
                                {licenseMode === 'current' ? 'Action required' : licenseContent.status}
                              </div>
                              <CardTitle className="mt-1 text-xl font-bold text-slate-900">{licenseContent.title}</CardTitle>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${licenseContent.badgeClass}`}>{licenseContent.status}</span>
                          </div>
                        </CardHeader>
                        {!isPreviousMonthOpen && (
                          <CardContent className="p-5">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Report generated</div>
                                <div className="mt-1 text-sm font-bold text-slate-800">30 Jun 2026, 2:15 PM</div>
                              </div>
                              <div className="rounded-lg bg-slate-50 p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Approval window</div>
                                <div className="mt-1 text-sm font-bold text-slate-800">1 Jul - 5 Jul 2026</div>
                              </div>
                              <div className="rounded-lg bg-red-50 p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wide text-red-400">{licenseMode === 'current' ? 'Days remaining' : 'Cutoff status'}</div>
                                <div className="mt-1 text-sm font-bold text-red-700">{licenseMode === 'current' ? '3 days' : 'Cutoff missed'}</div>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <Button className={licenseMode === 'pause' ? 'bg-red-950 hover:bg-red-900' : 'bg-green-700 hover:bg-green-800'}>
                                {licenseContent.primaryAction}
                              </Button>
                              <Button variant="outline" className="font-semibold" onClick={openCorrection}>
                                {licenseMode === 'auto' ? 'Request Exception' : 'Request Correction'}
                              </Button>
                              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => openPreview('current')}>Preview</Button>
                              <Button variant="outline" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                                <Download size={16} />
                                Download
                              </Button>
                              {licenseMode === 'pause' && <Button variant="outline" className="font-semibold">Contact Support</Button>}
                            </div>

                            <div className="mt-5 border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                              {licenseContent.warning}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </div>

                    <Card className="border-slate-200 bg-white shadow-md">
                      <CardHeader className="border-b bg-slate-50/60 px-5 py-4">
                        <CardTitle className="text-lg font-bold uppercase tracking-wide text-slate-800">{logsPanelContent.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          {(showFullTimeline ? logsPanelContent.timeline : logsPanelContent.timeline.slice(0, 4)).map((event, index) => (
                            <div key={`${event.time}-${event.title}`} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <span className={`mt-1 h-3 w-3 rounded-full ${
                                  event.tone === 'red' ? 'bg-red-500' : event.tone === 'amber' ? 'bg-amber-500' : event.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-300'
                                }`} />
                                {index < logsPanelContent.timeline.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
                              </div>
                              <div className="pb-2">
                                <div className="text-xs font-semibold text-slate-400">{event.time}</div>
                                <div className={`text-sm font-bold ${event.tone === 'red' ? 'text-red-700' : event.tone === 'amber' ? 'text-amber-700' : event.tone === 'blue' ? 'text-blue-700' : 'text-slate-700'}`}>{event.title}</div>
                                <div className="text-xs text-slate-500">{event.detail}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowFullTimeline(!showFullTimeline)}>
                          {showFullTimeline ? 'Show less' : 'Show full timeline'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <>
        {/* Topbar */}
        <header className="h-16 bg-brand text-white flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-brand/80">
              <Menu />
            </Button>
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
              <input 
                type="text" 
                placeholder="Smart Search" 
                className="w-full bg-white/10 border border-white/20 rounded-md pl-10 pr-4 py-1.5 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:bg-brand/80 hidden sm:flex gap-2">
              <Grid size={18} />
              APPS
            </Button>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                <HelpCircle size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-brand/80">
                <Headset size={20} />
              </Button>
              <div className="flex items-center gap-3 ml-2 border-l border-white/20 pl-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">John Doue</div>
                  <div className="text-xs text-white/70">jdoe@acme.com</div>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white/20">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        <LicenseUrgencyBanner
          mode="current"
          onReview={() => setActiveNav('licence-renewals')}
          onApprove={() => { setBannerApproved(true); setActiveNav('licence-renewals'); }}
        />

        {/* Dashboard Content */}
        <ScrollArea className="flex-1">
          <div className="py-4 px-14 lg:py-6 lg:px-16 min-h-full overflow-visible">
            <div className={`grid grid-cols-1 ${activeNav === 'dashboard2' ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-3 pb-12 relative w-full`}>
            
            {/* Announcement Expandable Widget */}
            <AnnouncementMic />

            {/* Left Column (Main) */}
            <div className={`${activeNav === 'dashboard2' ? 'xl:col-span-1 order-last' : 'xl:col-span-2 order-first'} relative min-w-0`}>

              <div className="space-y-3">
                {/* Workforce Insights */}
                <Card className="border-slate-200 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3 bg-slate-50/50 rounded-t-xl border-b space-y-0">
                  <CardTitle className="text-xl font-bold text-slate-800">Workforce insights</CardTitle>
                  <div className="flex gap-2">
                    <select 
                      value={locationFilter} 
                      onChange={(e) => setLocationFilter(e.target.value as any)}
                      className="text-xs border rounded-md px-2.5 py-1.5 bg-white text-slate-600 outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                    >
                      <option value="all">All locations</option>
                      <option value="hosur">Plant – Hosur</option>
                      <option value="nashik">Plant – Nashik</option>
                    </select>
                    <select 
                      value={timeframeFilter} 
                      onChange={(e) => setTimeframeFilter(e.target.value as any)}
                      className="text-xs border rounded-md px-2.5 py-1.5 bg-white text-slate-600 outline-none focus:ring-1 focus:ring-slate-400 font-medium"
                    >
                      <option value="this-month">This month</option>
                      <option value="last-month">Last month</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="space-y-6">
                    {/* Headcount Snapshot */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">HEADCOUNT SNAPSHOT</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Active & Approved */}
                        <div className="group relative bg-[#fcfbf9] border border-slate-100 rounded-lg p-3 shadow-sm cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-2xl font-bold text-green-700 tracking-tight">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.activeApproved.value}</span>
                              <span className="text-xs text-slate-500 font-medium block mt-0.5">Active</span>
                            </div>
                          </div>
                          {/* Tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-lg">
                            {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.activeApproved.change}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                          </div>
                        </div>
                        {/* Onboarded this month */}
                        <div className="group relative bg-[#fcfbf9] border border-slate-100 rounded-lg p-3 shadow-sm cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-2xl font-bold text-slate-800 tracking-tight">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.onboardedMonth.value}</span>
                              <span className="text-xs text-slate-500 font-medium block mt-0.5">Onboarded {timeframeFilter === 'this-month' ? 'this month' : 'last month'}</span>
                            </div>
                            {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.onboardedMonth.percentChange && (
                              <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 mt-1">
                                <TrendingUp size={10} /> {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.onboardedMonth.percentChange}
                              </div>
                            )}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-lg">
                            {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.onboardedMonth.change}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                          </div>
                        </div>
                        {/* Exited this Month */}
                        <div className="group relative bg-[#fcfbf9] border border-slate-100 rounded-lg p-3 shadow-sm cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-2xl font-bold text-red-700 tracking-tight">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.exitedMonth.value}</span>
                              <span className="text-xs text-slate-500 font-medium block mt-0.5">Exited this month</span>
                            </div>
                            {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.exitedMonth.percentChange && (
                              <div className="flex items-center gap-0.5 bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 mt-1">
                                <TrendingUp size={10} /> {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.exitedMonth.percentChange}
                              </div>
                            )}
                          </div>
                          {/* Tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-800 text-white text-[10px] font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-lg">
                            {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].headcount.exitedMonth.change}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Today's Pulse */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">TODAY'S PULSE</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                        {/* Present Today */}
                        <div className="flex items-center gap-2.5 bg-[#fcfbf9] border border-slate-100 rounded-lg p-2.5 shadow-sm group relative overflow-hidden h-[56px]">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#ebf5ff] text-[#003a8c]">
                            <Users size={16} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 h-full justify-center relative overflow-hidden">
                            <span className="text-base font-bold text-slate-800 leading-none">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.present.value}</span>
                            <div className="relative h-3.5 mt-0.5 overflow-hidden w-full">
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-400 font-semibold leading-tight transition-all duration-300 transform group-hover:-translate-y-full group-hover:opacity-0 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.present.label}
                              </span>
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-500 font-bold leading-tight transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.present.subValue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Absent */}
                        <div className="flex items-center gap-2.5 bg-[#fcfbf9] border border-slate-100 rounded-lg p-2.5 shadow-sm group relative overflow-hidden h-[56px]">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#fffbe6] text-[#d48806]">
                            <UserX size={16} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 h-full justify-center relative overflow-hidden">
                            <span className="text-base font-bold text-slate-800 leading-none">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.absent.value}</span>
                            <div className="relative h-3.5 mt-0.5 overflow-hidden w-full">
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-400 font-semibold leading-tight transition-all duration-300 transform group-hover:-translate-y-full group-hover:opacity-0 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.absent.label}
                              </span>
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-500 font-bold leading-tight transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.absent.subValue}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* On Leave */}
                        <div className="flex items-center gap-2.5 bg-[#fcfbf9] border border-slate-100 rounded-lg p-2.5 shadow-sm group relative overflow-hidden h-[56px]">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#fff1f0] text-[#cf1322]">
                            <UserMinus size={16} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 h-full justify-center relative overflow-hidden">
                            <span className="text-base font-bold text-slate-800 leading-none">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.leave.value}</span>
                            <div className="relative h-3.5 mt-0.5 overflow-hidden w-full">
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-400 font-semibold leading-tight transition-all duration-300 transform group-hover:-translate-y-full group-hover:opacity-0 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.leave.label}
                              </span>
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-500 font-bold leading-tight transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.leave.subValue}
                              </span>
                            </div>
                          </div>
                        </div>


                        {/* Regularization Pending */}
                        <div className="flex items-center gap-2.5 bg-[#fcfbf9] border border-slate-100 rounded-lg p-2.5 shadow-sm group relative overflow-hidden h-[56px]">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#fdf8f5] text-[#d4380d]">
                            <History size={16} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 h-full justify-center relative overflow-hidden">
                            <span className="text-base font-bold text-slate-800 leading-none">{WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.regularization.value}</span>
                            <div className="relative h-3.5 mt-0.5 overflow-hidden w-full">
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-400 font-semibold leading-tight transition-all duration-300 transform group-hover:-translate-y-full group-hover:opacity-0 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.regularization.label}
                              </span>
                              <span className="absolute inset-x-0 top-0 text-[10px] text-slate-500 font-bold leading-tight transition-all duration-300 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 truncate">
                                {WORKFORCE_INSIGHTS_DATA[locationFilter][timeframeFilter].pulse.regularization.subValue}
                              </span>
                            </div>
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links Card */}
              <Card className="border-slate-200 shadow-md bg-white">
                <CardContent className="p-5">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">QUICK LINKS</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Employee Directory', icon: <Users size={14} className="text-[#003a8c]" />, bg: 'bg-[#ebf5ff]' },
                        { label: 'Leave Approvals', icon: <CalendarClock size={14} className="text-[#d4380d]" />, bg: 'bg-[#fdf8f5]' },
                        { label: 'Attendance Regularization', icon: <Clock size={14} className="text-[#0958d9]" />, bg: 'bg-[#e6f4ff]' },
                        { label: 'Payroll Processing', icon: <ReceiptText size={14} className="text-[#1d39c4]" />, bg: 'bg-[#f0f5ff]' },
                        { label: 'Onboarding Status', icon: <UserPlus size={14} className="text-[#08979c]" />, bg: 'bg-[#e6fffb]' },
                        { label: 'Compliance Reports', icon: <FileText size={14} className="text-[#cf1322]" />, bg: 'bg-[#fff1f0]' },
                      ].map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 bg-[#fcfbf9] border border-slate-100 hover:border-slate-300 rounded-lg cursor-pointer transition-all shadow-sm group hover:shadow-md">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${link.bg} shadow-sm group-hover:scale-105 transition-transform`}>
                            {link.icon}
                          </div>
                          <span className="text-xs font-semibold text-slate-700 leading-tight pr-1 group-hover:text-slate-900 transition-colors flex-1">{link.label}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all mr-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>


              </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className={`space-y-3 ${activeNav === 'dashboard2' ? 'order-first' : 'order-last'} min-w-0`}>

              {/* BlueTree Logo Card */}
              <Card className="border-slate-200 shadow-md flex items-center justify-center p-6 bg-white">
                <img src={blueTreeLogo} alt="BlueTree" className="h-14 md:h-16 w-auto object-contain" />
              </Card>

              {/* Actions Section (Updated) */}
              <Card className="border-brand/20 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3 bg-slate-50/50 rounded-t-xl border-b space-y-0">
                  <CardTitle className="text-lg font-bold text-slate-800">Needs Attention</CardTitle>
                  <div className="flex items-center gap-1.5 p-1 bg-white border shadow-sm rounded-full w-fit">
                    {[
                      { id: 'All', icon: <Grid size={14} />, tooltip: 'All Modules' },
                      { id: 'Core', icon: <Fingerprint size={14} />, tooltip: 'Core' },
                      { id: 'Time & Attendance', icon: <CalendarClock size={14} />, tooltip: 'Time & Attendance' },
                      { id: 'Onboarding', icon: <Handshake size={14} />, tooltip: 'Onboarding' },
                      { id: 'Compliance', icon: <Landmark size={14} />, tooltip: 'Compliance' },
                      { id: 'Payout', icon: <ReceiptText size={14} />, tooltip: 'Payout' },
                      { id: 'Offboarding', icon: <UserMinus size={14} />, tooltip: 'Offboarding' },
                      { id: 'Grievances', icon: <Headset size={14} />, tooltip: 'Grievances (Help Desk)' }
                    ].map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => setSelectedModuleFilter(mod.id)}
                        className={`group relative w-7 h-7 rounded-full flex items-center justify-center transition-all ${selectedModuleFilter === mod.id ? 'bg-[#0056c1] text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                      >
                        {mod.icon}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-sm opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50">
                              {mod.tooltip}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col">
                      {(() => {
                        const filtered = dashboard2NeedsAttention.filter(item => selectedModuleFilter === 'All' || item.module === selectedModuleFilter);
                        if (filtered.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-b">
                              <p className="text-sm font-medium text-slate-600">All caught up!</p>
                              <p className="text-xs text-slate-400 mt-1">No pending items for this module.</p>
                            </div>
                          );
                        }
                        return filtered.map(item => (
                        <div key={item.id} onClick={() => setSelectedNeedsAttention(item.id)} className="flex items-center justify-between p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                              {item.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                              <div className="flex items-center mt-1">
                                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                  {
                                    red: 'text-red-700 bg-red-50',
                                    orange: 'text-amber-700 bg-amber-50',
                                    blue: 'text-blue-700 bg-blue-50',
                                    purple: 'text-purple-700 bg-purple-50'
                                  }[item.color as string] || 'text-slate-600 bg-slate-50'
                                }`}>
                                  {item.subtitle}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded text-blue-700 bg-blue-100">
                              {item.count} pending
                            </span>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
                          </div>
                        </div>
                        ));
                      })()}
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
          </>
        )}
      </main>

      <LicenseLandingPopup
        open={licensePopupVariant !== null && !isLicenseNav}
        variant={licensePopupVariant ?? 'current'}
        onOpenChange={(open) => {
          if (!open) {
            setLicensePopupVariant(null);
          }
        }}
        onReview={() => {
          if (licensePopupVariant === 'current') {
            setLicensePopupVariant(null);
            setActiveNav('licence-renewals');
            setLicenseTab('current');
            return;
          }
          openLicenseRenewal2Screen(true);
        }}
        onRequestClarification={() => {
          setLicensePopupVariant(null);
          openCorrection();
        }}
        onPreview={() => {
          setLicensePopupVariant(null);
          openPreview('current');
        }}
        onReviewAll={() => openLicenseRenewal2Screen(true)}
      />

      <Dialog open={logModalContext !== null} onOpenChange={(open) => !open && setLogModalContext(null)}>
        <DialogContent className="max-w-xl rounded-xl border-none bg-white p-0 shadow-2xl">
          <DialogHeader className="border-b px-6 py-5 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <History size={20} className="text-blue-700" />
              {logModalContent?.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Month-specific approval log with the back-and-forth for this cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5">
            <div className="space-y-4">
              {logModalContent?.timeline.map((event, index) => (
                <div key={`${event.time}-${event.title}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 h-3 w-3 rounded-full ${
                      event.tone === 'red' ? 'bg-red-500' : event.tone === 'amber' ? 'bg-amber-500' : event.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-300'
                    }`} />
                    {logModalContent && index < logModalContent.timeline.length - 1 && <span className="mt-1 h-full w-px bg-slate-200" />}
                  </div>
                  <div className="pb-2">
                    <div className="text-xs font-semibold text-slate-400">{event.time}</div>
                    <div className={`text-sm font-bold ${event.tone === 'red' ? 'text-red-700' : event.tone === 'amber' ? 'text-amber-700' : event.tone === 'blue' ? 'text-blue-700' : 'text-slate-700'}`}>{event.title}</div>
                    <div className="text-xs text-slate-500">{event.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <Button variant="outline" onClick={() => setLogModalContext(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LicenceCountPreviewDialog
        open={isPreviewOpen}
        monthName={previewContent.monthName}
        reviewState="pending"
        onOpenChange={setIsPreviewOpen}
        onApprove={() => setIsPreviewOpen(false)}
        onClarification={() => { setIsPreviewOpen(false); openCorrection(); }}
      />

      <Dialog open={selectedNeedsAttention !== null} onOpenChange={(open) => !open && setSelectedNeedsAttention(null)}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden border-none shadow-2xl bg-white rounded-xl">
          {selectedNeedsAttention !== null && needsAttentionDetails[selectedNeedsAttention] && (() => {
            const detail = needsAttentionDetails[selectedNeedsAttention];
            return (
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800">{detail.title} List</h2>
                  </div>
                  <a href={detail.link} className="text-sm font-semibold text-[#0052cc] hover:underline flex items-center gap-1" onClick={() => setSelectedNeedsAttention(null)}>
                    Go to {detail.title} <ChevronRight size={14} />
                  </a>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#0052cc] text-white">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Task Name</th>
                        <th className="px-6 py-4 font-semibold">Employee ID</th>
                        <th className="px-6 py-4 font-semibold">Employee Name</th>
                        <th className="px-6 py-4 font-semibold">Start Date</th>
                        <th className="px-6 py-4 font-semibold">End Date</th>
                        <th className="px-6 py-4 font-semibold">Ageing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detail.rows.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors bg-white">
                          <td className="px-6 py-4">
                            <div className="font-bold text-[#0052cc]">{detail.title}</div>
                            <div className="text-slate-500 text-xs italic mt-0.5">{row.typeLabel || detail.typeLabel}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{row.id}</td>
                          <td className="px-6 py-4 text-slate-600">{row.name}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                            {row.start.split(' ').map((p: string, idx: number) => <div key={idx}>{p}</div>)}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                            {row.end.split(' ').map((p: string, idx: number) => <div key={idx}>{p}</div>)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{row.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={isCorrectionOpen} onOpenChange={setIsCorrectionOpen}>
        <DialogContent className="max-w-xl rounded-xl border-none bg-white p-0 shadow-2xl">
          <DialogHeader className="border-b px-6 py-5 text-left">
            <DialogTitle className="text-xl font-bold text-slate-900">Request Correction</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Tell BlueTree what needs to be corrected and why before this approval can proceed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            {correctionSubmitted ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
                Correction request captured. Status will move to Awaiting BlueTree response.
              </div>
            ) : (
              <>
                <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Use the downloaded report to mention employee IDs, API services, or count mismatch details. A reason is required so the support team can review the correction.
                </div>

                <label className="block">
                  <span className="text-sm font-bold text-slate-800">What needs correction and why?</span>
                  <textarea
                    value={correctionComment}
                    onChange={(e) => setCorrectionComment(e.target.value)}
                    placeholder="Example: Emp 10432 was terminated on 15 Jun and should be excluded. Expected count: 17,500."
                    className="mt-2 min-h-32 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <input
                  ref={correctionAttachmentInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setCorrectionAttachment(file ? file.name : null);
                  }}
                />

                {correctionAttachment ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      <Paperclip size={13} />
                      {correctionAttachment}
                      <button
                        type="button"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-700 transition-colors hover:bg-blue-100"
                        onClick={() => setCorrectionAttachment(null)}
                      >
                        <X size={12} />
                        <span className="sr-only">Remove attachment</span>
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 gap-2 border-blue-600 px-3 text-blue-700 hover:bg-blue-50"
                      onClick={() => correctionAttachmentInputRef.current?.click()}
                    >
                      <Paperclip size={15} />
                      Replace attachment
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 gap-2 border-blue-600 px-3 text-blue-700 hover:bg-blue-50"
                    onClick={() => correctionAttachmentInputRef.current?.click()}
                  >
                    <Paperclip size={15} />
                    Add Attachment
                  </Button>
                )}

              </>
            )}
          </div>

          <DialogFooter className="border-t px-6 py-4">
            {correctionSubmitted ? (
              <Button onClick={() => setIsCorrectionOpen(false)}>Close</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsCorrectionOpen(false)}>Cancel</Button>
                <Button
                  disabled={correctionComment.trim().length === 0}
                  className="bg-[#0056c1] hover:bg-[#004899] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setCorrectionSubmitted(true)}
                >
                  Request Correction
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
