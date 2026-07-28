# ⚠️ LEGACY CODE - DO NOT USE

## Status: DEPRECATED

This directory (`src/auth/`) contains **legacy authentication code** that has been replaced by the Clean Architecture implementation.

---

## 🚫 DO NOT USE

**These files are deprecated:**
- ❌ `auth.controller.ts`
- ❌ `auth.service.ts`
- ❌ `auth.module.ts`
- ❌ `jwt.strategy.ts`
- ❌ `jwt-auth.guard.ts`

---

## ✅ USE INSTEAD

**Active implementation (Clean Architecture):**
```
src/
├── presentation/http/auth/          ← Controllers, DTOs, Guards
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── guards/jwt.strategy.ts
│
├── application/use-cases/           ← Business logic
│   ├── login-user.use-case.ts
│   ├── register-user.use-case.ts
│   ├── refresh-token.use-case.ts
│   └── logout-user.use-case.ts
│
└── infrastructure/security/         ← JWT implementation
    └── jwt-token.service.impl.ts
```

---

## 🗑️ TODO: Remove This Directory

**Action Items:**
1. Verify all imports reference new code
2. Run tests to ensure nothing depends on legacy code
3. Delete this directory: `rm -rf src/auth/`
4. Update `app.module.ts` if needed

**Safe to delete when:**
- ✅ No imports from `src/auth/*`
- ✅ All tests passing
- ✅ Application starts successfully

---

## 🔍 Check Dependencies

```bash
# Find any remaining imports
grep -r "from.*src/auth" src/
grep -r "from.*\./auth" src/

# If output is empty, safe to delete
```

---

**Date Marked as Legacy:** 2026-07-27
