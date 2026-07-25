"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import type { TxnType } from "@/lib/data";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/stats");
  revalidatePath("/settings");
}

export async function createTransaction(input: {
  amount: number;
  category: string;
  type: TxnType;
}) {
  const { amount, category, type } = input;
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid amount");
  if (!category) throw new Error("Category is required");

  const db = await getDb();
  await db.collection("transactions").insertOne({
    amount,
    category,
    type,
    date: new Date(),
  });

  revalidateAll();
}

export async function addCategory(name: string, type: TxnType) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");

  const db = await getDb();
  const exists = await db.collection("categories").findOne({ name: trimmed, type });
  if (exists) throw new Error("Category already exists");

  const count = await db.collection("categories").countDocuments({ type });
  await db.collection("categories").insertOne({ name: trimmed, type, order: count });

  revalidateAll();
}

export async function renameCategory(from: string, to: string, type: TxnType) {
  const trimmed = to.trim();
  if (!trimmed) throw new Error("Name is required");
  if (trimmed === from) return;

  const db = await getDb();
  const exists = await db.collection("categories").findOne({ name: trimmed, type });
  if (exists) throw new Error("Category already exists");

  await db.collection("categories").updateOne({ name: from, type }, { $set: { name: trimmed } });
  await db
    .collection("transactions")
    .updateMany({ category: from, type }, { $set: { category: trimmed } });

  revalidateAll();
}

export async function removeCategory(name: string, type: TxnType) {
  if (name === "Other") throw new Error('"Other" cannot be removed');

  const db = await getDb();
  await db.collection("categories").deleteOne({ name, type });
  // Records under the removed category fall back to "Other".
  await db
    .collection("transactions")
    .updateMany({ category: name, type }, { $set: { category: "Other" } });

  revalidateAll();
}

export async function resetTransactions() {
  const db = await getDb();
  await db.collection("transactions").deleteMany({});

  revalidateAll();
}
