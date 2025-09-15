-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Migration created: 2025-09-15

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_audience VARCHAR(500) NOT NULL,
    messaging_tone VARCHAR(50) CHECK (messaging_tone IN ('professional', 'thought_leader', 'educational', 'promotional')),
    content_themes TEXT[] DEFAULT '{}',
    ai_instructions TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Indexes for performance
    CONSTRAINT campaigns_name_user_unique UNIQUE (name, user_id)
);

CREATE INDEX idx_campaigns_user_status ON campaigns(user_id, status);
CREATE INDEX idx_campaigns_updated_at ON campaigns(updated_at DESC);

-- Content items table
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('trending_topic', 'content_idea', 'draft_post', 'creative_asset')),
    stage VARCHAR(50) NOT NULL CHECK (stage IN ('research', 'ideation', 'drafting', 'creative', 'queued', 'published', 'rejected')),
    current_version_id UUID, -- FK to content_versions, will be set after versions table creation
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    linkedin_post_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_content_items_campaign_stage ON content_items(campaign_id, stage);
CREATE INDEX idx_content_items_user_status ON content_items(user_id, approval_status);
CREATE INDEX idx_content_items_created_at ON content_items(created_at DESC);

-- Workflow executions table
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    workflow_name VARCHAR(255) NOT NULL,
    execution_status VARCHAR(50) DEFAULT 'running' CHECK (execution_status IN ('running', 'completed', 'failed', 'cancelled')),
    input_data JSONB NOT NULL DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    ai_service_used VARCHAR(100),
    execution_duration INTEGER, -- milliseconds
    cost_estimate DECIMAL(10,4),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_workflow_executions_content_item ON workflow_executions(content_item_id);
CREATE INDEX idx_workflow_executions_status_started ON workflow_executions(execution_status, started_at DESC);

-- Content versions table
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    version_type VARCHAR(50) NOT NULL CHECK (version_type IN ('ai_generated', 'human_edited', 'ai_regenerated', 'final_approved')),
    content_data JSONB NOT NULL DEFAULT '{}',
    generation_source VARCHAR(255),
    editor_notes TEXT,
    created_by VARCHAR(50) NOT NULL CHECK (created_by IN ('ai_workflow', 'human_user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    workflow_execution_id UUID REFERENCES workflow_executions(id),

    -- Ensure version numbers are sequential per content item
    CONSTRAINT content_versions_item_version_unique UNIQUE (content_item_id, version_number)
);

CREATE INDEX idx_content_versions_content_item_version ON content_versions(content_item_id, version_number DESC);
CREATE INDEX idx_content_versions_type_created ON content_versions(version_type, created_at DESC);

-- Now add the foreign key constraint to content_items
ALTER TABLE content_items
ADD CONSTRAINT fk_content_items_current_version
FOREIGN KEY (current_version_id) REFERENCES content_versions(id);

-- Content performance table
CREATE TABLE content_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    impressions INTEGER,
    click_through_rate DECIMAL(5,4),
    engagement_rate DECIMAL(5,4),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate metrics for same content/date
    CONSTRAINT content_performance_item_date_unique UNIQUE (content_item_id, metric_date)
);

CREATE INDEX idx_content_performance_item_date ON content_performance(content_item_id, metric_date DESC);
CREATE INDEX idx_content_performance_recorded_at ON content_performance(recorded_at DESC);

-- User preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    default_campaign_id UUID REFERENCES campaigns(id),
    ai_creativity_level INTEGER DEFAULT 5 CHECK (ai_creativity_level BETWEEN 1 AND 10),
    auto_approve_threshold DECIMAL(3,2) CHECK (auto_approve_threshold BETWEEN 0.0 AND 1.0),
    notification_preferences JSONB DEFAULT '{}',
    linkedin_integration JSONB DEFAULT '{}',
    brand_guidelines JSONB DEFAULT '{}',
    content_scheduling JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Users can view own campaigns" ON campaigns
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own campaigns" ON campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- Content items policies (inherit from campaign ownership)
CREATE POLICY "Users can view own content items" ON content_items
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own content items" ON content_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own content items" ON content_items
    FOR UPDATE USING (auth.uid() = user_id);

-- Content versions policies (inherit from content item ownership)
CREATE POLICY "Users can view own content versions" ON content_versions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM content_items WHERE content_items.id = content_versions.content_item_id AND content_items.user_id = auth.uid())
    );

-- Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set version numbers
CREATE OR REPLACE FUNCTION set_content_version_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.version_number = COALESCE(
        (SELECT MAX(version_number) + 1 FROM content_versions WHERE content_item_id = NEW.content_item_id),
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_set_version_number
    BEFORE INSERT ON content_versions
    FOR EACH ROW EXECUTE FUNCTION set_content_version_number();

-- Optimized indexes for content pipeline queries
CREATE INDEX CONCURRENTLY idx_content_pipeline_dashboard
ON content_items (user_id, stage, approval_status, created_at DESC)
WHERE stage != 'archived';

-- Partial indexes for active workflows
CREATE INDEX CONCURRENTLY idx_active_workflows
ON workflow_executions (content_item_id, execution_status, started_at DESC)
WHERE execution_status IN ('running', 'failed');

-- Performance metrics aggregation view
CREATE MATERIALIZED VIEW campaign_performance_summary AS
SELECT
    c.id as campaign_id,
    c.name as campaign_name,
    COUNT(ci.id) as total_content,
    COUNT(CASE WHEN ci.stage = 'published' THEN 1 END) as published_content,
    AVG(cp.engagement_rate) as avg_engagement_rate,
    SUM(cp.likes_count) as total_likes,
    SUM(cp.comments_count) as total_comments,
    MAX(cp.recorded_at) as last_updated
FROM campaigns c
LEFT JOIN content_items ci ON c.id = ci.campaign_id
LEFT JOIN content_performance cp ON ci.id = cp.content_item_id
GROUP BY c.id, c.name;

-- Refresh materialized view daily
CREATE OR REPLACE FUNCTION refresh_campaign_performance()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY campaign_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule daily refresh via pg_cron
SELECT cron.schedule('refresh-campaign-performance', '0 1 * * *', 'SELECT refresh_campaign_performance();');
