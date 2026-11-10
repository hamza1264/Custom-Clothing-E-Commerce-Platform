export const initialProducts = [
  {
    id: "1",
    title: "Embroidered Lawn Suit",
    name: "Embroidered Lawn Suit",
    price: 4500,
    originalPrice: 6000,
    discount: "25% OFF",
    rating: 4.8,
    reviewsCount: 124,
    images: [
      "/category/femail01.jpg",
      "/category/femail02.jpg",
      "/category/femail03.jpg",
    ],
    image: "/category/femail01.jpg",
    fabric: "Premium Lawn Fabric",
    features: ["Comfortable & Breathable", "Perfect for Summertime"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#1c2d42" },
      { name: "Maroon", hex: "#631322" },
      { name: "Green", hex: "#1d4838" },
    ],
    category: "Unstitched",
    description:
      "Elegant 3 piece embroidered suit, made with premium lawn fabric. Perfect for casual and semi-formal wear.",
    fabricCare:
      "Dry clean recommended. Do not bleach. Iron at moderate temperature. Avoid direct sunlight when drying.",
    reviews: [
      {
        id: "review-1",
        user: "Sarah Khan",
        verified: true,
        rating: 5,
        date: "14 Sep 2025",
        comment: "Absolutely loved the quality and perfect fitting! Highly recommend.",
      },
      {
        id: "review-2",
        user: "Ayesha Malik",
        verified: true,
        rating: 5,
        date: "10 Sep 2025",
        comment: "Great service and beautiful design. Will order again!",
      },
    ],
    active: true,
  },
  {
    id: "2",
    title: "Silk Party Dress",
    name: "Silk Party Dress",
    price: 6500,
    originalPrice: 8000,
    discount: "18% OFF",
    rating: 4.9,
    reviewsCount: 88,
    images: ["/category/femail02.jpg"],
    image: "/category/femail02.jpg",
    fabric: "Pure Silk",
    features: ["Soft texture", "Elegant design"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Red", hex: "#ff0000" }],
    category: "Unstitched",
    description:
      "Elegant silk party dress with beautiful detailing for special occasions.",
    fabricCare: "Dry clean only.",
    reviews: [],
    active: true,
  },
  {
    id: "3",
    title: "Printed Lawn Dress",
    name: "Printed Lawn Dress",
    price: 3200,
    originalPrice: 4000,
    discount: "20% OFF",
    rating: 4.6,
    reviewsCount: 45,
    images: ["/category/femail03.jpg"],
    image: "/category/femail03.jpg",
    fabric: "Printed Lawn",
    features: ["Lightweight", "Cool colors"],
    sizes: ["M", "L"],
    colors: [{ name: "Blue", hex: "#0000ff" }],
    category: "Unstitched",
    description:
      "Comfortable printed lawn dress with a stylish and modern design.",
    fabricCare: "Machine wash cold.",
    reviews: [],
    active: true,
  },
  {
    id: "4",
    title: "Cotton Casual Suit",
    name: "Cotton Casual Suit",
    price: 3800,
    originalPrice: 4500,
    discount: "15% OFF",
    rating: 4.7,
    reviewsCount: 62,
    images: ["/category/femail04.jpg"],
    image: "/category/femail04.jpg",
    fabric: "100% Cotton",
    features: ["Daily wear", "Soft touch"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "White", hex: "#ffffff" }],
    category: "Stitched / Ready-Made",
    description:
      "Soft cotton casual suit perfect for everyday wear and summer days.",
    fabricCare: "Hand wash.",
    reviews: [],
    active: true,
  },
  {
    id: "5",
    title: "Chiffon Formal Dress",
    name: "Chiffon Formal Dress",
    price: 7200,
    originalPrice: 9000,
    discount: "20% OFF",
    rating: 4.9,
    reviewsCount: 110,
    images: ["/category/femail05.jpg"],
    image: "/category/femail05.jpg",
    fabric: "Chiffon",
    features: ["Wedding wear", "Embroidered"],
    sizes: ["S", "M", "L"],
    colors: [{ name: "Gold", hex: "#ffd700" }],
    category: "Stitched / Ready-Made",
    description:
      "Premium chiffon formal dress designed for weddings and special events.",
    fabricCare: "Dry clean only.",
    reviews: [],
    active: true,
  },
  {
    id: "6",
    title: "Velvet Winter Suit",
    name: "Velvet Winter Suit",
    price: 8500,
    originalPrice: 10000,
    discount: "15% OFF",
    rating: 4.8,
    reviewsCount: 95,
    images: ["/category/femail01.jpg"],
    image: "/category/femail01.jpg",
    fabric: "Micro Velvet",
    features: ["Warm & Cozy", "Royal look"],
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }],
    category: "Stitched / Ready-Made",
    description:
      "Luxury velvet winter suit with a comfortable fabric and elegant look.",
    fabricCare: "Dry clean only.",
    reviews: [],
    active: true,
  },
];

export const NAMED_COLOR_SWATCHES = {
  black: "#000000",
  brown: "#8B4513",
  "nana brown": "#8B5A2B",
  "nano brown": "#8B5A2B",
  gray: "#808080",
  grey: "#808080",
  navy: "#000080",
  blue: "#0000FF",
  "royal blue": "#4169E1",
  teal: "#008080",
  turquoise: "#40E0D0",
  red: "#FF0000",
  burgundy: "#800020",
  green: "#008000",
  olive: "#808000",
  mint: "#98FF98",
  white: "#FFFFFF",
  cream: "#FFFDD0",
  beige: "#F5F5DC",
  maroon: "#800000",
  pink: "#FFC0CB",
  "hot pink": "#FF69B4",
  coral: "#FF7F50",
  purple: "#800080",
  lavender: "#E6E6FA",
  yellow: "#FFFF00",
  orange: "#FFA500",
  gold: "#FFD700",
  silver: "#C0C0C0",
  charcoal: "#36454F",
  ivory: "#FFFFF0",
};

function getColorSwatch(name) {
  const normalizedName = name.trim().toLowerCase().replace(/[\s_-]+/g, " ");
  return NAMED_COLOR_SWATCHES[normalizedName] ?? "#777777";
}

export function normalizeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images.filter((image) => typeof image === "string")
    : [];
  const colors = Array.isArray(product.colors)
    ? product.colors
        .map((color) => {
          if (typeof color === "string") {
            return { name: color, hex: getColorSwatch(color) };
          }
          if (typeof color?.name === "string" && !color.hex) {
            return { ...color, hex: getColorSwatch(color.name) };
          }
          return color;
        })
        .filter((color) => typeof color?.name === "string")
    : [];

  return {
    ...product,
    id: String(product.id),
    title: product.title ?? product.name,
    name: product.name ?? product.title,
    image: images[0] ?? product.image ?? "",
    images,
    colors,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    features: Array.isArray(product.features) ? product.features : [],
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    active: product.active !== false,
  };
}
