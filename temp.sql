-- ADD TRIGGER TO BLOG
CREATE OR REPLACE FUNCTION generate_unique_slug() RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
BEGIN
    base_slug := regexp_replace(LOWER(NEW.title), '[^\w]+', '-', 'g');

    final_slug := base_slug;
    
    -- Check if the slug already exists
    IF EXISTS (SELECT 1 FROM your_table WHERE slug = final_slug) THEN
        final_slug := base_slug || '-' || NEW.id;
        -- suffix := suffix + 1;
    ELSE
        EXIT;
    END IF;

    NEW.slug := final_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER slugify_title
BEFORE INSERT OR UPDATE ON "Blog"
FOR EACH ROW
WHEN (NEW.title IS NOT NULL)
EXECUTE FUNCTION generate_unique_slug();