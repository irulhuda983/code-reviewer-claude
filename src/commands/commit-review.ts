import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ora from "ora";
import { getCommitReviewClaude } from "../services/ai-reviewer";

const buildAIReview = async ({ diff }: any) => {
  const review = await getCommitReviewClaude({
    diff,
  });

  return review;
};

export const commitReviewCommand = new Command("commit-review")
  .description("Generate review report from commit range")
  .option("-f, --from <hash>", "Start commit hash")
  .option("-t, --to <hash>", "End commit hash (default: HEAD)")
  .option("-0, --output <name>", "Output folder name", "commit-review")
  .action(async (options) => {
    const spinner = ora("Reading diff file...").start();
    try {
      const from = options.from;
      const to = options.to || "HEAD";

      if (!from) {
        console.error("Error: --from <hash> is required");
        process.exit(1);
      }

      console.log(`Generating diff from ${from} to ${to}...\n`);

      // 🔥 ambil diff range
      const diff = execSync(`git diff ${from} ${to}`, {
        maxBuffer: 1024 * 1024 * 20, // 20MB buffer biar aman
      }).toString();

      if (!diff.trim()) {
        console.log("No differences found.");
        return;
      }

      // TODO: kirim diff ke Claude
      const fileName = `commit-review-${Date.now()}.md`;
      spinner.text = "Sending diff to AI for review...";
      const markdownContent = await buildAIReview({ diff: diff });

      // ====== USE FOLDER FROM PARAM OR DEFAULT ======
      const reviewDir = path.join(process.cwd(), options.output);

      if (!fs.existsSync(reviewDir)) {
        fs.mkdirSync(reviewDir);
      }

      const filePath = path.join(reviewDir, fileName);

      fs.writeFileSync(filePath, markdownContent);

      spinner.succeed("Review generated successfully!");
      process.exit(0);
    } catch (error) {
      console.error("Failed to generate commit range diff.");
      console.error(error);
      process.exit(1);
    }
  });
