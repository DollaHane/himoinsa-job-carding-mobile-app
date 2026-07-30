# Mobile Coding Guide — HIMOINSA Technician App

This guide adapts the web frontend conventions to the React Native Expo app. The directory structure stays as-is; only philosophies, naming, and patterns are ported.

---

## Stack Overview

| Concern              | Library / Approach                                      |
| -------------------- | ------------------------------------------------------- |
| Framework            | React Native Expo SDK 54 + Expo Router v6               |
| Language             | TypeScript (strict mode)                                |
| Routing              | Expo Router — file-based routing in `app/`              |
| Server state         | TanStack React Query v5                                 |
| HTTP                 | Native `fetch` (wrapped by `apiFetch` in `http/index.ts`)|
| Forms                | `react-hook-form` + Zod v4 + `@hookform/resolvers`      |
| Styling              | NativeWind + Tailwind CSS v3                            |
| Component primitives | gluestack-ui v3                                         |
| Variant utility      | `tailwind-variants` (tva) + `cn()` via NativeWind/clsx  |
| Notifications        | `react-native-toast-message`                            |
| Signature capture    | `react-native-signature-canvas` + `react-native-webview`|
| Offline queue        | `expo-sqlite` (jobcard creation & completion)           |
| Location             | `expo-location`                                         |

---

## Directory Structure

```
app/                    # Expo Router routes
components/
  page-*/               # Page-specific components (com-*, mod-*)
  ui/
    forms/              # Reusable form field wrappers (form-input, form-select, etc.)
    groups/             # Composed UI groups (card-group, modal-group, alert-dialog-group, info-group)
    layout/             # App shell, header, user menu
  navigation/           # Bottom tab bar, header menu
constants/              # nav-items, etc.
contexts/               # AuthContext, ThemeContext
http/                   # apiFetch, actions, services, query keys, offline-queue
hooks/                  # mutation.ts, use-initials, use-elapsed-time, etc.
lib/                    # utils, helpers, validators
providers/              # QueryClient provider
types/                  # TypeScript types
utils/                  # helpers, validators
```

---

## Component Naming Conventions

| Prefix   | Meaning                              | Location                              |
| -------- | ------------------------------------ | ------------------------------------- |
| `com-`   | Page-specific UI piece               | `components/page-{domain}/`           |
| `mod-`   | Modal / dialog wrapper               | `components/page-{domain}/`           |
| `form-`  | Form field wrapper                   | `components/ui/forms/`                |
| `app-`   | App shell / layout piece             | `components/ui/layout/`, `components/navigation/` |
| `aler-`  | Alert dialog                         | `components/page-{domain}/`           |

**Export rules:**
- Page-level components (`com-*`, `mod-*`) use `default export`.
- Reusable design-system pieces (`form-*`, `ui/*`, `groups/*`, `layout/*`, `navigation/*`) use named exports.

---

## Page-Specific Components (`page-*/`)

Components that belong to a specific screen live in `components/page-{domain}/`. Screens remain thin shells.

```
components/page-dashboard/  →  app/tabs/(tabs)/dashboard.tsx
components/page-jobcards/   →  app/tabs/(tabs)/job-cards.tsx, app/tabs/(tabs)/job-cards/[id].tsx
components/page-profile/    →  app/tabs/(tabs)/profile.tsx
```

**Rules:**
- If a component is only used by one screen, it still lives in the matching `page-*/` directory — never inline in the route file.
- A button that opens a modal must be extracted into a single `mod-*.tsx` component.

---

## UI Components (`components/ui/`)

### Base primitives
Use gluestack-ui v3 primitives: `Button`, `Input`, `Textarea`, `Select`, `Card`, `Modal`, `Badge`, `Avatar`, etc.

### `field.tsx` — Field system
- `Field` — container with `data-invalid` styling
- `FieldGroup` — layout wrapper for grouping fields with gap spacing
- `FieldLabel`, `FieldDescription`, `FieldError`

### `forms/` — Reusable form field wrappers
All components accept `control: Control<T>`, `name: FieldPath<T>`, plus standard props (`label`, `description`, `required`, `disabled`, `hidden`).

| Component            | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `FormInput`          | Text/number/email/password input           |
| `FormTextArea`       | Multi-line text                            |
| `FormSelect`         | Dropdown / action-sheet picker             |
| `FormSwitch`         | Boolean toggle                             |
| `FormDatePicker`     | Date/time picker using datetimepicker      |
| `FormDurationPicker` | Hours + minutes → stores as seconds        |

**Every form field follows this identical structure:**
```tsx
<Controller
  control={control}
  name={name}
  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
    <FormControl isInvalid={!!error}>
      <FormControlLabel>
        <FormControlLabelText>{label}{required && '*'}</FormControlLabelText>
      </FormControlLabel>
      {/* gluestack primitive input */}
      {description && !error && (
        <FormControlHelper>{description}</FormControlHelper>
      )}
      {error && (
        <FormControlError>{error.message}</FormControlError>
      )}
    </FormControl>
  )}
/>
```

### `groups/` — Composed UI groups
| Component          | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `ModalGroup`       | Wraps gluestack `Modal` with trigger + title      |
| `CardGroup`        | Wraps gluestack `Card` with header/content        |
| `AlertDialogGroup` | Confirm/cancel action using gluestack `AlertDialog`|
| `InfoGroup`        | Label/data/icon row                               |

---

## HTTP Layer (`http/`)

### Separation of concerns
- `index.ts` — Core transport (`apiFetch`, device fingerprinting, response actions)
- `actions.ts` — API endpoint constants (`HimoinsaAPI`) and raw fetcher functions
- `services.ts` — React Query hooks (`useGetXxx`) and `QueryKeys` constants
- `offline-queue.ts` — SQLite queue for pending jobcard creations and completions

### `apiFetch` (`http/index.ts`)
Native `fetch` wrapper:

```ts
export const apiFetch = (
  url: string,
  method: METHOD,
  payload?: Record<string, any>,
  headers?: Record<string, string>,
) => fetch(`${config.backend_domain}${url}`, {
  method,
  body: method !== 'DELETE' && method !== 'GET' && payload ? JSON.stringify(payload) : undefined,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Device-Fingerprint': JSON.stringify(getDeviceFingerprint()),
    ...(sessionToken ? { 'X-Session-Token': sessionToken } : {}),
    ...headers,
  },
});
```

Differences from web:
- Read session token from `expo-secure-store`.
- Use `expo-device-info` / `Dimensions` for fingerprint.
- Redirect on 401 via a registered navigation ref.

### Backend URLs (`app-config.ts`)
```ts
export const config = {
  domain: process.env.EXPO_PUBLIC_DOMAIN,
  backend_domain: process.env.EXPO_PUBLIC_BACKEND_DOMAIN,
  app_title: 'HIMOINSA - Technician App',
};
```

### Endpoint Registry (`http/actions.ts`)
All API paths live in the `HimoinsaAPI` object with a shared `route_prefix`:

```ts
const route_prefix = 'api/hjc/v1/'

export const HimoinsaAPI = {
  // Auth
  api_login: 'api/v1/login',
  api_logout: 'api/v1/logout',
  api_verify: 'api/v1/verify',

  // Users
  api_users_list: `${route_prefix}users/list`,
  api_users_show: `${route_prefix}users/show`,
  api_users_update: `${route_prefix}users/update`,

  // Technicians
  api_technicians_list: `${route_prefix}technicians/list`,
  api_technicians_show: `${route_prefix}technicians/show`,

  // Jobcards
  api_jobcards_list: `${route_prefix}jobcards/list`,
  api_jobcards_show: `${route_prefix}jobcards/show`,
  api_jobcards_store: `${route_prefix}jobcards/store`,
  api_jobcards_update: `${route_prefix}jobcards/update`,
  api_jobcards_complete: `${route_prefix}jobcards/complete`,
  api_jobcards_metadata: `${route_prefix}jobcards/metadata`,

  // Timers
  api_timers_start: `${route_prefix}timers/start`,
  api_timers_stop: `${route_prefix}timers/stop`,
  api_timers_running: `${route_prefix}timers/running`,
  api_timers_list: `${route_prefix}timers/list`,
  api_timers_events: `${route_prefix}timers/events`,

  // Inventory / Parts
  api_inventory_list: `${route_prefix}inventory/list`,
  api_inventory_search: `${route_prefix}inventory/search`,

  // Dashboard
  api_dashboard_stats: `${route_prefix}dashboard/stats`,
}
```

Raw fetcher functions for use with React Query:

```ts
export async function getJobcardsList(params?: JobcardListParams): Promise<Jobcard[]> {
  const url = buildUrl(HimoinsaAPI.api_jobcards_list, params)
  const response = await apiFetch(url, 'GET')
  const json = (await response.json()) as Response<Jobcard[]>
  if (!json.data) throw new Error('Failed to fetch jobcards list.')
  return json.data
}

export async function getJobcardShow(id: string): Promise<Jobcard> {
  const response = await apiFetch(`${HimoinsaAPI.api_jobcards_show}/${id}`, 'GET')
  const json = (await response.json()) as Response<Jobcard>
  if (!json.data) throw new Error(`Failed to fetch jobcard by id:${id}`)
  return json.data
}

export async function startTimer(jobcardId: number, lat?: number, lng?: number): Promise<TimerJobcard> {
  const response = await apiFetch(HimoinsaAPI.api_timers_start, 'POST', {
    jobcard_id: jobcardId,
    ...(lat !== undefined ? { lat } : {}),
    ...(lng !== undefined ? { lng } : {}),
  })
  const json = (await response.json()) as Response<TimerJobcard>
  if (!json.data) throw new Error('Failed to start timer.')
  return json.data
}

export async function stopTimer(timerId: number): Promise<TimerJobcard> {
  const response = await apiFetch(HimoinsaAPI.api_timers_stop, 'POST', { timer_id: timerId })
  const json = (await response.json()) as Response<TimerJobcard>
  if (!json.data) throw new Error('Failed to stop timer.')
  return json.data
}
```

**Always use the provided `route_prefix` when building api route endpoints.**

### Query Keys (`http/services.ts`)
All query keys are defined in the exported `QueryKeys` object:

```ts
export const QueryKeys = {
  user_list: ['users-list'] as const,
  user_show: (id: string | null): string[] => ['user-show', id ?? ''],
  technicians_list: ['technicians-list'] as const,
  technician_show: (id: string | null): string[] => ['technician-show', id ?? ''],
  jobcards_list: ['jobcards-list'] as const,
  jobcards_list_filtered: (params?: JobcardListParams): Array<string | JobcardListParams> =>
    ['jobcards-list', params ?? {}],
  jobcards_show: (id: string | null): string[] => ['jobcard-show', id ?? ''],
  jobcards_metadata: ['jobcards-metadata'] as const,
  timers_running: ['timers-running'] as const,
  timers_events: ['timers-events'] as const,
  timers_list: (params?: {
    technician_id?: number
    jobcard_id?: number
    date_from?: string
    date_to?: string
  }): Array<string | Record<string, unknown>> => ['timers-list', params ?? {}],
  inventory_list: (search?: string): string[] => ['inventory-list', search ?? ''],
  inventory_search: (search: string): string[] => ['inventory-search', search],
  dashboard_stats: ['dashboard-stats'] as const,
}
```

**Always use `QueryKeys` for cache invalidation — never hardcode raw strings.**

### React Query Hooks (`http/services.ts`)
Each feature gets a `useGetXxx` hook:

```ts
export function useGetJobcardsList(params?: JobcardListParams) {
  return useQuery<Jobcard[]>({
    queryKey: QueryKeys.jobcards_list_filtered(params),
    queryFn: () => getJobcardsList(params),
  })
}

export function useGetJobcardShow(id: string | null) {
  return useQuery<Jobcard>({
    queryKey: QueryKeys.jobcards_show(id),
    queryFn: () => getJobcardShow(id!),
    enabled: !!id,
  })
}

export function useGetTechnicianShow(id: string | null) {
  return useQuery<TechnicianShowResponse>({
    queryKey: QueryKeys.technician_show(id),
    queryFn: () => getTechnicianShow(id!),
    enabled: !!id,
  })
}

export function useGetRunningTimers() {
  return useQuery<TimerJobcard[]>({
    queryKey: QueryKeys.timers_running,
    queryFn: () => getRunningTimers(),
  })
}

export function useGetTimerEvents() {
  return useQuery<TimerEvent[]>({
    queryKey: QueryKeys.timers_events,
    queryFn: () => getTimerEvents(),
    staleTime: Infinity,
  })
}

export function useGetDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: QueryKeys.dashboard_stats,
    queryFn: () => getDashboardStats(),
  })
}
```

---

## Forms

All forms use **`react-hook-form`** (not `@tanstack/react-form`) with **Zod v4** and `@hookform/resolvers`.

### Validation files
Zod schemas live in `lib/validators/`. Export both the schema and the inferred type:

```ts
export const validateLogin = z.object({ ... });
export type LoginCreationRequest = z.input<typeof validateLogin>;
```

### Typical form structure
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutationHandler } from "@/hooks/mutation"
import { FormInput } from "@/components/ui/forms/form-input"
import { FieldGroup } from "@/components/ui/field"
import { Button, ButtonText } from "@/components/ui/button"

interface MyFormValues {
  field_name: string;
}

export default function MyForm() {
  const { control, handleSubmit, reset } = useForm<MyFormValues>({
    defaultValues: { field_name: "" },
    resolver: zodResolver(validateSchema),
  });

  const { handleMutation: onSubmit, isPending } = useMutationHandler({
    route: HimoinsaAPI.some_endpoint,
    method: "POST",
    success_message: "Saved successfully!",
    query_keys: QueryKeys.some_key,
    onSuccess: () => reset(),
  });

  return (
    <View>
      <FieldGroup>
        <FormInput
          control={control}
          name="field_name"
          label="Label"
          isRequired
        />
      </FieldGroup>
      <Button disabled={isPending} onPress={handleSubmit(onSubmit)}>
        <ButtonText>{isPending ? "Saving..." : "Save"}</ButtonText>
      </Button>
    </View>
  );
}
```

### Full example: preliminary jobcard creation

```tsx
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { View } from "react-native";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useMutationHandler } from "@/hooks/mutation";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextArea } from "@/components/ui/forms/form-textarea";
import { FormSelect } from "@/components/ui/forms/form-select";
import { FormDatePicker } from "@/components/ui/forms/form-date-picker";
import { FieldGroup } from "@/components/ui/field";
import { Button, ButtonText } from "@/components/ui/button";
import { mapToOptions } from "@/lib/helpers/form-options";
import { useGetCustomersList, useGetJobcardMetadata } from "@/http/services";

const validateQuickJobcard = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  work_description: z.string().min(1, "Work description is required"),
  scheduled_datetime: z.string().optional(),
  service_type: z.string().min(1, "Service type is required"),
});

type QuickJobcardFormValues = z.input<typeof validateQuickJobcard>;

export default function ModCreateQuickJobcard() {
  const { user } = useAuth();
  const { data: customers } = useGetCustomersList();
  const { data: metadata } = useGetJobcardMetadata();

  const customerOptions = useMemo(
    () => mapToOptions(customers ?? [], "company_name", "id"),
    [customers]
  );

  const serviceTypeOptions = useMemo(
    () => mapToOptions(metadata?.service_types ?? [], "name", "id"),
    [metadata]
  );

  const defaultValues = useMemo(
    () => ({
      customer_id: "",
      work_description: "",
      scheduled_datetime: new Date().toISOString(),
      service_type: String(metadata?.service_types?.[0]?.id ?? ""),
    }),
    [metadata]
  );

  const { control, handleSubmit, reset } = useForm<QuickJobcardFormValues>({
    defaultValues,
    resolver: zodResolver(validateQuickJobcard),
  });

  const { handleMutation: onSubmit, isPending } = useMutationHandler({
    route: HimoinsaAPI.api_jobcards_store,
    method: "POST",
    success_message: "Jobcard created.",
    query_keys: QueryKeys.jobcards_list,
    redirect_url: "/tabs/job-cards",
    onSuccess: () => reset(),
  });

  const submit = (values: QuickJobcardFormValues) => {
    const payload = {
      is_fleet_jc: false,
      customer_id: Number(values.customer_id),
      work_description: values.work_description,
      scheduled_datetime: values.scheduled_datetime,
      service_type: Number(values.service_type),
      technicians: user?.technician_id ? [user.technician_id] : [],
      assets: [],
      tasks: [],
      inventory: [],
    };

    onSubmit(payload);
  };

  return (
    <View>
      <FieldGroup>
        <FormSelect
          control={control}
          name="customer_id"
          label="Customer"
          options={customerOptions}
          placeholder="Select customer"
          isRequired
        />

        <FormTextArea
          control={control}
          name="work_description"
          label="Work Description"
          placeholder="Describe the work..."
          isRequired
        />

        <FormSelect
          control={control}
          name="service_type"
          label="Service Type"
          options={serviceTypeOptions}
          placeholder="Select service type"
          isRequired
        />

        <FormDatePicker
          control={control}
          name="scheduled_datetime"
          label="Scheduled Date"
          mode="datetime"
        />
      </FieldGroup>

      <Button
        disabled={isPending}
        onPress={handleSubmit(submit)}
        className="mt-4"
      >
        <ButtonText>{isPending ? "Creating..." : "Create Jobcard"}</ButtonText>
      </Button>
    </View>
  );
}
```

**Key rules:**
- Always use `zodResolver(validateSchema)` in `useForm`.
- Submit buttons use `onPress={handleSubmit(onSubmit)}`.
- Wrap fields in `<FieldGroup>`.
- Use reusable `FormXxx` components.
- Reset the form in `useMutationHandler`'s `onSuccess` callback.

---

## Data Mutations — `useMutationHandler`

Located at `hooks/mutation.ts`. Wraps React Query's `useMutation` and works with `react-hook-form`.

```ts
const { handleMutation: onSubmit, isPending } = useMutationHandler({
  route: HimoinsaAPI.api_jobcards_store,
  method: "POST",
  success_message: "Jobcard created.",
  query_keys: QueryKeys.jobcards_list,
  redirect_url: "/tabs/job-cards",
  onSuccess: () => reset(),
});
```

`query_keys` is required.

---

## Timer Flow & GPS

The existing timer events already cover "On My Way" → "Arrived":

1. Technician presses **Start Timer** on a jobcard.
2. The first timer event type is "On My Way" (`startTimer(jobcard_id, lat, lng)`).
3. While the timer runs, capture GPS snapshots periodically (e.g., every 60s while app is foreground).
4. Technician presses **Stop Timer**; event becomes "Arrived".
5. Subsequent timer events follow the normal task flow.

**GPS capture triggers:**
- Timer start
- Timer stop
- Jobcard creation (online or queued)
- Periodic snapshot while a timer is running

Store lat/lng with timer payloads where the API accepts them.

---

## Offline Queue (`http/offline-queue.ts`)

Applies to:
- Jobcard creation
- Jobcard completion
- Timer start/stop (if desired; start with creation/completion)

### Behavior
1. Check network state with `expo-network` before mutating.
2. If online: call API directly via `useMutationHandler`.
3. If offline: store pending payload in SQLite.
4. On app foreground / network recovery / pull-to-refresh, attempt sync.
5. On successful sync, delete local record and invalidate relevant `QueryKeys`.
6. When jobcards are confirmed to exist via API, flush stale local records.

### SQLite schema (initial)
```sql
CREATE TABLE IF NOT EXISTS pending_jobcards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,           -- 'create' | 'complete'
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  retry_count INTEGER DEFAULT 0
);
```

---

## Styling

- Use NativeWind/Tailwind utility classes exclusively.
- Use `cn()` from `lib/utils.ts`.
- For multi-variant components, use `tva` (Tailwind Variants) via gluestack.
- Prefer semantic tokens from `tailwind.config.js`: `--primary`, `--success`, `--warning`, `--destructive`, `--info`.

---

## State Management

No global state library.

| State type           | Approach                                |
| -------------------- | --------------------------------------- |
| Server / async state | TanStack React Query                    |
| Auth / session       | `AuthContext` + `expo-secure-store`     |
| Local UI state       | `useState` / `useReducer`               |
| Offline queue        | `expo-sqlite`                           |

---

## Path Aliases

`@/` maps to project root.

```ts
import { cn } from '@/lib/utils';
import { useGetJobcardsList } from '@/http/services';
import { FormInput } from '@/components/ui/forms/form-input';
```

---

## What Not To Do

- Do not use `axios` — use native `fetch` via `apiFetch`.
- Do not use `@tanstack/react-form` — the project uses `react-hook-form`.
- Do not call `useMutationHandler` without `query_keys`.
- Do not bypass `useMutationHandler` for standard CRUD.
- Do not create barrel `index.ts` files.
- Do not use raw Tailwind palette colours for status/state — use semantic tokens.
- Do not use `console.log` in committed code.
- Do not pass a `useState` setter as a callback into a toggled child component.
- Do not write inline arrow functions in gluestack `Button` / `Pressable` `onPress` props; extract handlers.
