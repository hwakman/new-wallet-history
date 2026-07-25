import "server-only";

import { connection } from "next/server";
import { getDb } from "./mongodb";

export type TxnType = "income" | "expense";

export type Transaction = {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: TxnType;
};

export type Categories = Record<TxnType, string[]>;

export type CategoryTotal = {
  category: string;
  amount: number;
};

const DEFAULT_CATEGORIES: Categories = {
  income: ["Salary", "Investment", "Other"],
  expense: ["Bills", "Food", "Transport", "Other"],
};

export async function getCategories(): Promise<Categories> {
  await connection();
  const db = await getDb();
  const docs = await db.collection("categories").find().toArray();

  // Seed the defaults the first time the app talks to an empty database.
  if (docs.length === 0) {
    const seed = (["income", "expense"] as TxnType[]).flatMap((type) =>
      DEFAULT_CATEGORIES[type].map((name, order) => ({ name, type, order })),
    );
    await db.collection("categories").insertMany(seed);
    return DEFAULT_CATEGORIES;
  }

  const result: Categories = { income: [], expense: [] };
  for (const doc of docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))) {
    result[doc.type as TxnType]?.push(doc.name as string);
  }
  // "Other" is the fallback bucket, so it always sorts last.
  for (const type of ["income", "expense"] as TxnType[]) {
    result[type] = [...result[type].filter((c) => c !== "Other"), "Other"];
  }
  return result;
}

export async function getTransactions(limit = 10): Promise<Transaction[]> {
  await connection();
  const db = await getDb();
  const docs = await db
    .collection("transactions")
    .find()
    .sort({ date: -1 })
    .limit(limit)
    .toArray();

  return docs.map((d) => ({
    id: d._id.toString(),
    date: new Date(d.date).toISOString(),
    category: d.category as string,
    amount: d.amount as number,
    type: d.type as TxnType,
  }));
}

export async function getTotals(): Promise<{
  income: number;
  expense: number;
  balance: number;
}> {
  await connection();
  const db = await getDb();
  const rows = await db
    .collection("transactions")
    .aggregate([{ $group: { _id: "$type", total: { $sum: "$amount" } } }])
    .toArray();

  const income = rows.find((r) => r._id === "income")?.total ?? 0;
  const expense = rows.find((r) => r._id === "expense")?.total ?? 0;
  return { income, expense, balance: income - expense };
}

export async function getExpenseByCategory(): Promise<CategoryTotal[]> {
  await connection();
  const db = await getDb();
  const rows = await db
    .collection("transactions")
    .aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
    ])
    .toArray();

  return rows.map((r) => ({ category: r._id as string, amount: r.amount as number }));
}
