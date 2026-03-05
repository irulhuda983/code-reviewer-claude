#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import { Command } from "commander";
import { generateCommand } from "./commands/generate";
import { commitReviewCommand } from "./commands/commit-review";
import { stagedReviewCommand } from "./commands/staged-review";
import { unstagedReviewCommand } from "./commands/unstaged-review";

const program = new Command();

program
  .name("code-review")
  .description("CLI tool for generating code review report")
  .version("1.0.0");

program.addCommand(generateCommand);
program.addCommand(commitReviewCommand);
program.addCommand(stagedReviewCommand);
program.addCommand(unstagedReviewCommand);

program.parse(process.argv);
