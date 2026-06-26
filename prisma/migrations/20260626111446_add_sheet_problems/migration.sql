-- CreateTable
CREATE TABLE "SheetProblem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SheetProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SheetProblem_url_key" ON "SheetProblem"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SheetProblem_order_key" ON "SheetProblem"("order");
