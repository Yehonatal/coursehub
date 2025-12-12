-- ===========================================
-- Row Level Security (RLS) Policies for CourseHub
-- ===========================================
-- Final complete script for ALL tables you listed
-- ===========================================

-- Enable RLS on ALL tables
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- USERS TABLE POLICIES
-- ===========================================

CREATE POLICY "User profiles are public" ON users
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text)
WITH CHECK (
    (SELECT auth.uid())::text = user_id::text
    AND role IN ('student', 'educator')
);

CREATE POLICY "Allow user registration" ON users
FOR INSERT WITH CHECK (true);

-- ===========================================
-- RESOURCES TABLE POLICIES
-- ===========================================

CREATE POLICY "Public resources are viewable by everyone" ON resources
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload resources" ON resources
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update own resources" ON resources
FOR UPDATE USING ((SELECT auth.uid())::text = uploader_id::text);

CREATE POLICY "Users can delete own resources" ON resources
FOR DELETE USING ((SELECT auth.uid())::text = uploader_id::text);

-- ===========================================
-- RATINGS TABLE POLICIES
-- ===========================================

CREATE POLICY "Public ratings viewable" ON ratings
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate resources" ON ratings
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update own ratings" ON ratings
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can delete own ratings" ON ratings
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- Prevent rating own resource
CREATE POLICY "Users cannot rate own resources" ON ratings
FOR INSERT WITH CHECK (
    NOT EXISTS (
        SELECT 1 FROM resources r
        WHERE r.resource_id = ratings.resource_id
        AND r.uploader_id::text = (SELECT auth.uid())::text
    )
);

-- Prevent duplicate rating
CREATE POLICY "One rating per user per resource" ON ratings
FOR INSERT WITH CHECK (
    NOT EXISTS (
        SELECT 1 FROM ratings r
        WHERE r.resource_id = ratings.resource_id
        AND r.user_id::text = (SELECT auth.uid())::text
    )
);

-- ===========================================
-- COMMENTS TABLE POLICIES
-- ===========================================

CREATE POLICY "Public comments viewable" ON comments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment" ON comments
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update own comments" ON comments
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can delete own comments" ON comments
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- VERIFICATION TABLE POLICIES
-- ===========================================

CREATE POLICY "Verification status is public" ON verification
FOR SELECT USING (true);

CREATE POLICY "Educators can verify resources" ON verification
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role = 'educator'
    )
);

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

CREATE POLICY "Users can view own AI requests" ON ai_requests
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can create AI requests" ON ai_requests
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can update own AI requests" ON ai_requests
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- NOTIFICATIONS TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own notifications" ON notifications
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "System can create notifications" ON notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- SAVED RESOURCES TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own saved resources" ON saved_resources
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can save resources" ON saved_resources
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can unsave resources" ON saved_resources
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- RESOURCE TAGS TABLE POLICIES
-- ===========================================

CREATE POLICY "Resource tags are public" ON resource_tags
FOR SELECT USING (true);

CREATE POLICY "Resource owners can manage tags" ON resource_tags
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM resources r
        WHERE r.resource_id = resource_tags.resource_id
        AND r.uploader_id::text = (SELECT auth.uid())::text
    )
);

-- ===========================================
-- REPORT FLAGS POLICIES
-- ===========================================

CREATE POLICY "Report status is viewable" ON report_flags
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can report content" ON report_flags
FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can view own reports" ON report_flags
FOR SELECT USING ((SELECT auth.uid())::text = reporter_id::text);

CREATE POLICY "Moderators can update report status" ON report_flags
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE user_id::text = (SELECT auth.uid())::text
        AND role IN ('educator', 'admin')
    )
);

-- ===========================================
-- RESOURCE VIEWS POLICIES
-- ===========================================

CREATE POLICY "Allow view tracking" ON resource_views
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own view history" ON resource_views
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text OR user_id IS NULL);

-- ===========================================
-- UNIVERSITY STRUCTURE POLICIES
-- ===========================================

CREATE POLICY "University data is public" ON universities
FOR SELECT USING (true);

CREATE POLICY "Program data is public" ON programs
FOR SELECT USING (true);

CREATE POLICY "Course data is public" ON courses
FOR SELECT USING (true);

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
-- SESSIONS TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view their own sessions" ON sessions
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can create sessions" ON sessions
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can delete their own sessions" ON sessions
FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);

-- ===========================================
-- VERIFICATION TOKENS TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own verification tokens" ON verification_tokens
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "Users can create verification tokens" ON verification_tokens
FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);

CREATE POLICY "System can delete tokens" ON verification_tokens
FOR DELETE USING (true);

-- ===========================================
-- PASSWORD RESET TOKENS TABLE (NEW)
-- ===========================================

-- Users can see their own tokens
CREATE POLICY "Users can view own reset tokens" ON password_reset_tokens
FOR SELECT USING ((SELECT auth.uid())::text = user_id::text);

-- System can create tokens
CREATE POLICY "System can create reset tokens" ON password_reset_tokens
FOR INSERT WITH CHECK (true);

-- System or user can delete tokens
CREATE POLICY "Reset tokens delete" ON password_reset_tokens
FOR DELETE USING (
    (SELECT auth.uid())::text = user_id::text
    OR true
);
