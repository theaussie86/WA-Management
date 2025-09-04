# WA Management App

Eine Next.js 15 App mit Supabase Backend für das Weissteiner Automation (WA) Management System.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui Komponenten
- **Backend**: Supabase (Auth, Database, Real-time)
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (geplant)

## Entwicklung

### Voraussetzungen

- Node.js 20+
- npm
- Supabase Account

### Installation

```bash
# Dependencies installieren
npm install

# Environment Variables konfigurieren
cp .env.example .env.local
# Bearbeite .env.local mit deinen Supabase Credentials
```

### Entwicklungsserver starten

```bash
npm run dev
```

Die App ist dann unter [http://localhost:3000](http://localhost:3000) verfügbar.

## Testing

### Tests ausführen

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus
npm run test:watch

# Tests mit Coverage Report
npm run test:coverage

# Tests für CI/CD
npm run test:ci
```

### Test Coverage

Die App hat eine Test Coverage von mindestens 70% für:

- Branches
- Functions
- Lines
- Statements

### Test-Struktur

```
__tests__/
├── components/          # Komponenten-Tests
├── hooks/              # Hook-Tests
├── lib/                # Utility-Tests
└── utils/              # Test-Utilities
```

## CI/CD Pipeline

Die GitHub Actions Pipeline führt folgende Schritte aus:

1. **Linting & Code Quality**

   - ESLint
   - TypeScript Check

2. **Testing**

   - Unit Tests
   - Coverage Report
   - Upload zu Codecov

3. **Build Test**

   - Production Build
   - Artifact Upload

4. **Security Audit**

   - npm audit
   - Snyk Vulnerability Scan

5. **Deployment** (nur main branch)
   - Deploy zu Vercel
   - Lighthouse Performance Test

## Environment Variables

Erstelle eine `.env.local` Datei mit folgenden Variablen:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel (Empfohlen)

1. Verbinde dein GitHub Repository mit Vercel
2. Konfiguriere die Environment Variables in Vercel
3. Die App wird automatisch bei jedem Push auf `main` deployed

### GitHub Secrets

Für die CI/CD Pipeline benötigst du folgende Secrets:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `CODECOV_TOKEN` (optional)
- `SNYK_TOKEN` (optional)

## Projektstruktur

```
app/                    # Next.js App Router
├── (protected)/       # Geschützte Routen
├── auth/             # Authentifizierung
components/           # Wiederverwendbare Komponenten
├── ui/              # shadcn/ui Komponenten
├── tutorial/        # Tutorial-spezifische Komponenten
lib/                 # Utility-Funktionen
├── supabase/        # Supabase Konfiguration
hooks/               # Custom React Hooks
__tests__/           # Test-Dateien
.github/             # GitHub Actions Workflows
```

## Contributing

1. Erstelle einen Feature Branch
2. Implementiere deine Änderungen
3. Schreibe Tests für neue Features
4. Stelle sicher, dass alle Tests bestehen
5. Erstelle einen Pull Request

## Lizenz

Private Projekt - Weissteiner Automation
