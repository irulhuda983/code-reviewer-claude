import { Command } from "commander";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ora from "ora";
import { getCommitReviewClaude } from "../services/ai-reviewer";

const buildAIReview = async ({ model, diff }: any) => {
  const review = await getCommitReviewClaude({
    model,
    diff,
  });

  return review;
};

export const unstagedReviewCommand = new Command("unstaged-review")
  .description("Run AI review on staged changes (git diff)")
  .option("-o, --output <name>", "Output folder name", "unstaged-review")
  .option("-m, --model <name>", "Model name", "")
  .action(async (options) => {
    const spinner = ora("Reading diff file...").start();
    try {
      console.log("Collecting staged diff...");

      const diff = execSync("git diff", {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      }).toString();

      if (!diff.trim()) {
        console.log("No staged changes detected.");
        process.exit(0);
      }

      // Optional: Skip large diff to control cost
      if (diff.length > 50000) {
        console.log("Diff too large. Skipping AI review.");
        process.exit(0);
      }

      console.log("Running AI review...");
      // TODO: kirim diff ke Claude
      const fileName = `unstaged-review-${Date.now()}.md`;
      spinner.text = "Sending diff to AI for review...";
      const markdownContent = await buildAIReview({ model: options.model, diff: diff });

      // ====== USE FOLDER FROM PARAM OR DEFAULT ======
      const reviewDir = path.join(process.cwd(), options.output);

      if (!fs.existsSync(reviewDir)) {
        fs.mkdirSync(reviewDir);
      }

      const filePath = path.join(reviewDir, fileName);

      fs.writeFileSync(filePath, markdownContent);

      spinner.succeed("Review generated successfully!");

      console.log("\n📁 Saved to:");
      console.log(filePath);
      process.exit(0);
    } catch (error) {
      console.error("AI review failed.");
      console.error(error);
      process.exit(1);
    }
  });
