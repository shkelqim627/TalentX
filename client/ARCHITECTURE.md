# TalentX Frontend Architecture Documentation

## 1. Overview
This project uses an adapted **Feature-Sliced Design (FSD)** architecture. The goal is to separate concerns by **scope** (global vs. local) and **business domain** (feature vs. feature), rather than just technical nature (components vs. hooks).

## 2. Directory Structure

```text
src/
├── app/                  # Next.js App Router (Routing layer only)
│   ├── (auth)/           # Route groups
│   ├── (dashboard)/
│   └── layout.tsx        # Root layout
│
├── widgets/              # Composite UI blocks (Organisms)
│   ├── Navbar/
│   ├── Sidebar/
│   └── UserMenu/
│
├── features/             # Business Logic (The "What")
│   ├── auth/             # Login, Registration, Session
│   ├── talent/           # Browse, Filter, Profile
│   ├── projects/         # Project management
│   └── messaging/        # Chat & Notifications
│
├── entities/             # Domain Models (The "Who/Data")
│   ├── user/             # User type, Avatar component
│   ├── project/          # Project status, Badge component
│   └── job/              # Job posting types
│
├── shared/               # Reusable Infrastructure (The "How")
│   ├── api/              # Base Axios client
│   ├── components/       # UI Library (Buttons, Inputs)
│   ├── hooks/            # Generic hooks (useDebounce)
│   └── lib/              # Utils, formatting, validation
│
└── providers/            # App-wide context providers
```

## 3. Structural Rules & Constraints

### Dependency Rule
- **Lower layers cannot import from upper layers.**
- `shared` cannot import from `features`.
- `entities` cannot import from `features`.
- `features` can import from `entities` and `shared`.
- `app` can import from anywhere.

### Layer Responsibilities

#### `shared/`
- **Scope**: Abstract, domain-agnostic.
- **Content**: UI Kit, generic helpers, API clients.
- **Rule**: Changes here affect the whole app. Keep it stable.

#### `entities/`
- **Scope**: Domain data, flexible reuse.
- **Content**: TypeScript interfaces, simple display components (e.g., `UserAvatar`, `ProjectBadge`).
- **Rule**: strictly no complex business logic.

#### `features/`
- **Scope**: User scenarios.
- **Content**: Complete business flows. API calls, detailed components, filtering logic.
- **Rule**: Features should ideally be independent of other features (low coupling).

#### `widgets/`
- **Scope**: Page sections.
- **Content**: Composition of features and entities (e.g., a `Header` containing `UserMenu` and `Search`).

## 4. State Management Strategy

We avoid a monolithic Redux store in favor of specialized tools:

| State Type | Library | Location | Example |
|------------|---------|----------|---------|
| **Server State** | **React Query** | `hooks/useQuery` | API data, cache, loading states |
| **Auth/Session** | **Redux Toolkit** | `store/slices/auth` | User token, permissions, preferences |
| **Global UI** | **Zustand** | `store/ui` | Sidebar toggle, Modal manager, Toast |
| **Form/Local** | **React (useState)** | Component | Input values, temporary toggles |

## 5. API Layer

API definitions are co-located with their features/entities.

- **Base Client**: `shared/api/client.ts` (Axios instance + Interceptors)
- **Feature APIs**: `features/talent/api/talent.api.ts`

**Example Usage**:
```typescript
// features/talent/components/TalentList.tsx
import { useQuery } from '@tanstack/react-query';
import { talentApi } from '../api/talent.api';

const { data } = useQuery(['talents'], talentApi.list);
```

## 6. Development Workflow (Migration)
When adding new code:
1. **Generic?** → Put in `shared`.
2. **Domain Data?** → Put in `entities`.
3. **Business Logic?** → Put in `features`.
4. **Page Layout?** → Put in `widgets` or `app`.
