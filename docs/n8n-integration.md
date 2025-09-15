# n8n Integration Dokumentation

## Übersicht

n8n greift direkt auf die Supabase-Datenbank zu und führt Workflows aus, die in n8n selbst entwickelt und konfiguriert werden.

## Datenbankverbindung

- **Host**: Supabase Host (aus Umgebungsvariablen)
- **Port**: 5432
- **Database**: postgres
- **Username**: postgres
- **Password**: Supabase DB Password

## Erforderliche Tabellen

n8n benötigt Zugriff auf folgende Tabellen:

- `campaigns` - Kampagnenverwaltung
- `content_items` - Content-Items
- `content_versions` - Content-Versionen
- `workflow_executions` - Workflow-Ausführungen

## Workflow-Spezifikationen

### 1. Content Generation Workflow

**Zweck**: Generiert Content basierend auf Kampagnen-Kontext

**Trigger**:

- Scheduled (regelmäßig)
- Manual (manuell)

**Datenbankoperationen**:

1. `SELECT content_items WHERE status = 'pending'`
2. `UPDATE content_items SET status = 'processing'`
3. `INSERT content_versions` mit generiertem Content
4. `UPDATE content_items SET status = 'completed'`

**Erforderliche Tabellen**: `content_items`, `content_versions`, `campaigns`

### 2. Campaign Status Update

**Zweck**: Aktualisiert Kampagnen-Status basierend auf Datum

**Trigger**:

- Scheduled (täglich)

**Datenbankoperationen**:

1. `SELECT campaigns WHERE status = 'active' AND end_date < NOW()`
2. `UPDATE campaigns SET status = 'completed'`

**Erforderliche Tabellen**: `campaigns`

### 3. Workflow Execution Tracking

**Zweck**: Verfolgt n8n Workflow-Ausführungen

**Trigger**:

- Workflow Start
- Workflow End

**Datenbankoperationen**:

1. `INSERT workflow_executions` beim Start
2. `UPDATE workflow_executions` beim Ende

**Erforderliche Tabellen**: `workflow_executions`

## Implementierung

Die eigentlichen n8n Workflows werden in n8n selbst entwickelt und konfiguriert. Diese Dokumentation dient als Referenz für die Workflow-Entwicklung.

## Test-Daten

Für die Entwicklung und das Testen der n8n Workflows können Test-Daten über die Supabase-Migrationen erstellt werden:

- `supabase/migrations/20250915000002_test_data_seed.sql`

## Sicherheit

- n8n sollte nur Lese- und Schreibzugriff auf die erforderlichen Tabellen haben
- RLS (Row Level Security) Policies sind in der Datenbank konfiguriert
- Sensible Daten sollten nicht in n8n Workflows gespeichert werden
