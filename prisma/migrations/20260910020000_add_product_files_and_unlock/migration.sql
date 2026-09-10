-- Producto requerido para desbloquear los archivos de este producto (contenido con candado).
ALTER TABLE "Product" ADD COLUMN "requiredProductId" TEXT;
ALTER TABLE "Product" ADD CONSTRAINT "Product_requiredProductId_fkey" FOREIGN KEY ("requiredProductId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Archivos/enlaces con candado por producto.
CREATE TABLE "ProductFile" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductFile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductFile_productId_position_idx" ON "ProductFile"("productId", "position");

ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
