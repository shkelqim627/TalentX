# TalentX

TalentX is an AI-first talent network platform designed to connect businesses with verified talent, teams, and agencies through intelligent matching, flexible engagement models, and integrated collaboration tools. It is a private, proprietary project developed by Incrosoft and intended as a direct competitor to Toptal.

## Project Structure

-   `client/`: Next.js frontend application.
-   `server/`: Express.js backend application with Prisma ORM.

## Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Lucide React.
-   **Backend**: Node.js, Express, TypeScript, Prisma.
-   **Database**: PostgreSQL (Production).
-   **Orchestration**: Docker Compose.

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   npm or yarn
-   Docker (optional, for containerized setup)

### Local Development

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd TalentX
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up environment variables**:

    -   Create `.env` files in both `client/` and `server/` directories based on the provided `.env.example` files (if available).

4.  **Run the project**:
    ```bash
    npm run dev
    ```
    This will start both the client and server concurrently.

### Docker Setup

To run the entire stack using Docker:

```bash
docker-compose up --build
```

## Governance

-   **License**: Proprietary (Incrosoft). See [LICENSE](./LICENSE) for details.
-   **Owners**: See [CODEOWNERS](./CODEOWNERS) for repository ownership details.

---

 © 2025 Incrosoft. All rights reserved.
