-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_productId_fkey";

-- DropTable
DROP TABLE "Favorite";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "likesCount" INTEGER NOT NULL DEFAULT 0;
