# CI/CD Pipeline Dokumentation

## Übersicht

Die WA Management App verwendet eine umfassende CI/CD-Pipeline, die auf GitHub Actions basiert und automatische Tests, Code-Qualitätsprüfungen und Deployments durchführt.

## Pipeline-Struktur

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Trigger:** Push zu `main`/`develop`, Pull Requests

**Jobs:**

- **Code Quality & Linting**: TypeScript-Check, ESLint, Code-Formatierung
- **Unit Tests**: Komponenten-, Hook- und Utility-Tests mit Coverage
- **Integration Tests**: Vollständige Integrationstests mit Test-Datenbank
- **Build & Type Check**: Anwendungs-Build und Type-Validierung
- **Security Scan**: NPM Audit und Snyk-Sicherheitsscan
- **Performance Tests**: Performance-Benchmarks und Latenz-Tests
- **E2E Tests**: End-to-End-Tests (nur bei Pull Requests)
- **Test Summary**: Zusammenfassung aller Testergebnisse

### 2. Deployment Pipeline (`.github/workflows/deploy.yml`)

**Trigger:** Push zu `main`, manueller Trigger

**Jobs:**

- **Pre-deployment Tests**: Vollständige Test-Suite vor Deployment
- **Build for Production**: Produktions-Build mit Optimierungen
- **Deploy to Staging**: Automatisches Staging-Deployment
- **Deploy to Production**: Produktions-Deployment nach Staging-Validierung
- **Rollback**: Automatisches Rollback bei Fehlern
- **Cleanup**: Bereinigung von Build-Artefakten

### 3. Pull Request Checks (`.github/workflows/pr-checks.yml`)

**Trigger:** Pull Request Events

**Jobs:**

- **Quick Checks**: Schnelle Code-Qualitätsprüfungen
- **Unit Tests**: Fokussierte Unit-Tests mit Coverage-Report
- **Integration Tests**: Integrationstests für PR-Änderungen
- **Build Check**: Build-Validierung und Bundle-Size-Check
- **Security Check**: Sicherheitsprüfungen und Secret-Detection
- **Performance Check**: Performance-Tests für PR-Änderungen
- **PR Summary**: Automatische PR-Zusammenfassung

### 4. Nightly Tests (`.github/workflows/nightly-tests.yml`)

**Trigger:** Täglich um 2:00 UTC, manueller Trigger

**Jobs:**

- **Full Test Suite**: Vollständige Test-Suite mit Coverage
- **Performance Benchmarks**: Performance-Benchmarks und Metriken
- **Security Scan**: Umfassende Sicherheitsscans
- **Dependency Check**: Abhängigkeits-Updates und Vulnerabilities
- **Test Summary**: Nightly-Test-Zusammenfassung

### 5. Code Quality (`.github/workflows/code-quality.yml`)

**Trigger:** Push zu `main`/`develop`, Pull Requests

**Jobs:**

- **Code Analysis**: ESLint, TypeScript, Coverage-Analyse
- **Security Scan**: NPM Audit und Snyk-Scans
- **Dependency Check**: Abhängigkeits-Updates und Vulnerabilities
- **Performance Check**: Bundle-Size-Analyse und Performance-Metriken
- **Quality Summary**: Code-Qualitäts-Zusammenfassung

## Konfiguration

### Umgebungsvariablen

**Erforderliche Secrets:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
TEST_SUPABASE_URL
TEST_SUPABASE_ANON_KEY
TEST_SUPABASE_SERVICE_ROLE_KEY

# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Security
SNYK_TOKEN

# Notifications
SLACK_WEBHOOK_URL

# Production
PRODUCTION_URL
```

### NPM Scripts

**Test-Scripts:**

```bash
npm run test                 # Alle Tests
npm run test:unit           # Unit Tests
npm run test:integration    # Integration Tests
npm run test:performance    # Performance Tests
npm run test:smoke          # Smoke Tests
npm run test:ci             # CI-optimierte Tests
npm run test:coverage       # Tests mit Coverage
```

**Quality-Scripts:**

```bash
npm run lint                # ESLint Check
npm run lint:fix            # ESLint Fix
npm run type-check          # TypeScript Check
npm run security:audit      # Security Audit
npm run security:fix        # Security Fix
npm run deps:check          # Dependency Check
```

**CI-Scripts:**

```bash
npm run ci:full             # Vollständige CI-Pipeline
npm run ci:quick            # Schnelle CI-Checks
npm run precommit           # Pre-commit Hooks
```

## Deployment-Strategie

### Staging Deployment

- Automatisch bei Push zu `main`
- Verwendet Vercel Staging-Umgebung
- Post-deployment Smoke Tests
- Manuelle Freigabe für Production

### Production Deployment

- Nur nach erfolgreichem Staging
- Verwendet Vercel Production-Umgebung
- Health Check nach Deployment
- Automatisches Rollback bei Fehlern

### Rollback-Strategie

- Automatisches Rollback bei Deployment-Fehlern
- Slack-Benachrichtigungen
- Manuelle Rollback-Option über GitHub Actions

## Monitoring und Alerting

### Health Checks

- **Endpoint**: `/api/health`
- **Metriken**: Database-Status, Response-Time, Uptime
- **Monitoring**: Automatische Health-Checks nach Deployment

### Notifications

- **Slack**: Deployment-Status, Test-Failures, Security-Alerts
- **GitHub**: PR-Comments mit Coverage-Reports
- **Email**: Kritische Fehler und Security-Issues

### Coverage-Reporting

- **Codecov**: Automatische Coverage-Reports
- **Thresholds**: 80% Mindest-Coverage
- **Reports**: Unit, Integration, und E2E-Tests

## Best Practices

### Pre-commit Hooks

```bash
# Husky-Konfiguration
.husky/pre-commit    # Linting, Type-Check, Unit Tests
.husky/commit-msg    # Commit-Message-Validierung
```

### Commit-Message-Format

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore, ci, build, perf, revert
Example: feat(auth): add login functionality
```

### Branch-Strategie

- **main**: Production-ready Code
- **develop**: Development-Branch
- **feature/\***: Feature-Branches
- **hotfix/\***: Hotfix-Branches

### Test-Strategie

- **Unit Tests**: Alle Komponenten und Utilities
- **Integration Tests**: Service-Integrationen
- **E2E Tests**: Vollständige User-Journeys
- **Performance Tests**: Latenz und Throughput
- **Security Tests**: Vulnerability-Scans

## Troubleshooting

### Häufige Probleme

**1. Test-Failures**

```bash
# Lokale Test-Ausführung
npm run test:ci

# Spezifische Tests
npm run test:unit
npm run test:integration
```

**2. Build-Failures**

```bash
# Lokaler Build
npm run build

# Type-Check
npm run type-check

# Linting
npm run lint:fix
```

**3. Security-Issues**

```bash
# Security Audit
npm run security:audit

# Security Fix
npm run security:fix
```

**4. Dependency-Issues**

```bash
# Dependency Check
npm run deps:check

# Clean Install
npm run deps:clean
```

### Debug-Informationen

**Pipeline-Logs:**

- GitHub Actions → Workflows → Job-Logs
- Artefakte für Coverage-Reports und Bundle-Analysen

**Lokale Entwicklung:**

```bash
# Vollständige CI-Pipeline lokal
npm run ci:full

# Schnelle Checks
npm run ci:quick
```

## Erweiterte Konfiguration

### Custom Test-Environments

```javascript
// jest.config.js
module.exports = {
  projects: [
    {
      displayName: "unit",
      testMatch: [
        "<rootDir>/__tests__/(components|hooks|lib|utils)/**/*.test.ts",
      ],
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/__tests__/integration/**/*.test.ts"],
    },
  ],
};
```

### Performance-Benchmarks

```javascript
// __tests__/integration/performance.test.ts
describe("Performance Benchmarks", () => {
  it("should load page within 2 seconds", async () => {
    const startTime = Date.now();
    // Test implementation
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });
});
```

### Security-Scanning

```yaml
# .github/workflows/security.yml
- name: Run Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

## Fazit

Die CI/CD-Pipeline bietet:

- ✅ Automatische Tests und Qualitätssicherung
- ✅ Sichere und zuverlässige Deployments
- ✅ Umfassendes Monitoring und Alerting
- ✅ Code-Qualitäts-Überwachung
- ✅ Performance-Monitoring
- ✅ Security-Scanning
- ✅ Rollback-Fähigkeiten

Die Pipeline ist so konfiguriert, dass sie hohe Code-Qualität sicherstellt und gleichzeitig eine schnelle und zuverlässige Bereitstellung ermöglicht.
