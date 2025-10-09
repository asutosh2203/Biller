// scripts/commit-help.js
console.log(`
🚨 Commit message invalid!
Use this format:
type(scope): short description
Example: feat(auth): add JWT login
Types: feat, fix, chore, docs, style, refactor, test, perf
`);
process.exit(1);
