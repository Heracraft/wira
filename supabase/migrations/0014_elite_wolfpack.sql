ALTER TABLE "waitlist" DROP COLUMN "status";

--> Added manually since drizzle does not support defininng triggers
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."searchVector" := to_tsvector(
    'english',
    COALESCE(NEW."fullName", '') || ' ' ||
    COALESCE(array_to_string(NEW.skills, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW."industryInterests", ' '), '') || ' ' ||
    COALESCE(NEW.country, '') || ' ' ||
    COALESCE(NEW.region, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
BEFORE INSERT OR UPDATE ON "talentProfiles"
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

--> Index for search vector
CREATE INDEX idx_talent_profiles_search_vector
ON "talentProfiles"
USING GIN ("searchVector"); --> Another unsupported thing: index types