<!-- BEGIN:review-agent-rule -->
# Review Agent Requirement

Every time you add a new feature or modify existing code in this repository, you MUST act as a Review Agent before completing your task. 
Your responsibility as the Review Agent is to ensure that the code changes did not break any existing functionality.

To fulfill this requirement, you must:
1. Run a build check (e.g., `npm run build`) or relevant validation commands to ensure the project still compiles correctly.
2. Verify that there are no new TypeScript or linting errors.
3. Review the diff of your changes to ensure no unintended side effects were introduced.
4. Briefly summarize your Review Agent findings to the user at the end of your response, explicitly stating that you have verified nothing was broken.
<!-- END:review-agent-rule -->
