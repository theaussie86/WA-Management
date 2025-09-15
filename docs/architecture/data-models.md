# Data Models

Based on the PRD requirements for LinkedIn AI content automation, I've identified the core business entities that will power the content pipeline workflow. These models are designed to support the human-in-the-loop approval process while maintaining campaign context and tracking AI generation metadata.

## Campaign

**Purpose:** Represents different LinkedIn marketing contexts with distinct audiences, messaging strategies, and content themes. Enables content creators to switch between different campaign strategies seamlessly.

**Key Attributes:**
- id: UUID - Primary identifier for campaign
- name: string - Human-readable campaign name (e.g., "Tech Leadership", "Automation Industry")
- description: text - Campaign objective and target audience description
- target_audience: string - Primary audience segment being targeted
- messaging_tone: enum - Brand voice (professional, thought-leader, educational, promotional)
- content_themes: string[] - Array of content topic categories
- ai_instructions: text - Custom prompts and guidelines for AI content generation
- status: enum - active, paused, archived
- created_at: timestamp - Campaign creation date
- updated_at: timestamp - Last modification timestamp
- user_id: UUID - Foreign key to auth.users (campaign owner)

### TypeScript Interface
```typescript
interface Campaign {
  id: string;
  name: string;
  description: string;
  target_audience: string;
  messaging_tone: 'professional' | 'thought_leader' | 'educational' | 'promotional';
  content_themes: string[];
  ai_instructions: string;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
}
```

### Relationships
- One-to-many with ContentItem (campaign context for all content)
- One-to-many with PipelineStatus (tracking per campaign)
- Belongs-to User (campaign ownership)

## ContentItem

**Purpose:** Core content entity with simplified structure, focusing on pipeline state management while delegating versioning to separate table.

**Key Attributes:**
- id: UUID - Primary identifier
- campaign_id: UUID - Foreign key to campaigns
- content_type: enum - trending_topic, content_idea, draft_post, creative_asset
- stage: enum - research, ideation, drafting, creative, queued, published, rejected
- current_version_id: UUID - Foreign key to current active content version
- approval_status: enum - pending, approved, rejected, needs_revision
- linkedin_post_id: string - LinkedIn API post identifier after publishing
- created_at: timestamp - Initial creation
- approved_at: timestamp - Human approval timestamp
- published_at: timestamp - LinkedIn publishing timestamp
- user_id: UUID - Foreign key to auth.users

### TypeScript Interface
```typescript
interface ContentItem {
  id: string;
  campaign_id: string;
  content_type: 'trending_topic' | 'content_idea' | 'draft_post' | 'creative_asset';
  stage: 'research' | 'ideation' | 'drafting' | 'creative' | 'queued' | 'published' | 'rejected';
  current_version_id?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  linkedin_post_id?: string;
  created_at: string;
  approved_at?: string;
  published_at?: string;
  user_id: string;
}
```

### Relationships
- Belongs-to Campaign (content context)
- One-to-many with ContentVersion (content evolution)
- One-to-many with WorkflowExecution (AI generation history)
- Belongs-to User (content ownership)

## ContentVersion

**Purpose:** Stores all versions of content as it evolves through AI generation and human editing. Provides complete audit trail and rollback capabilities.

**Key Attributes:**
- id: UUID - Primary identifier for this version
- content_item_id: UUID - Foreign key to content_items
- version_number: integer - Sequential version (1, 2, 3...)
- version_type: enum - ai_generated, human_edited, ai_regenerated, final_approved
- content_data: jsonb - The actual content (text, images, metadata)
- generation_source: string - AI service used or "human_edit"
- editor_notes: text - Human comments about changes made
- created_by: enum - ai_workflow, human_user
- created_at: timestamp - Version creation time
- workflow_execution_id: UUID - Foreign key to workflow_executions (if AI-generated)

### TypeScript Interface
```typescript
interface ContentVersion {
  id: string;
  content_item_id: string;
  version_number: number;
  version_type: 'ai_generated' | 'human_edited' | 'ai_regenerated' | 'final_approved';
  content_data: {
    text?: string;
    image_urls?: string[];
    hashtags?: string[];
    ai_metadata?: {
      prompt_used: string;
      model: string;
      temperature: number;
      confidence_score: number;
    };
    human_metadata?: {
      changes_made: string[];
      editor_notes: string;
    };
  };
  generation_source: string;
  editor_notes?: string;
  created_by: 'ai_workflow' | 'human_user';
  created_at: string;
  workflow_execution_id?: string;
}
```

## WorkflowExecution

**Purpose:** Tracks n8n workflow executions for AI content generation, providing audit trail and debugging information for automation reliability. Essential for monitoring AI service performance and costs.

**Key Attributes:**
- id: UUID - Primary identifier for workflow execution
- content_item_id: UUID - Foreign key to content_items table
- workflow_name: string - n8n workflow identifier
- execution_status: enum - running, completed, failed, cancelled
- input_data: jsonb - Data sent to n8n workflow
- output_data: jsonb - Results returned from workflow
- error_message: text - Error details if execution failed
- ai_service_used: string - Which AI service was called (OpenAI, Claude, etc.)
- execution_duration: integer - Time in milliseconds for completion
- cost_estimate: decimal - Estimated cost of AI service usage
- started_at: timestamp - Workflow execution start time
- completed_at: timestamp - Workflow execution completion time

### TypeScript Interface
```typescript
interface WorkflowExecution {
  id: string;
  content_item_id: string;
  workflow_name: string;
  execution_status: 'running' | 'completed' | 'failed' | 'cancelled';
  input_data: {
    campaign_context: Campaign;
    prompt_template: string;
    previous_content?: ContentItem[];
    parameters: Record<string, any>;
  };
  output_data?: {
    generated_content: any;
    ai_metadata: Record<string, any>;
    processing_time: number;
  };
  error_message?: string;
  ai_service_used: string;
  execution_duration?: number;
  cost_estimate?: number;
  started_at: string;
  completed_at?: string;
}
```

### Relationships
- Belongs-to ContentItem (workflow target)
- Links to external n8n execution logs

## ContentPerformance

**Purpose:** Time-series tracking of LinkedIn post performance metrics. Enables trend analysis and campaign optimization through data-driven insights.

**Key Attributes:**
- id: UUID - Primary identifier
- content_item_id: UUID - Foreign key to content_items
- metric_date: date - Date these metrics were recorded
- likes_count: integer - Total likes at recording time
- comments_count: integer - Total comments at recording time
- shares_count: integer - Total shares/reposts at recording time
- impressions: integer - Total impressions (if available from LinkedIn API)
- click_through_rate: decimal - CTR if tracking links included
- engagement_rate: decimal - Calculated engagement percentage
- recorded_at: timestamp - When these metrics were captured

### TypeScript Interface
```typescript
interface ContentPerformance {
  id: string;
  content_item_id: string;
  metric_date: string; // ISO date
  likes_count: number;
  comments_count: number;
  shares_count: number;
  impressions?: number;
  click_through_rate?: number;
  engagement_rate: number;
  recorded_at: string;
}
```

### Relationships
- Belongs-to ContentItem (performance tracking target)
- Enables time-series queries for performance trending

## UserPreferences

**Purpose:** Stores user-specific settings for AI content generation, approval workflow preferences, and LinkedIn integration configuration. Enables personalization of the automation system.

**Key Attributes:**
- id: UUID - Primary identifier
- user_id: UUID - Foreign key to auth.users
- default_campaign_id: UUID - Foreign key to campaigns (default context)
- ai_creativity_level: integer - Scale 1-10 for AI generation creativity
- auto_approve_threshold: decimal - Confidence score for automatic approvals
- notification_preferences: jsonb - When and how to notify about content
- linkedin_integration: jsonb - LinkedIn API tokens and publishing settings
- brand_guidelines: jsonb - Consistent messaging and style preferences
- content_scheduling: jsonb - Preferred posting times and frequency
- updated_at: timestamp - Last preference modification

### TypeScript Interface
```typescript
interface UserPreferences {
  id: string;
  user_id: string;
  default_campaign_id?: string;
  ai_creativity_level: number; // 1-10 scale
  auto_approve_threshold?: number; // 0.0-1.0 confidence score
  notification_preferences: {
    email_notifications: boolean;
    browser_notifications: boolean;
    daily_summary: boolean;
    urgent_approvals_only: boolean;
  };
  linkedin_integration: {
    access_token?: string;
    profile_id: string;
    company_pages: string[];
    publishing_enabled: boolean;
  };
  brand_guidelines: {
    prohibited_words: string[];
    required_hashtags: string[];
    tone_preferences: string[];
    style_guide_url?: string;
  };
  content_scheduling: {
    preferred_posting_times: string[];
    max_posts_per_day: number;
    avoid_weekends: boolean;
    timezone: string;
  };
  updated_at: string;
}
```

### Relationships
- Belongs-to User (preference ownership)
- References Campaign (default context)
