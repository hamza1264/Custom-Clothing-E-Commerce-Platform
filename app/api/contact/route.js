import { getDatabase } from "@/data/mongodb";
import {
  isDatabaseConfigured,
  readJsonBody,
  storeNotConfiguredResponse,
} from "@/data/store";
import { isValidEmail, normalizeEmail } from "@/data/authRequest";

export const runtime = "nodejs";

const CONTACT_SUBJECTS = [
  "General Inquiry",
  "Custom Stitching",
  "Order Issue",
  "Delivery",
];

function isValidContactMessage(message) {
  return (
    message &&
    typeof message.name === "string" &&
    message.name.trim().length >= 2 &&
    message.name.trim().length <= 100 &&
    typeof message.email === "string" &&
    isValidEmail(normalizeEmail(message.email)) &&
    (message.phone === undefined ||
      (typeof message.phone === "string" &&
        message.phone.length <= 30 &&
        /^[0-9+()\s-]*$/.test(message.phone))) &&
    CONTACT_SUBJECTS.includes(message.subject) &&
    typeof message.message === "string" &&
    message.message.trim().length >= 10 &&
    message.message.trim().length <= 3000
  );
}

export async function POST(request) {
  if (!isDatabaseConfigured()) return storeNotConfiguredResponse();

  const parsed = await readJsonBody(request);
  if (parsed.response) return parsed.response;

  if (!isValidContactMessage(parsed.body)) {
    return Response.json(
      { error: "Please enter valid contact details and a message." },
      { status: 400 }
    );
  }

  const message = {
    name: parsed.body.name.trim(),
    email: normalizeEmail(parsed.body.email),
    phone: parsed.body.phone?.trim() ?? "",
    subject: parsed.body.subject,
    message: parsed.body.message.trim(),
    status: "new",
    createdAt: new Date(),
  };

  const result = await (await getDatabase())
    .collection("contact_messages")
    .insertOne(message);

  return Response.json(
    { message: "Your message has been sent.", id: result.insertedId.toString() },
    { status: 201 }
  );
}
