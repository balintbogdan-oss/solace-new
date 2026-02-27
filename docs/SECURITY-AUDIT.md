# Open Source Security Risks (npm audit)

Last run: based on `npm audit` in this repo. **15 vulnerabilities** (1 moderate, 14 high).

---

## 1. Next.js (high) – **fixable without breaking**

- **Versions affected:** 10.0.0 – 15.5.9 (your version is in this range)
- **Issues:**
  - **GHSA-9g9p-9gw9-jx7f** – DoS via Image Optimizer `remotePatterns` configuration
  - **GHSA-h25m-26qc-wcjf** – HTTP request deserialization can lead to DoS with insecure React Server Components
- **Action:** Run `npm audit fix` to bump Next.js to a patched version (no breaking change expected).

---

## 2. minimatch (high) – ReDoS

- **Advisory:** [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26)
- **Issue:** ReDoS via repeated wildcards with non-matching literal in pattern.
- **Where it comes from:** ESLint chain: `@eslint/config-array`, `@typescript-eslint/typescript-estree`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react` all depend on vulnerable `minimatch`.
- **Fix:** Would require `npm audit fix --force`, which upgrades to **eslint@10.0.1** (breaking change). Only used at build/lint time, not in production runtime.

---

## 3. ajv (moderate) – ReDoS

- **Advisory:** [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6)
- **Issue:** ReDoS when using `$data` option.
- **Where it comes from:** `@eslint/eslintrc` → `eslint` (same ESLint upgrade path as above).
- **Fix:** Same as minimatch – fix would come from upgrading ESLint via `npm audit fix --force`.

---

## Summary

| Severity | Count | Fix strategy |
|----------|--------|--------------|
| High     | 14    | Next.js: `npm audit fix`. Rest (ESLint/minimatch/ajv): require ESLint 10 upgrade (`npm audit fix --force`). |
| Moderate | 1     | Tied to ESLint 10 upgrade. |

**Recommended next steps:**

1. Run **`npm audit fix`** to resolve the Next.js high-severity issues (no breaking change).
2. For the ESLint/minimatch/ajv chain, either:
   - Run **`npm audit fix --force`** and then fix any new ESLint 10 config/rules (breaking change), or
   - Accept the dev-only risk for now and plan an ESLint upgrade in a separate task.
3. Re-run **`npm audit`** after any fix to confirm remaining issues.
