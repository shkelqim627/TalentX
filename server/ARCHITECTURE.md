# TalentX Backend Architecture Documentation

## 1. Overview
The backend follows **Clean Architecture** (also known as Onion Architecture or Hexagonal Architecture). The core principle is the **Dependency Rule**: source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle.

## 2. Directory Structure

```text
src/
├── domain/               # Enterprise Business Rules (Independent)
│   ├── entities/         # Core business objects (e.g., User, Project)
│   └── repositories/     # Repository Interfaces (Abstractions)
│
├── application/          # Application Business Rules
│   ├── services/         # Use Cases / Orchestration
│   └── dtos/             # Data Transfer Objects (Input/Output definitions)
│
├── interface/            # Interface Adapters (Incoming)
│   ├── controllers/      # HTTP Request Handlers
│   ├── routes/           # Router definitions
│   └── middleware/       # Auth, Logging, Validation
│
└── infrastructure/       # Frameworks & Drivers (Outgoing)
    ├── database/         # Repositories implementations (Prisma)
    ├── websocket/        # Real-time socket implementations
    └── external-services/ # Email, Stripe, AI integrations
```

## 3. Layer Responsibilities

### 1. Domain Layer (`src/domain`)
- **Role**: The heart of the software. Contains enterprise-wide business rules.
- **Dependencies**: NONE. Strictly pure TypeScript.
- **Content**: 
  - `entities/`: Classes representing business objects with their rules.
  - `repositories/`: Interfaces defining *what* persistence operations are needed, not *how* they are done.

### 2. Application Layer (`src/application`)
- **Role**: Orchestrates the flow of data to and from domain entities.
- **Dependencies**: Depends ONLY on `domain`.
- **Content**: 
  - `services/`: Implements specific user stories (e.g., `RegisterUserService`, `CreateProjectService`).
  - `dtos/`: Defines the shape of data unrelated to the database or UI.

### 3. Interface Layer (`src/interface`)
- **Role**: Converts data from the format most convenient for user interface/web to the format most convenient for use cases.
- **Dependencies**: Depends on `application` and `domain`.
- **Content**:
  - `controllers/`: Unpacks HTTP requests, calls Application Services, packs responses.
  - `routes/`: Maps specific URLs to controllers.
  - `middleware/`: Intercepts requests for auth or validation.

### 4. Infrastructure Layer (`src/infrastructure`)
- **Role**: Where the code meets the external world (Database, IO, 3rd Party APIs).
- **Dependencies**: Can depend on everything defined inside.
- **Content**:
  - `database/`: Concrete implementations of Repositories (e.g., `PrismaUserRepository`).
  - `websocket/`: Socket.io handling.
  - `external-services/`: Mailer adapters, Payment gateways.

## 4. Development Rules & Flow

### Making Changes
1. **New Feature**: Start from the center (`domain`). Define entities and repository interfaces.
2. **Use Case**: Implement the logic in `application/services` using the interfaces.
3. **External World**: Implement the repository in `infrastructure/database`.
4. **Exposure**: create the `controller` and `route` in `interface`.

### Dependency Injection
- Application services should receive repository instances (interfaces) via their constructor.
- This allows swapping `PrismaUserRepository` with `MockUserRepository` for testing.

```typescript
// Example: Application Service
class UserService {
  constructor(private userRepo: IUserRepository) {}
  
  async create(dto: CreateUserDTO) { ... }
}
```

## 5. Technology Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **ORM**: Prisma (Infrastructure layer)
- **Web Framework**: Express (Interface layer)
