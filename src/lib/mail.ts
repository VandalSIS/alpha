/**
 * Email layer — Project Alpha (aligned with Project-Alpha-Emails.docx + open-with-code flow).
 * Set RESEND_API_KEY to send for real. EMAIL_OVERRIDE redirects every message for testing.
 */

type Mail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function appUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function publicEntryUrl() {
  return (
    process.env.NEXT_PUBLIC_ENTRY_URL ||
    "https://www.christianandtimbers.com/apply-for-ai-board-opportunities#enter"
  );
}

function workbookEnterUrl() {
  return appUrl("/enter");
}

function signatory() {
  return process.env.EMAIL_SIGNATORY || "Project Alpha team";
}

function questionsEmail() {
  return process.env.EMAIL_QUESTIONS || "projectalpha@christian-timbers.com";
}

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

function toHtml(text: string): string {
  const esc = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withLinks = esc.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
  return `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#141414">${withLinks
    .split(/\n\n+/)
    .map((p) => `<p style="margin:0 0 1em">${p.replace(/\n/g, "<br>")}</p>`)
    .join("")}</div>`;
}

export async function sendMail(mail: Mail): Promise<void> {
  const from = process.env.EMAIL_FROM || "Project Alpha <projectalpha@christian-timbers.com>";
  const replyTo = process.env.EMAIL_REPLY_TO || questionsEmail();
  const override = process.env.EMAIL_OVERRIDE?.trim();
  const to = override || mail.to;
  const subject =
    override && override.toLowerCase() !== mail.to.toLowerCase()
      ? `[TEST → ${mail.to}] ${mail.subject}`
      : mail.subject;
  const html = mail.html || toHtml(mail.text);

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: replyTo,
        subject,
        text: mail.text,
        html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Email failed: ${res.status} ${body}`);
    }
    return;
  }

  console.log("\n========== EMAIL (stub — set RESEND_API_KEY to send) ==========");
  console.log("From:", from);
  console.log("To:", to, override ? `(override from ${mail.to})` : "");
  console.log("Subject:", subject);
  console.log(mail.text);
  console.log("================================================================\n");
}

/** 1. Invitation — when admin issues a code */
export async function sendInviteEmail(opts: {
  name: string;
  email: string;
  code: string;
  entryUrl?: string;
}) {
  const first = firstName(opts.name);
  const entry = opts.entryUrl || publicEntryUrl();
  const direct = workbookEnterUrl();
  await sendMail({
    to: opts.email,
    subject: "Project Alpha: your invitation",
    text: `Dear ${first},

You have been invited to take part in Project Alpha, a curated Christian & Timbers initiative for executives considering a first, early, or strategically significant board appointment.

The programme begins with a confidential Board Aspiration and Readiness Workbook. Your answers inform a private strategy review and the development of your board materials. The workbook takes approximately 45 to 60 minutes, and your answers save as you go.

Your invitation code: ${opts.code}

Begin here: ${entry}

Or open the workbook directly: ${direct}

Enter the code and this email address to open your workbook. You may return with the same code whenever you need. The invitation is valid for 30 days.

Questions: ${questionsEmail()}

${signatory()}
Christian & Timbers`,
  });
}

/** 2. Sign-in link — kept for optional flows / legacy */
export async function sendSignInLinkEmail(opts: {
  name: string;
  email: string;
  signInUrl: string;
}) {
  const first = firstName(opts.name);
  await sendMail({
    to: opts.email,
    subject: "Your Project Alpha sign-in link",
    text: `Dear ${first},

Open your workbook here: ${opts.signInUrl}

You can also enter anytime with your invitation code at ${publicEntryUrl()}.

If you did not request this, ignore this message or write to ${questionsEmail()}.`,
  });
}

/** 3. Saved progress — Save and continue later */
export async function sendResumeLinkEmail(opts: {
  name: string;
  email: string;
  resumeUrl: string;
}) {
  const first = firstName(opts.name);
  await sendMail({
    to: opts.email,
    subject: "Your Project Alpha workbook is saved",
    text: `Dear ${first},

Your answers are saved. Continue from where you stopped: ${opts.resumeUrl}

The link works for 30 days. You can also return anytime with your invitation code at ${workbookEnterUrl()}.

Nothing is submitted until you complete the final step.`,
  });
}

/** 4. Confirmation of submission */
export async function sendSubmissionConfirm(opts: {
  name: string;
  email: string;
  reference: string;
}) {
  const first = firstName(opts.name);
  await sendMail({
    to: opts.email,
    subject: "Project Alpha: workbook received",
    text: `Dear ${first},

Thank you. Your Board Aspiration and Readiness Workbook has been received.

Reference: ${opts.reference}

The Project Alpha team will review your responses and contact you within five business days to arrange your confidential strategy review.

Your responses and documents are held securely and accessible only to the Project Alpha team. Privacy questions: ${questionsEmail()}

${signatory()}
Christian & Timbers`,
  });
}

/** 5. Internal notification */
export async function sendSubmissionNotify(opts: {
  name: string;
  email: string;
  reference: string;
  adminUrl: string;
  title?: string;
  organisation?: string;
  submittedAt?: Date;
  fileCount?: number;
  consultant?: string;
}) {
  const to = process.env.NOTIFY_TO || "projectalpha@christian-timbers.com";
  const cc = process.env.NOTIFY_CC?.trim();
  const when = (opts.submittedAt || new Date()).toISOString();
  const participantLine = [opts.name, opts.title, opts.organisation].filter(Boolean).join(", ");

  const text = `Participant: ${participantLine || opts.name}
Email: ${opts.email}
Reference: ${opts.reference}
Submitted: ${when}
Assigned consultant: ${opts.consultant || process.env.ASSIGNED_CONSULTANT || "—"}
Documents attached: ${opts.fileCount ?? 0}

Open the record: ${opts.adminUrl}`;

  await sendMail({
    to,
    subject: `Project Alpha submission: ${opts.name}`,
    text,
  });

  if (cc && cc.toLowerCase() !== to.toLowerCase()) {
    await sendMail({
      to: cc,
      subject: `Project Alpha submission: ${opts.name}`,
      text,
    });
  }
}

export { appUrl, publicEntryUrl, workbookEnterUrl };
