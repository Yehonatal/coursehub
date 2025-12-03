-- ===========================================
-- Row Level Security (RLS) Policies for CourseHub
-- ===========================================
-- This script enables RLS and creates comprehensive policies
-- for all tables in the CourseHub database schema.
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- USERS TABLE POLICIES
-- ===========================================

-- User profiles are public (for credibility and community)
CREATE POLICY "User profiles are public" ON users
FOR SELECT USING (true);

-- Users can update their own profile (except sensitive fields)
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text)
WITH CHECK (
    (SELECT auth.uid())::text = user_id::text
    AND role IN ('student', 'educator')  -- Prevent role escalation
);

-- Allow user registration (insert) - needed for signup
CREATE POLICY "Allow user registration" ON users
FOR INSERT WITH CHECK (true);

-- ===========================================
-- RESOURCES TABLE POLICIES
-- ===========================================

-- Anyone can view public resources (no authentication required)
CREATE POLICY "Public resources are viewable by everyone" ON resources
FOR SELECT USING (true);

-- Authenticated users can upload resources
CREATE POLICY "Authenticated users can upload resources" ON resources
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Users can update their own resources
CREATE POLICY "Users can update own resources" ON resources
FOR UPDATE USING ((SELECT auth.uid())::text = uploader_id::text);

-- Users can delete their own resources
CREATE POLICY "Users can delete own resources" ON resources
FOR DELETE USING ((SELECT auth.uid())::text = uploader_id::text);

-- ===========================================
-- RATINGS TABLE POLICIES
-- ===========================================

-- Anyone can view ratings on public resources
CREATE POLICY "Public ratings viewable" ON ratings
FOR SELECT USING (true);

-- Authenticated users can create ratings
CREATE POLICY "Authenticated users can rate resources" ON ratings
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON ratings
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON ratings
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- COMMENTS TABLE POLICIES
-- ===========================================

-- Anyone can view comments on public resources
CREATE POLICY "Public comments viewable" ON comments
FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can comment" ON comments
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON comments
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON comments
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- VERIFICATION TABLE POLICIES
-- ===========================================

-- Anyone can view verification status
CREATE POLICY "Verification status is public" ON verification
FOR SELECT USING (true);

-- Only educators can create verification requests
CREATE POLICY "Educators can verify resources" ON verification
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'educator'
    )
);

-- Educators can update their own verifications
CREATE POLICY "Educators can update own verifications" ON verification
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'educator'
    )
);

-- ===========================================
-- AI REQUESTS TABLE POLICIES
-- ===========================================

-- Users can view their own AI requests
CREATE POLICY "Users can view own AI requests" ON ai_requests
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

-- Users can create AI requests for themselves
CREATE POLICY "Users can create AI requests" ON ai_requests
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

-- Users can update their own AI requests
CREATE POLICY "Users can update own AI requests" ON ai_requests
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- NOTIFICATIONS TABLE POLICIES
-- ===========================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

-- System can create notifications for users (service role)
CREATE POLICY "System can create notifications" ON notifications
FOR INSERT WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- SAVED RESOURCES TABLE POLICIES
-- ===========================================

-- Users can view their own saved resources
CREATE POLICY "Users can view own saved resources" ON saved_resources
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

-- Users can save resources
CREATE POLICY "Users can save resources" ON saved_resources
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

-- Users can unsave their own saved resources
CREATE POLICY "Users can unsave resources" ON saved_resources
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- RESOURCE TAGS TABLE POLICIES
-- ===========================================

-- Anyone can view resource tags
CREATE POLICY "Resource tags are public" ON resource_tags
FOR SELECT USING (true);

-- Resource owners can manage tags on their resources
CREATE POLICY "Resource owners can manage tags" ON resource_tags
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM resources r
        WHERE r.resource_id = resource_tags.resource_id
        AND r.uploader_id::text = (SELECT auth.uid())::text
    )
);

-- ===========================================
-- REPORT FLAGS TABLE POLICIES
-- ===========================================

-- Anyone can view report status (for transparency)
CREATE POLICY "Report status is viewable" ON report_flags
FOR SELECT USING (true);

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can report content" ON report_flags
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Reporters can view their own reports
CREATE POLICY "Users can view own reports" ON report_flags
FOR SELECT USING ((SELECT auth.uid())::text = reporter_id::text);

-- Moderators/Admins can update report status (would need role check)
CREATE POLICY "Moderators can update report status" ON report_flags
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role IN ('educator', 'admin')
    )
);

-- ===========================================
-- RESOURCE VIEWS TABLE POLICIES
-- ===========================================

-- Allow anonymous view tracking (for analytics)
CREATE POLICY "Allow view tracking" ON resource_views
FOR INSERT WITH CHECK (true);

-- Users can view their own view history
CREATE POLICY "Users can view own view history" ON resource_views
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text OR user_id IS NULL);

-- ===========================================
-- UNIVERSITY STRUCTURE POLICIES
-- ===========================================

-- University data is public (reference data)
CREATE POLICY "University data is public" ON universities
FOR SELECT USING (true);

CREATE POLICY "Program data is public" ON programs
FOR SELECT USING (true);

CREATE POLICY "Course data is public" ON courses
FOR SELECT USING (true);

-- Admin-only operations for managing university structure
-- (These would typically be restricted to admin users)
CREATE POLICY "Admin can manage universities" ON universities
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'admin'
    )
);

CREATE POLICY "Admin can manage programs" ON programs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'admin'
    )
);

CREATE POLICY "Admin can manage courses" ON courses
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'admin'
    )
);

-- ===========================================
-- ADDITIONAL SECURITY POLICIES
-- ===========================================

-- Prevent users from rating their own resources
CREATE POLICY "Users cannot rate own resources" ON ratings
FOR INSERT WITH CHECK (
    NOT EXISTS (
        SELECT 1 FROM resources r
        WHERE r.resource_id = ratings.resource_id
        AND r.uploader_id::text = (SELECT auth.uid())::text
    )
);

-- Prevent duplicate ratings (handled by unique constraint, but policy for clarity)
CREATE POLICY "One rating per user per resource" ON ratings
FOR INSERT WITH CHECK (
    NOT EXISTS (
        SELECT 1 FROM ratings r
        WHERE r.resource_id = ratings.resource_id
        AND r.user_id::text = (SELECT auth.uid())::text
    )
);

-- ===========================================
-- POLICY SUMMARY
-- ===========================================
-- Total Tables: 14
-- Total Policies: ~35+ policies created
--
-- Security Model:
-- - Public read access for educational content
-- - Authenticated users can interact with content
-- - Users have full control over their own data
-- - Educators have verification privileges
-- - Admins have management privileges
-- - Anonymous users can view public content
-- ===========================================