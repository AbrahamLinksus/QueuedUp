-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AlterTable: add nullable first so existing rows don't fail
ALTER TABLE "Problem" ADD COLUMN "userId" TEXT;

-- Create a placeholder user for any pre-existing problems
INSERT INTO "User" ("id", "username", "passwordHash", "createdAt")
SELECT 'migration-placeholder', '__migrated__', '', NOW()
WHERE EXISTS (SELECT 1 FROM "Problem" WHERE "userId" IS NULL);

-- Assign all orphaned problems to the placeholder
UPDATE "Problem" SET "userId" = 'migration-placeholder' WHERE "userId" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "Problem" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
