"use client";

import { useState, useTransition } from "react";
import { addCategory, removeCategory, renameCategory } from "@/app/actions";
import type { Categories, TxnType } from "@/lib/data";

export default function CategoryEditor({ categories }: { categories: Categories }) {
  const [type, setType] = useState<TxnType>("expense");
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const list = categories[type];

  function run(fn: () => Promise<void>, onDone?: () => void) {
    setError("");
    startTransition(async () => {
      try {
        await fn();
        onDone?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-neutral-600">Categories</h2>

      <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold ${
            type === "income" ? "bg-white text-emerald-700 shadow-sm" : "text-neutral-500"
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold ${
            type === "expense" ? "bg-white text-rose-700 shadow-sm" : "text-neutral-500"
          }`}
        >
          Expense
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="overflow-hidden rounded-lg border border-black/10 bg-white">
        {list.map((name) => (
          <li
            key={name}
            className="flex items-center gap-2 border-b border-black/5 px-4 py-3 last:border-b-0"
          >
            {editing === name ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="min-w-0 flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    run(() => renameCategory(name, editName, type), () => setEditing(null))
                  }
                  className="text-sm font-semibold text-neutral-900 disabled:text-neutral-400"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-sm text-neutral-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-neutral-900">{name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(name);
                    setEditName(name);
                    setError("");
                  }}
                  className="text-sm text-neutral-500"
                >
                  Rename
                </button>
                {name !== "Other" && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => removeCategory(name, type))}
                    className="text-sm text-red-600 disabled:text-neutral-400"
                  >
                    Remove
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={`New ${type} category`}
          className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm"
        />
        <button
          type="button"
          disabled={!newName.trim() || pending}
          onClick={() => run(() => addCategory(newName, type), () => setNewName(""))}
          className="rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white disabled:bg-neutral-200 disabled:text-neutral-500"
        >
          Add
        </button>
      </div>
    </div>
  );
}
