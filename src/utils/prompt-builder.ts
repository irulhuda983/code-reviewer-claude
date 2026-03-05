import fs from "fs";
import path from "path";

// interface GetRulesParams {
//   tag: any;
//   fileName: string;
// }

// interface BuildPromptParams {
//   diff: string;
//   tag: any;
//   context?: any;
// }

export function loadMarkdown({ fileName }: any): string {
  try {
    // __dirname sekarang menunjuk ke dist/utils
    const rulesPath = path.resolve(__dirname, "..", "..", "docs", fileName);

    if (fs.existsSync(rulesPath)) {
      return fs.readFileSync(rulesPath, "utf-8");
    } else {
      throw new Error(`Rules file not found at: ${rulesPath}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to read custom rules: ${error.message}`);
    }

    throw new Error("Failed to read custom rules: unknown error");
  }
}

export function buildReviewPrompt({ diff }: any) {
  const currentDate = new Date().toISOString().split("T")[0];

  const systemPrompt = `You are performing a GitLab Merge Request frontend code review. Your goal is to review the following git diff based strictly on the provided project guidelines.

IMPORTANT:
- Your entire output MUST be in English.
- Use today's date in ISO format (YYYY-MM-DD)
  for the "Check Date" or "Inspection Date" field.

Instructions:
1. Review the code changes against the "Rapid Checklist" (快速檢核表) found in the Reference Rules.
2. Generate a Code Review Report that mirrors the structure of the "Rapid Checklist".
3. Translate all checklist items and section headers from Chinese to English for the final report.
4. For each checklist item, mark it as [ ] (unchecked/failed) or [x] (checked/passed).
5. Identify any bugs, potential issues, performance improvements, and best practices violations.
6. Please reference about the related rules for each suggestion/fix recommendation/issues
7. Be concise and constructive.

IMPORTANT:
- Reviewer Identity: Self Review and do not write anything except "Self Review" for Reviewer Identity

RULES
${loadMarkdown({ fileName: "code-review-prompt.md" })}
`;

  const messagePrompt = [
    { role: "system", content: systemPrompt, cache: true },
    {
      role: "system",
      content: `This is the Code Review Checklist ${loadMarkdown({ fileName: "code-review-checklist.md" })}`,
      cache: true,
    },
    {
      role: "system",
      content: `This is the Code Review Report Template ${loadMarkdown({ fileName: "code-review-report-template.md" })}`,
      cache: true,
    },
    // {
    //   role: "system",
    //   content: `This is the Development Workflow ${loadMarkdown({ fileName: "development-workflow.md" })}`,
    //   cache: true,
    // },
    { role: "user", content: `Here is the diff:\n\n${diff}` },
  ];

  return messagePrompt;
}

export function buildCommitPrompt({ diff }: any) {
  const prompt = loadMarkdown({ fileName: "commit-prompt.md" });

  return [
    { role: "system", content: prompt, cache: true },
    { role: "user", content: `Here is the diff:\n\n${diff}` },
    // {
    //   role: "user",
    //   content: `IMPORTANT: Your entire output MUST be in English.`,
    // },
  ];
}
