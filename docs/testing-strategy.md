# Differenzierte Teststrategie

## Übersicht

Diese Teststrategie unterscheidet zwischen verschiedenen Code-Bereichen und legt unterschiedliche Testabdeckungsanforderungen fest, basierend auf der Wichtigkeit und dem Risiko des jeweiligen Codes.

## Testkategorien

### 1. Shadcn UI Komponenten (Niedrige Priorität)

**Pfad:** `components/ui/**/*.{js,jsx,ts,tsx}`
**Grenzwerte:**

- Branches: 10%
- Functions: 15%
- Lines: 15%
- Statements: 15%

**Begründung:** Diese Komponenten sind bereits von Shadcn getestet und stabil. Wir benötigen nur grundlegende Tests, um sicherzustellen, dass sie korrekt integriert sind.

### 2. Eigene Komponenten (Mittlere Priorität)

**Pfad:** `components/**/*.{js,jsx,ts,tsx}` (außer ui/)
**Grenzwerte:**

- Branches: 40%
- Functions: 50%
- Lines: 50%
- Statements: 50%

**Begründung:** Diese Komponenten enthalten unsere eigene Business-Logik und UI-Interaktionen. Sie sind wichtig, aber weniger kritisch als Lib-Code.

### 3. Lib Code (Hohe Priorität)

**Pfad:** `lib/**/*.{js,jsx,ts,tsx}`
**Grenzwerte:**

- Branches: 80%
- Functions: 85%
- Lines: 85%
- Statements: 85%

**Begründung:** Lib-Code enthält die Kern-Business-Logik und ist kritisch für die Stabilität der Anwendung. Hohe Testabdeckung ist essentiell.

### 4. Hooks (Hohe Priorität)

**Pfad:** `hooks/**/*.{js,jsx,ts,tsx}`
**Grenzwerte:**

- Branches: 80%
- Functions: 85%
- Lines: 85%
- Statements: 85%

**Begründung:** Hooks enthalten wiederverwendbare Logik und sind oft kritisch für die Funktionalität der Anwendung.

## Verfügbare Test-Scripts

### Spezifische Kategorien

```bash
# Shadcn UI Komponenten
npm run test:ui-components

# Eigene Komponenten
npm run test:custom-components

# Lib Code
npm run test:lib

# Hooks
npm run test:hooks
```

### Kombinierte Tests

```bash
# Alle Komponenten
npm run test:components

# Kritische Bereiche (lib + hooks)
npm run test:critical

# Alle Tests
npm run test:ci
```

### CI/CD Scripts

```bash
# Schnelle CI (nur kritische Bereiche)
npm run ci:quick

# Komponenten-spezifische CI
npm run ci:components

# Vollständige CI
npm run ci:full
```

## Jest-Konfigurationen

### Hauptkonfiguration (`jest.config.js`)

- Enthält alle Kategorien mit differenzierten Grenzwerten
- Verwendet für allgemeine Tests

### Kritische Bereiche (`jest.config.critical.js`)

- Fokussiert auf lib/ und hooks/
- Hohe Grenzwerte für maximale Stabilität

### Komponenten (`jest.config.components.js`)

- Fokussiert auf components/
- Differenzierte Grenzwerte für UI vs. eigene Komponenten

## Best Practices

### Für Lib-Code

- Schreibe umfassende Unit-Tests
- Teste alle Edge-Cases
- Verwende Mocking für externe Abhängigkeiten
- Ziel: 85%+ Abdeckung

### Für Hooks

- Teste alle Hook-Zustände
- Teste Cleanup-Funktionen
- Teste Error-Handling
- Ziel: 85%+ Abdeckung

### Für Eigene Komponenten

- Teste User-Interaktionen
- Teste Props-Handling
- Teste Conditional Rendering
- Ziel: 50%+ Abdeckung

### Für Shadcn UI Komponenten

- Teste grundlegende Integration
- Teste Props-Weiterleitung
- Ziel: 15%+ Abdeckung

## CI/CD Integration

Die CI-Pipeline nutzt die differenzierte Strategie:

1. **Code Quality Checks** - Linting und Type-Checking
2. **Unit Tests** - Alle Kategorien mit jeweiligen Grenzwerten
3. **Integration Tests** - End-to-End Funktionalität
4. **Build** - Produktions-Build
5. **Security Scan** - Sicherheitsprüfungen

## Monitoring

Überwache die Testabdeckung regelmäßig:

```bash
# Vollständiger Coverage-Report
npm run test:coverage

# Spezifische Kategorie
npm run test:lib -- --coverage
```

## Migration

Beim Hinzufügen neuer Tests:

1. Identifiziere die Kategorie des Codes
2. Verwende die entsprechenden Grenzwerte
3. Fokussiere auf die wichtigsten Bereiche (lib, hooks)
4. Verwende die passenden Test-Scripts

## Vorteile

- **Effizienz:** Fokus auf kritische Bereiche
- **Flexibilität:** Unterschiedliche Anforderungen je nach Code-Typ
- **Wartbarkeit:** Klare Struktur und Erwartungen
- **Qualität:** Hohe Standards für kritischen Code
