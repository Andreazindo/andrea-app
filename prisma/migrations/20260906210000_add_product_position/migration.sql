-- Orden manual de aparición de productos dentro de su categoría en la tienda.
ALTER TABLE "Product" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;
