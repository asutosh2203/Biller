module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "chore", "docs", "style", "refactor", "perf", "test"],
    ],
    "subject-empty": [2, "never"],
    "subject-max-length": [2, "always", 72],
    "scope-empty": [2, "never"],
    "subject-case": [2, "never", ["start-case", "pascal-case"]],
  },
};
