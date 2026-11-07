import CheckoutPage from "@/component/checkout/CheckoutPage";

export default async function CheckoutRoute({ searchParams }) {
  const params = await searchParams;

  return <CheckoutPage isBuyNow={params?.buyNow === "1"} />;
}
