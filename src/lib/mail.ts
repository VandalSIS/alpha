/**
 * Email layer — matches Project-Alpha-Emails.docx.
 * Set RESEND_API_KEY to send for real.
 * EMAIL_OVERRIDE redirects every message (for testing).
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

function signatory() {
  return process.env.EMAIL_SIGNATORY || "Project Alpha team";
}

function questionsEmail() {
  return process.env.EMAIL_QUESTIONS || "hello@christian-timbers.com";
}

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

export async function sendMail(mail: Mail): Promise<void> {
  const from = process.env.EMAIL_FROM || "Project Alpha <hello@christian-timbers.com>";
  const override = process.env.EMAIL_OVERRIDE?.trim();
  const to = override || mail.to;
  const subject = override && override !== mail.to ? `[TEST → ${mail.to}] ${mail.subject}` : mail.subject;

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
        subject,
        text: mail.text,
        html: mail.html || undefined,
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
  await sendMail({
    to: opts.email,
    subject: "Project Alpha: your invitation",
    text: `Dear ${first},

You have been invited to take part in Project Alpha, a curated Christian & Timbers initiative for executives considering a first, early, or strategically significant board appointment.

The programme begins with a confidential Board Aspiration and Readiness Workbook. Your answers inform a private strategy review and the development of your board materials. The workbook takes approximately 45 to 60 minutes, and your answers save as you go.

Your invitation code: ${opts.code}

Begin here: ${entry}

Enter the code and this email address, and we will send you a secure sign-in link. The invitation is valid for 30 days.

Questions: ${questionsEmail()}

${signatory()}
Christian & Timbers`,
  });
}

/** 2. Sign-in link — when code + email match */
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

The link works once and expires in 60 minutes. Request another at any time from ${publicEntryUrl()}.

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

The link works for 30 days. Nothing is submitted until you complete the final step.`,
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

  // Primary inbox
  await sendMail({
    to,
    subject: `Project Alpha submission: ${opts.name}`,
    text,
  });

  // Optional CC (e.g. assigned consultant)
  if (cc && cc.toLowerCase() !== to.toLowerCase()) {
    await sendMail({
      to: cc,
      subject: `Project Alpha submission: ${opts.name}`,
      text,
    });
  }
}

export { appUrl, publicEntryUrl };
