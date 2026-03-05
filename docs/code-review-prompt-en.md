### Background Information

- **Project Name**: [ai-training-partner / ai-training-partner-admin]
- **Tech Stack**: Next.js + React + TypeScript + shadcn [fill in other technologies based on the actual project, such as React Query]
- **Target Branch**: `develop` (or the actual MR target branch)
- **Source Branch**: [to be filled in]
- **Review Scope**: **Limited only to the changes introduced in this MR**
- **The list of changed files represents the complete review scope of this MR**

> **Note**: This Prompt applies to both `ai-training-partner` (Static Export) and `ai-training-partner-admin` (SSR) projects. Review standards may need to be adjusted according to the actual architecture.

### Review Instructions

- **Only review** the newly added or modified code in this MR
- **Do not comment on** unchanged existing code or legacy logic
- **Do not suggest** refactors beyond the scope of this MR unless there is a clear bug or regression risk
- **Focus on** the actual changes and their impact in this MR

### 📋 Checklist Usage Guide

Please conduct the review in the following order:

1. **Level 1: Core Checks (Mandatory)**
   - Use the “**AI Code Review Core Checklist**” from [Code Review Checklist](./code-review-checklist.md)
   - Check each item under 🔴 Critical Issues, 🟡 Important Issues, 🟢 Suggested Improvements
   - This core checklist already covers all key items, including basic checks, security, error handling, etc.

2. **Level 2: Deep Inspection (When Issues Are Found)**
   - When a specific issue is found, refer to the detailed sections of the checklist
   - Obtain more complete explanations and code examples

3. **Level 3: Risk Assessment (Special Focus)**
   - Refer to the “Common Risks and Error Patterns” section
   - Identify potential security risks, logic errors, and collaboration issues

---

## Review Focus

> **Please use the “AI Code Review Core Checklist” from [Code Review Checklist](./code-review-checklist.md) for the review**

### 📋 Review Criteria

Please refer to the “**AI Code Review Core Checklist**” in [Code Review Checklist](./code-review-checklist.md), which includes:

- 🔴 **Critical Issues (Must Fix)**: Security, error handling, type safety
- 🟡 **Important Issues (Should Fix)**: Code quality, React best practices, data flow management
- 🟢 **Suggested Improvements (Optional)**: Architecture design, performance optimization, user experience, testing
- 📋 **MR Quality Check**: MR Description, screenshots/videos, CI/CD, Review Comments

**Important Reminders**:

- ✅ Refer to the checklist document for **the complete set of review items to avoid missing any**
- ✅ When issues are found, refer to the detailed checklist sections (Chapters 1–10) for more guidance
- ✅ Pay special attention to the high-risk issues listed in the “Common Risks and Error Patterns” section

---

## Special Attention Items

> **Please refer to the “Common Risks and Error Patterns” section in [Code Review Checklist](./code-review-checklist.md)**

### 🚨 High-Risk Issues Quick Reference

The following are common high-risk issues mentioned in the checklist. Please pay special attention to them during the review:

#### 🔴 Security Risks

- Storing sensitive tokens in localStorage
- Using dangerouslySetInnerHTML without sanitization
- Environment variables not validated or exposed on the client side

#### 🔴 System Stability Risks

- Infinite loops in useEffect
- Unhandled Promise rejections
- Memory leaks (subscriptions without cleanup)

#### 🟡 User Experience Risks

- API calls missing loading/error/empty state handling
- Incomplete form validation or unfriendly error messages
- No prevention of duplicate submissions caused by repeated clicks

#### 🟡 Development Convention Risks

- API already integrated but still using mock data (should be removed)
- Mock data not labeled or not identifiable (except for pure UI MRs)
- Connecting to local environments or APIs not yet deployed (causing environment mismatch)
- API endpoints inconsistent with the target environment

#### 🟡 Performance Risks

- Unnecessary re-renders (missing memo/callback usage)
- Unoptimized images or oversized bundles
- React Query race conditions or incorrect caching strategies

**For complete risk explanations and solutions, please refer to the checklist document**

---

## Output Format

> **Please use [Code Review Report Template](./code-review-report-template.md) as the report format template**

### 📊 Report Structure

The report should include the following main sections (refer to the Template document for detailed formatting):

#### 1. **Basic Information**

MR number, title, author, reviewer, date, tech stack, impact scope

#### 2. **AI Core Checklist Summary** ⭐ Key Section

Based on the “AI Code Review Core Checklist” results:

- Present each checklist item’s result in a table (✅ Pass / ❌ Fail / ⚠️ Partial)
- Categorize by severity (🔴 Critical Issues, 🟡 Important Issues, 🟢 Suggested Improvements)
- Mark which checklist items are N/A (not applicable to this MR)

#### 3. **Issue List**

Categorized by severity (🔴 Critical Issues, 🟡 Important Issues, 🟢 Suggested Improvements):

- Issue title
- File path and line number
- Issue description and impact scope
- Suggested fix (including code examples of incorrect vs. recommended implementations)

#### 4. **Detailed Review Results** (Optional, depending on MR complexity)

If the MR involves multiple domains, detailed review results (Chapters 1–10) may be included.

#### 5. **Summary and Recommendations**

- Overall evaluation (code quality, architecture design, security, test coverage)
- Key strengths
- Areas for improvement
- Review recommendation (Approve / Approve with Comments / Request Changes / Needs Discussion)
- Follow-up action items

### 📝 Output Key Reminders

- ✅ **“AI Core Checklist Summary” is a mandatory section**, ensure all core checklist items are covered
- ✅ Issue lists should provide concrete code examples (incorrect vs. recommended)
- ✅ Maintain a constructive tone, highlighting strengths while pointing out issues
- ✅ Recommendations should be actionable and not overly abstract
- ✅ Focus only on MR changes; do not comment on unchanged existing code

---

## AI Review Execution Flow

Please conduct the review in the following order:

### Step 1: Read the Review Criteria

1. Open [code-review-checklist.md](./code-review-checklist.md)
2. Familiarize yourself with all items in the “**AI Code Review Core Checklist**” (🔴🟡🟢📋)
3. Refer to the “Common Risks and Error Patterns” section

### Step 2: Analyze MR Changes

1. Review all changed files in the MR diff
2. Identify the impact scope of the changes (features, components, pages)
3. Determine which review categories apply (architecture, security, performance, etc.)

### Step 3: Perform the Review

1. Sequentially check the core checklist (🔴 Critical → 🟡 Important → 🟢 Suggested → 📋 MR Quality)
2. When issues are found, refer to the detailed checklist sections (Chapters 1–10) for further guidance
3. Record the result of each checklist item (✅ Pass / ❌ Fail / ⚠️ Partial / N/A Not Applicable)

### Step 4: Produce the Report

1. Use [code-review-report-template.md](./code-review-report-template.md) as the output format
2. Fill in the “**AI Core Checklist Summary**” table (mandatory)
3. List all identified issues by severity
4. Provide concrete fix suggestions with code examples
5. Highlight the strengths of the MR
6. Give a clear review recommendation (Approve / Request Changes, etc.)

---

## Review Principles

### ✅ What You Should Do

- **Constructive**: Provide concrete improvement suggestions, not just point out problems
- **Comprehensive**: Check each core checklist item to avoid omissions
- **Precise**: Focus only on MR changes, do not comment on unchanged code
- **Practical**: Suggestions should be actionable and include code examples

### ❌ What You Should Not Do

- ❌ Do not summarize the entire system (focus only on MR changes)
- ❌ Do not rewrite large sections of code (only provide key fixes)
- ❌ Do not suggest refactors beyond the MR scope (unless there is a clear bug or regression risk)
- ❌ Do not comment on unchanged existing code
- ❌ Do not overly nitpick style issues (if linting has passed)
- ❌ Do not miss any core checklist items

### 📝 Review Language

- Write the review report in **Traditional Chinese**
- Use English for code examples and technical terms
- Use actual file paths

---

## Reference Resources

You may refer to the following documents during the review:

- [Code Review Checklist](./code-review-checklist.md) - Complete checklist
- [Code Review Report Template](./code-review-report-template.md) - Report template
- [Development Workflow](./development-workflow.md) - Development process guide
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/query-functions)

---
