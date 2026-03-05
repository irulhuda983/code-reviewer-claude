# Code Review CLI

A CLI tool to generate AI-powered code review reports from your Git repository.

This tool analyzes git changes (commit, staged, or unstaged) and generates a structured code review report.

---

# Installation

Clone the repository:

```
git clone https://github.com/your-org/code-review-cli.git
cd code-review-cli
```

Install dependencies:

```
npm install
```

Build code:

```
npm run build
```

Link the CLI globally:

```
npm link
```

---

# Usage

General command:

```
code-review <command>
```

Available commands:

```
generate
commit-review
staged-review
unstaged-review
```

---

# Commands

## Generate Review Report

Generate a code review report based on repository changes.

```
code-review generate --output folder-name
```

This command will:

- Analyze git changes
- Send the diff to the AI reviewer
- Generate a structured review report

---

## Commit Review

Review a specific commit.

```
code-review commit-review --from <commit> [options]
```

### Options

| Option                | Description                                   |
| --------------------- | --------------------------------------------- |
| `-f, --from <hash>`   | Start commit hash (required)                  |
| `-t, --to <hash>`     | End commit hash (default: `HEAD`)             |
| `-o, --output <name>` | Output folder name (default: `commit-review`) |

---

### Examples

#### Review from a commit to HEAD

```bash
code-review commit-review --from a1b2c3d
```

This will review all changes from commit `a1b2c3d` to the latest commit (`HEAD`).

---

## Staged Review

Review currently staged changes.

```
code-review staged-review
```

**Options**

| Option            | Description                              | Default         |
| ----------------- | ---------------------------------------- | --------------- |
| `--output <name>` | Output folder name for the review report | `staged-review` |

This command reads:

```
git diff --staged
```

and generates a review report.

**Examples**

```bash
git add .
code-review staged-review
```

The tool will:

1. Collect staged changes
2. Send the diff to the AI reviewer
3. Generate a Markdown review report

---

## Unstaged Review

Review unstaged changes in the working directory.

**Usage**

```bash
code-review unstaged-review
```

---

**Options**

| Option            | Description                              | Default         |
| ----------------- | ---------------------------------------- | --------------- |
| `--output <name>` | Output folder name for the review report | `staged-review` |

This command reads:

```
git diff
```

and generates a review report.

---

# Example Workflow

Typical development workflow:

Stage changes:

```
git add .
```

Run AI review:

```
code-review staged-review
```

Review output will be printed in the terminal.

---

# CLI Structure

The CLI entry point:

```
#!/usr/bin/env node
```

Commands are registered using **Commander.js**:

- generate
- commit-review
- staged-review
- unstaged-review

Each command is implemented inside the `commands/` directory.

Example structure:

```
src/
 ├── commands/
 │   ├── generate.ts
 │   ├── commit-review.ts
 │   ├── staged-review.ts
 │   └── unstaged-review.ts
 │
 └── index.ts
```

---

# License

MIT

---
