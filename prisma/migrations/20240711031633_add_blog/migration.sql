-- CreateTable
CREATE TABLE "Blog" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- ADD TRIGGER TO BLOG
CREATE OR REPLACE FUNCTION generate_unique_slug() RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
BEGIN
    base_slug := regexp_replace(LOWER(NEW.title), '[^\w]+', '-', 'g');

    final_slug := base_slug;
    
    -- Check if the slug already exists
    IF EXISTS (SELECT 1 FROM "Blog" WHERE slug = final_slug AND id <> NEW.id) THEN
        final_slug := base_slug || '-' || NEW.id;
        -- suffix := suffix + 1;
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