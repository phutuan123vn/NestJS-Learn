-- ADD TRIGGER TO BLOG
CREATE OR REPLACE FUNCTION generate_unique_slug() RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    suffix INT := 1;
BEGIN
    base_slug := regexp_replace(LOWER(NEW.title), '[^\w]+', '-', 'g');

    LOOP
        final_slug := base_slug;
        
        -- Check if the slug already exists
        IF EXISTS (SELECT 1 FROM your_table WHERE slug = final_slug AND id <> NEW.id) THEN
            final_slug := base_slug || '-' || suffix;
            suffix := suffix + 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;

    NEW.slug := final_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER slugify_title
BEFORE INSERT OR UPDATE ON your_table
FOR EACH ROW
WHEN (NEW.title IS NOT NULL)
EXECUTE FUNCTION generate_unique_slug();