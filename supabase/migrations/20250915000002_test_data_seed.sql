-- Test data seeding for development and testing
-- This migration should only be used in test environments
-- Migration created: 2025-09-15

-- Insert test users (these will be created by Supabase Auth in real scenarios)
-- For testing purposes, we'll create test data that references auth.users

-- Test campaigns
INSERT INTO campaigns (id, name, description, target_audience, messaging_tone, content_themes, ai_instructions, status, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Tech Innovation Campaign', 'Focus on emerging technologies and innovation trends', 'Tech professionals and entrepreneurs', 'thought_leader', ARRAY['AI', 'Innovation', 'Technology'], 'Focus on cutting-edge technology trends and their business implications', 'active', '00000000-0000-0000-0000-000000000001'),
('550e8400-e29b-41d4-a716-446655440002', 'Marketing Automation', 'Content about marketing automation tools and strategies', 'Marketing professionals', 'professional', ARRAY['Marketing', 'Automation', 'Strategy'], 'Provide practical insights on marketing automation implementation', 'active', '00000000-0000-0000-0000-000000000001'),
('550e8400-e29b-41d4-a716-446655440003', 'Leadership Development', 'Content for developing leadership skills', 'Mid-level managers and executives', 'educational', ARRAY['Leadership', 'Management', 'Development'], 'Focus on practical leadership development strategies', 'paused', '00000000-0000-0000-0000-000000000001');

-- Test content items
INSERT INTO content_items (id, campaign_id, content_type, stage, approval_status, created_at, user_id) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'draft_post', 'drafting', 'pending', NOW() - INTERVAL '2 days', '00000000-0000-0000-0000-000000000001'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'content_idea', 'ideation', 'approved', NOW() - INTERVAL '1 day', '00000000-0000-0000-0000-000000000001'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'draft_post', 'published', 'approved', NOW() - INTERVAL '3 days', '00000000-0000-0000-0000-000000000001'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'trending_topic', 'research', 'pending', NOW() - INTERVAL '1 day', '00000000-0000-0000-0000-000000000001'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'draft_post', 'drafting', 'needs_revision', NOW() - INTERVAL '4 hours', '00000000-0000-0000-0000-000000000001');

-- Test workflow executions
INSERT INTO workflow_executions (id, content_item_id, workflow_name, execution_status, input_data, output_data, ai_service_used, execution_duration, started_at, completed_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'content_generation', 'completed', '{"prompt": "Write about AI trends", "tone": "thought_leader"}', '{"content": "AI is transforming industries...", "confidence": 0.85}', 'gpt-4', 2500, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '2.5 seconds'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'content_ideation', 'completed', '{"theme": "Innovation", "audience": "Tech professionals"}', '{"ideas": ["Future of AI", "Blockchain applications"], "count": 2}', 'gpt-4', 1800, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '1.8 seconds'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'content_optimization', 'failed', '{"content": "Original content", "optimization_type": "engagement"}', '{}', 'gpt-4', 5000, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '5 seconds');

-- Test content versions
INSERT INTO content_versions (id, content_item_id, version_number, version_type, content_data, generation_source, created_by, workflow_execution_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1, 'ai_generated', '{"title": "The Future of AI in Business", "content": "Artificial Intelligence is revolutionizing how businesses operate...", "hashtags": ["#AI", "#Business", "#Innovation"]}', 'gpt-4', 'ai_workflow', '770e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 2, 'human_edited', '{"title": "The Future of AI in Business", "content": "Artificial Intelligence is revolutionizing how businesses operate and compete...", "hashtags": ["#AI", "#Business", "#Innovation", "#Future"]}', 'human_editor', 'human_user', NULL),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 1, 'ai_generated', '{"ideas": ["The Future of AI in Business", "Blockchain Revolution", "Quantum Computing Impact"], "descriptions": ["Exploring AI trends", "Blockchain applications", "Quantum computing potential"]}', 'gpt-4', 'ai_workflow', '770e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 1, 'ai_generated', '{"title": "Marketing Automation Best Practices", "content": "Marketing automation can significantly improve your campaign effectiveness...", "hashtags": ["#Marketing", "#Automation", "#Strategy"]}', 'gpt-4', 'ai_workflow', NULL),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 2, 'final_approved', '{"title": "Marketing Automation Best Practices", "content": "Marketing automation can significantly improve your campaign effectiveness and ROI...", "hashtags": ["#Marketing", "#Automation", "#Strategy", "#ROI"]}', 'human_editor', 'human_user', NULL);

-- Update content items with current version references
UPDATE content_items SET current_version_id = '880e8400-e29b-41d4-a716-446655440002' WHERE id = '660e8400-e29b-41d4-a716-446655440001';
UPDATE content_items SET current_version_id = '880e8400-e29b-41d4-a716-446655440003' WHERE id = '660e8400-e29b-41d4-a716-446655440002';
UPDATE content_items SET current_version_id = '880e8400-e29b-41d4-a716-446655440005' WHERE id = '660e8400-e29b-41d4-a716-446655440003';

-- Test content performance data
INSERT INTO content_performance (id, content_item_id, metric_date, likes_count, comments_count, shares_count, impressions, click_through_rate, engagement_rate) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '1 day', 45, 12, 8, 1250, 0.036, 0.052),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '2 days', 38, 9, 6, 980, 0.031, 0.054),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '3 days', 52, 15, 11, 1450, 0.041, 0.054);

-- Test user preferences
INSERT INTO user_preferences (id, user_id, default_campaign_id, ai_creativity_level, auto_approve_threshold, notification_preferences, linkedin_integration, brand_guidelines, content_scheduling) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', 7, 0.8, '{"email": true, "push": false, "weekly_summary": true}', '{"connected": true, "last_sync": "2024-12-19T10:00:00Z"}', '{"tone": "professional", "brand_voice": "authoritative", "avoid_topics": ["politics"]}', '{"timezone": "UTC", "optimal_posting_times": ["09:00", "13:00", "17:00"]}');

-- Refresh the materialized view with test data
REFRESH MATERIALIZED VIEW campaign_performance_summary;
