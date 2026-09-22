/*
# SecureNorm AI — RLS Policies + Auth Trigger

Enables RLS on all tables and creates tenant-isolated policies.
Also creates the trigger that auto-creates a tenant + profile + settings
row when a new user signs up.
*/

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_chains ENABLE ROW LEVEL SECURITY;

-- tenants
DROP POLICY IF EXISTS "select_own_tenant" ON tenants;
CREATE POLICY "select_own_tenant" ON tenants FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenants.id)
  );

DROP POLICY IF EXISTS "update_own_tenant" ON tenants;
CREATE POLICY "update_own_tenant" ON tenants FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenants.id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = tenants.id)
  );

-- profiles
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- devices
DROP POLICY IF EXISTS "select_own_devices" ON devices;
CREATE POLICY "select_own_devices" ON devices FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = devices.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_devices" ON devices;
CREATE POLICY "insert_own_devices" ON devices
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = devices.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_devices" ON devices;
CREATE POLICY "update_own_devices" ON devices FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = devices.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = devices.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_devices" ON devices;
CREATE POLICY "delete_own_devices" ON devices FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = devices.tenant_id)
  );

-- findings
DROP POLICY IF EXISTS "select_own_findings" ON findings;
CREATE POLICY "select_own_findings" ON findings FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = findings.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_findings" ON findings;
CREATE POLICY "insert_own_findings" ON findings
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = findings.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_findings" ON findings;
CREATE POLICY "update_own_findings" ON findings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = findings.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = findings.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_findings" ON findings;
CREATE POLICY "delete_own_findings" ON findings FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = findings.tenant_id)
  );

-- scans
DROP POLICY IF EXISTS "select_own_scans" ON scans;
CREATE POLICY "select_own_scans" ON scans FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = scans.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_scans" ON scans;
CREATE POLICY "insert_own_scans" ON scans
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = scans.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_scans" ON scans;
CREATE POLICY "update_own_scans" ON scans FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = scans.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = scans.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_scans" ON scans;
CREATE POLICY "delete_own_scans" ON scans FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = scans.tenant_id)
  );

-- remediations
DROP POLICY IF EXISTS "select_own_remediations" ON remediations;
CREATE POLICY "select_own_remediations" ON remediations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = remediations.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_remediations" ON remediations;
CREATE POLICY "insert_own_remediations" ON remediations
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = remediations.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_remediations" ON remediations;
CREATE POLICY "update_own_remediations" ON remediations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = remediations.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = remediations.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_remediations" ON remediations;
CREATE POLICY "delete_own_remediations" ON remediations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = remediations.tenant_id)
  );

-- reports
DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = reports.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_reports" ON reports;
CREATE POLICY "insert_own_reports" ON reports
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = reports.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_reports" ON reports;
CREATE POLICY "update_own_reports" ON reports FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = reports.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = reports.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_reports" ON reports;
CREATE POLICY "delete_own_reports" ON reports FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = reports.tenant_id)
  );

-- notifications
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = notifications.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = notifications.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = notifications.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = notifications.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = notifications.tenant_id)
  );

-- audit_logs
DROP POLICY IF EXISTS "select_own_audit_logs" ON audit_logs;
CREATE POLICY "select_own_audit_logs" ON audit_logs FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = audit_logs.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_audit_logs" ON audit_logs;
CREATE POLICY "insert_own_audit_logs" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = audit_logs.tenant_id)
  );

-- settings
DROP POLICY IF EXISTS "select_own_settings" ON settings;
CREATE POLICY "select_own_settings" ON settings FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = settings.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_settings" ON settings;
CREATE POLICY "insert_own_settings" ON settings
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = settings.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_settings" ON settings;
CREATE POLICY "update_own_settings" ON settings FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = settings.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = settings.tenant_id)
  );

-- simulations
DROP POLICY IF EXISTS "select_own_simulations" ON simulations;
CREATE POLICY "select_own_simulations" ON simulations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = simulations.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_simulations" ON simulations;
CREATE POLICY "insert_own_simulations" ON simulations
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = simulations.tenant_id)
  );

DROP POLICY IF EXISTS "delete_own_simulations" ON simulations;
CREATE POLICY "delete_own_simulations" ON simulations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = simulations.tenant_id)
  );

-- evidence_chains
DROP POLICY IF EXISTS "select_own_evidence_chains" ON evidence_chains;
CREATE POLICY "select_own_evidence_chains" ON evidence_chains FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = evidence_chains.tenant_id)
  );

DROP POLICY IF EXISTS "insert_own_evidence_chains" ON evidence_chains;
CREATE POLICY "insert_own_evidence_chains" ON evidence_chains
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = evidence_chains.tenant_id)
  );

DROP POLICY IF EXISTS "update_own_evidence_chains" ON evidence_chains;
CREATE POLICY "update_own_evidence_chains" ON evidence_chains FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = evidence_chains.tenant_id)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.tenant_id = evidence_chains.tenant_id)
  );

-- Auth trigger: auto-create tenant + profile + settings on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_tenant_id uuid;
  new_tenant_name text;
  new_owner_name text;
BEGIN
  new_tenant_name := COALESCE(NEW.raw_user_meta_data->>'company_name', NEW.email);
  new_owner_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO tenants (name, owner_name)
  VALUES (new_tenant_name, new_owner_name)
  RETURNING id INTO new_tenant_id;

  INSERT INTO profiles (id, tenant_id, email, full_name, role, timezone)
  VALUES (
    NEW.id,
    new_tenant_id,
    NEW.email,
    new_owner_name,
    'Owner',
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC')
  );

  INSERT INTO settings (tenant_id)
  VALUES (new_tenant_id);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
