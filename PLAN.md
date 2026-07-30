# Mobile App (React Native Expo) — Technician Focus

## Scope

Rebuild the existing Expo app into a technician-focused app mirroring the web app, plus mobile-native execution features. Keep the existing directory structure to avoid unnecessary churn.

### Screens

- Login
- Technician Dashboard
- Jobcards list
- Jobcard detail / execution
- Technician profile
- Quick preliminary jobcard creation (offline-capable)

### Core features

- Login with `X-Session-Token` auth (same as web).
- View own jobcards.
- Timer start/stop.
- Complete jobcard (tasks, inventory used, SMR).
- Create basic jobcards (auto-assigned to self) with offline SQLite queue.
- GPS "On My Way" / drive-time trigger.
- Photo capture.
- Signature capture.
- Parts search + recording.

---

## Decisions Made

1. **Keep gluestack-ui v3** as the mobile component primitive layer.
2. **Keep existing root-level directory structure** (`app/`, `components/`, `http/`, etc.). Do not move to `src/`.
3. **Bottom tabs** for Dashboard / Job Cards / Profile; keep user menu dropdown pattern.
4. **Same endpoints & auth model** as web: native `fetch` + `apiFetch` + `X-Session-Token` in SecureStore.
5. **Keep `react-hook-form`** (already in the Expo app) + Zod v4 + `@hookform/resolvers`. Do **not** introduce `@tanstack/react-form`.
6. **Keep TanStack React Query** for server state.
7. **Offline jobcard creation** via `expo-sqlite` queue; sync when online. Once API sync succeeds, flush local records.

---

## Files to Gut/Delete

- `/app/tabs/(tabs)/tickets.tsx`
- `/app/tabs/(tabs)/createticketform.tsx`
- `/app/tabs/(tabs)/profile.tsx` (rebuild)
- `/app/tabs/(tabs)/policy.tsx`
- `/app/tabs/(tabs)/terms.tsx`
- `/components/page_fleet_control/`
- `/components/page_revenue/`
- `/components/page_profile/`
- `/components/EditScreenInfo.tsx`
- `/components/ExternalLink.tsx`
- `/components/Themed.tsx`
- `/components/useColorScheme.ts` / `.web.ts`
- `/components/useClientOnlyValue.ts` / `.web.ts`
- `/constants/Colors.ts`
- `/utils/mock-data.ts`
- `/utils/validators/validate-create-ticket.ts`
- Legacy ITSM endpoints in `/http/api.ts`

---

## New Route Structure

```
app/
├── _layout.tsx              # providers + auth gate
├── index.tsx                # login
├── tabs/
│   ├── _layout.tsx          # stack wrapper
│   └── (tabs)/
│       ├── _layout.tsx      # bottom tabs
│       ├── dashboard.tsx
│       ├── job-cards.tsx
│       ├── job-cards/
│       │   └── [id].tsx
│       └── profile.tsx
```

---

## Packages to Add

```bash
npx expo install expo-sqlite expo-camera expo-location expo-network
npx expo install react-native-signature-canvas react-native-webview
```

Optional:

```bash
npx expo install expo-image-picker   # gallery selection
```

Update `app.json` plugins/permissions for `expo-camera`, `expo-location`, and `react-native-webview`.

---

## Implementation Phases

### Phase 0: Cleanup & Tooling

- Delete files listed in "Files to Gut/Delete".
- Remove `axios` from dependencies (keep `@hookform/resolvers` and `react-hook-form`).
- Install `expo-sqlite`, `expo-camera`, `expo-location`, `expo-network`, `react-native-signature-canvas`, `react-native-webview`.
- Update `app.json` plugins/permissions for camera, location, webview.
- Update `AGENTS.md` and `PLAN.md` to reflect `react-hook-form` decision.

### Phase 1: Core Infrastructure

- `app-config.ts`
- `http/index.ts` — `apiFetch` with SecureStore, device fingerprinting, 401 redirect
- `http/actions.ts` and `http/services.ts` ported from web
- `lib/validators/*`, `lib/helpers/*`, `lib/utils.ts`, `types/*` ported from web
- `contexts/AuthContext.tsx` + `AuthStorage` using SecureStore
- `hooks/mutation.ts` adapted for Expo Router + mobile toast
- `components/ui/field.tsx` + `components/ui/forms/*` using gluestack + `react-hook-form`
- `components/ui/groups/*`

### Phase 2: Navigation & Shell

- `app/_layout.tsx` with providers + auth gate
- `app/tabs/(tabs)/_layout.tsx` with bottom tabs: Dashboard / Job Cards / Profile
- Rewire `components/navigation/custom-nav-bar.tsx` and `header-menu.tsx`
- User menu dropdown with logout/profile

### Phase 3: Auth & Main Screens

- `app/index.tsx` login
- `app/tabs/(tabs)/dashboard.tsx`
- `app/tabs/(tabs)/job-cards.tsx`
- `app/tabs/(tabs)/job-cards/[id].tsx`
- `app/tabs/(tabs)/profile.tsx`
- All supporting `com-*` and `mod-*` components

### Phase 4: Timer Execution & GPS

- Timer start/stop with event mapping
- Periodic GPS snapshots while timer is running
- GPS capture on timer events and jobcard creation
- SMR entry, task check-off, inventory used
- Photo capture via `expo-camera`
- Signature capture via `react-native-signature-canvas`

### Phase 5: Offline Queue

- SQLite queue for jobcard creation and completion
- Network detection with `expo-network`
- Sync on foreground / recovery / pull-to-refresh
- Flush local records after successful sync or when jobcards exist via API

### Phase 6: Verification

- `npx tsc --noEmit` passes
- Test login, dashboard, jobcards, timers, completion, signatures, photos
- Test offline creation/completion → online sync
- Run on Android/iOS development builds

---

## Suggested Agent Prompt

> Rebuild the HIMOINSA Expo mobile app at `/home/dollahane/Code/1-Projects/himoinsa-job-carding-mobile-app` into a technician-focused React Native app mirroring the web app at `/home/dollahane/Code/1-Projects/himoinsa-job-carding-system`.
>
> Keep the existing root-level directory structure. Do not move files into `src/`.
>
> Scope:
>
> - Login
> - Technician dashboard (today's jobcards, upcoming 2-week schedule, quick preliminary jobcard creation)
> - Jobcards list
> - Jobcard detail/execution (timer start/stop, tasks, inventory, SMR, photos, signature)
> - Technician profile
>
> Requirements:
>
> - Use the same backend endpoints and `X-Session-Token` auth model as the web app.
> - Replace `axios` with native `fetch` + `apiFetch` wrapper.
> - Keep `react-hook-form` + Zod v4 + `@hookform/resolvers` for forms. Do **not** introduce `@tanstack/react-form`.
> - Keep TanStack React Query for server state.
> - Keep gluestack-ui v3 as the primitive layer.
> - Use bottom-tab navigation: Dashboard / Job Cards / Profile.
> - Implement GPS snapshots on timer events and jobcard creation, plus periodic snapshots while a timer runs.
> - Use `react-native-signature-canvas` for signatures.
> - Implement offline SQLite queue for jobcard creation and completion (Phase 5).
> - Follow the adapted AGENTS.md conventions: file prefixes (`com-*`, `mod-*`, `form-*`, `app-*`), default exports for page components, named exports for reusable pieces, `useMutationHandler` for mutations, `QueryKeys` for cache invalidation, semantic color tokens.
>
> Ensure `npx tsc --noEmit` passes and the app runs on Android/iOS.
