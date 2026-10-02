import { CartItem, ColorOption, Product } from "./types";
import { STORE_WHATSAPP } from "./data/products";

export function formatPKR(amount: number): string {
  return amount.toLocaleString("en-PK");
}

export function getWhatsAppProductOrderUrl({
  product,
  price = product.price,
  size,
  color,
  quantity = 1,
}: {
  product: Product;
  price?: number;
  size?: string;
  color?: ColorOption | string;
  quantity?: number;
}): string {
  const selectedSize =
    size || (product.sizes.length > 0 ? product.sizes[0] : "Standard");
  const selectedColor =
    typeof color === "string"
      ? color
      : color?.name ||
        (product.colors.length > 0 ? product.colors[0].name : "Standard");
  const total = formatPKR(price * quantity);

  const message = `Assalam-o-Alaikum, I want to order from Farnova.\n\nProduct: ${product.name}\nPrice: PKR ${total}\nSize: ${selectedSize}\nColor: ${selectedColor}\nQuantity: ${quantity}\n\nPlease confirm availability and delivery details.`;

  return `${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppCartOrderUrl(items: CartItem[]): string {
  if (items.length === 0) return STORE_WHATSAPP;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const summary = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name}\n   - Size: ${item.selectedSize} | Color: ${item.selectedColor.name} | Qty: ${item.quantity}\n   - Price: PKR ${formatPKR(item.product.price * item.quantity)}`
    )
    .join("\n\n");

  const message = `Assalam-o-Alaikum, I want to order from Farnova.\n\nOrder Summary:\n${summary}\n\nTotal Amount: PKR ${formatPKR(total)}\nPayment Method: Cash on Delivery (COD)\n\nPlease confirm order receipt and delivery timeline.`;

  return `${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
