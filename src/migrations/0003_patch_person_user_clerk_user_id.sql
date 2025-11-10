ALTER TABLE "person_user"
ADD COLUMN IF NOT EXISTS "clerk_user_id" varchar(255);

UPDATE "person_user"
SET "clerk_user_id" = CONCAT('legacy-', "id")
WHERE "clerk_user_id" IS NULL;

ALTER TABLE "person_user"
ALTER COLUMN "clerk_user_id" SET NOT NULL;

ALTER TABLE "person_user"
DROP CONSTRAINT IF EXISTS "person_user_clerk_user_id_unique";

CREATE UNIQUE INDEX IF NOT EXISTS "person_user_clerk_user_id_unique_idx"
ON "person_user" ("clerk_user_id");

ALTER TABLE "person_user"
ADD CONSTRAINT "person_user_clerk_user_id_unique"
UNIQUE USING INDEX "person_user_clerk_user_id_unique_idx";

