import type { InviteStatus } from "@prisma/client";

export const STAGE_LABELS: Record<InviteStatus, string> = {
  INVITED: "Invitation sent",
  STARTED: "Workbook started",
  IN_PROGRESS: "Workbook in progress",
  SUBMITTED: "Workbook submitted",
  IN_REVIEW: "Under review",
  COMPLETE: "Complete",
};

export const STAGE_ORDER: InviteStatus[] = [
  "INVITED",
  "STARTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "IN_REVIEW",
  "COMPLETE",
];

/** Default next-step copy when admin has not set a custom one. */
export function defaultNextSteps(status: InviteStatus): string {
  switch (status) {
    case "INVITED":
      return "Open your Board Aspiration workbook and begin the first section when you are ready.";
    case "STARTED":
    case "IN_PROGRESS":
      return "Continue your workbook. You can save and return anytime with your invitation code.";
    case "SUBMITTED":
      return "Your workbook is with the Project Alpha team. We will follow up with next steps.";
    case "IN_REVIEW":
      return "Your materials are under review. Use Learning to work through preparation for firesides and mock boards while the team follows up.";
    case "COMPLETE":
      return "Your current workbook stage is complete. Open Learning for modules, case work, and upcoming sessions with your cohort.";
    default:
      return "Check back here for your next steps, or write to projectalpha@christian-timbers.com.";
  }
}

export function resolveNextSteps(status: InviteStatus, custom?: string | null): string {
  const trimmed = custom?.trim();
  return trimmed || defaultNextSteps(status);
}
