-- AlterTable
ALTER TABLE "Order" ADD COLUMN "isGift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "giftMessage" TEXT;
