-- Public read access: the policy text is not sensitive and the client fetches it
-- directly (same exposure as the previous unauthenticated server route).
CREATE POLICY "privacy_policies_select" ON privacy_policies
  FOR SELECT USING (true);
