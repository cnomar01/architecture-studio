"use client";

import { addActivity } from "@/lib/core/activityStore";

export type FinanceType = "Income" | "Expense";

export type FinanceCategory =
  | "Contract"
  | "Payment"
  | "Design Cost"
  | "Site Cost"
  | "Material"
  | "Transportation"
  | "Software"
  | "Consultant"
  | "Other";

export type FinanceStatus = "Pending" | "Paid" | "Received";

export type Currency = "EGP" | "USD" | "EUR";

export type FinanceTransaction = {
  id: string;
  projectId: string;
  projectName: string;
  type: FinanceType;
  category: FinanceCategory;
  description: string;
  amount: number;
  currency: Currency;
  date: string;
  status: FinanceStatus;
  createdBy: string;
  createdAt: string;
};

export type ProjectBudget = {
  projectId: string;
  projectName: string;
  contractValue: number;
  budget: number;
  currency: Currency;
  notes: string;
  updatedAt: string;
};

export type FinanceInvoiceStatus =
  | "Draft"
  | "Sent"
  | "Partially Paid"
  | "Paid"
  | "Overdue";

export type FinanceInvoice = {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  description: string;
  amount: number;
  currency: Currency;
  issueDate: string;
  dueDate: string;
  status: FinanceInvoiceStatus;
  createdAt: string;
};

const TRANSACTION_KEY = "mason-arc-finance";
const BUDGET_KEY = "mason-arc-finance-budgets";
const INVOICE_KEY = "mason-arc-finance-invoices";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function nextId(prefix: string, ids: string[]) {
  const numbers = ids.map((id) =>
    Number(id.match(/(\d+)$/)?.[1] || 0)
  );

  const max = numbers.length > 0 ? Math.max(...numbers) : 0;

  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export function getFinanceTransactions() {
  return read<FinanceTransaction[]>(TRANSACTION_KEY, []);
}

export function saveFinanceTransactions(
  items: FinanceTransaction[]
) {
  write(TRANSACTION_KEY, items);
}

export function addFinanceTransaction(
  input: Omit<FinanceTransaction, "id" | "createdAt">
) {
  const items = getFinanceTransactions();

  const item: FinanceTransaction = {
    ...input,
    id: nextId("FIN", items.map((x) => x.id)),
    createdAt: new Date().toISOString(),
  };

  saveFinanceTransactions([...items, item]);

  addActivity({
    type: "Finance",
    title:
      item.type === "Income"
        ? "Income Recorded"
        : "Expense Recorded",
    description: `${item.description} — ${formatAmount(
      item.amount,
      item.currency
    )}.`,
    projectId: item.projectId,
    projectName: item.projectName,
    userName: item.createdBy,
    metadata: {
      transactionId: item.id,
      type: item.type,
      status: item.status,
      amount: formatAmount(item.amount, item.currency),
    },
  });

  return item;
}

export function updateFinanceTransaction(
  id: string,
  updates: Partial<FinanceTransaction>
) {
  const items = getFinanceTransactions();
  const old = items.find((x) => x.id === id);

  if (!old) return items;

  const updated = items.map((x) =>
    x.id === id ? { ...x, ...updates } : x
  );

  saveFinanceTransactions(updated);

  const item = updated.find((x) => x.id === id);

  if (
    item &&
    (updates.status !== undefined ||
      updates.amount !== undefined)
  ) {
    addActivity({
      type: "Finance",
      title: "Finance Updated",
      description: `${item.description} was updated.`,
      projectId: item.projectId,
      projectName: item.projectName,
      userName: item.createdBy,
      metadata: {
        transactionId: id,
        previousStatus: old.status,
        status: item.status,
        previousAmount: String(old.amount),
        amount: String(item.amount),
      },
    });
  }

  return updated;
}

export function deleteFinanceTransaction(id: string) {
  const items = getFinanceTransactions();
  const item = items.find((x) => x.id === id);

  const updated = items.filter((x) => x.id !== id);

  saveFinanceTransactions(updated);

  if (item) {
    addActivity({
      type: "Finance",
      title: "Finance Transaction Deleted",
      description: `${item.id} was deleted.`,
      projectId: item.projectId,
      projectName: item.projectName,
      userName: item.createdBy,
      metadata: {
        transactionId: item.id,
      },
    });
  }

  return updated;
}

export function getFinanceTransactionById(id: string) {
  return (
    getFinanceTransactions().find((x) => x.id === id) ??
    null
  );
}

export function getProjectFinance(projectId: string) {
  return getFinanceTransactions().filter(
    (x) => x.projectId === projectId
  );
}

export function getProjectIncome(projectId: string) {
  return getProjectFinance(projectId)
    .filter((x) => x.type === "Income")
    .reduce((total, x) => total + x.amount, 0);
}

export function getProjectExpenses(projectId: string) {
  return getProjectFinance(projectId)
    .filter((x) => x.type === "Expense")
    .reduce((total, x) => total + x.amount, 0);
}

export function getProjectProfit(projectId: string) {
  return (
    getProjectIncome(projectId) -
    getProjectExpenses(projectId)
  );
}

export function getProjectProfitMargin(projectId: string) {
  const income = getProjectIncome(projectId);

  if (!income) return 0;

  return Math.round(
    (getProjectProfit(projectId) / income) * 100
  );
}

export function getStudioIncome() {
  return getFinanceTransactions()
    .filter((x) => x.type === "Income")
    .reduce((total, x) => total + x.amount, 0);
}

export function getStudioExpenses() {
  return getFinanceTransactions()
    .filter((x) => x.type === "Expense")
    .reduce((total, x) => total + x.amount, 0);
}

export function getStudioProfit() {
  return getStudioIncome() - getStudioExpenses();
}

export function getPendingFinanceTransactions(
  projectId?: string
) {
  const items = projectId
    ? getProjectFinance(projectId)
    : getFinanceTransactions();

  return items.filter((x) => x.status === "Pending");
}

export function getPaidExpenses(projectId?: string) {
  const items = projectId
    ? getProjectFinance(projectId)
    : getFinanceTransactions();

  return items.filter(
    (x) => x.type === "Expense" && x.status === "Paid"
  );
}

export function getReceivedIncome(projectId?: string) {
  const items = projectId
    ? getProjectFinance(projectId)
    : getFinanceTransactions();

  return items.filter(
    (x) => x.type === "Income" && x.status === "Received"
  );
}

export function getProjectBudgets() {
  return read<ProjectBudget[]>(BUDGET_KEY, []);
}

export function getProjectBudget(
  projectId: string
): ProjectBudget | null {
  return (
    getProjectBudgets().find(
      (x) => x.projectId === projectId
    ) ?? null
  );
}

export function saveProjectBudget(
  input: Omit<ProjectBudget, "updatedAt">
) {
  const budgets = getProjectBudgets();

  const item: ProjectBudget = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  write(BUDGET_KEY, [
    ...budgets.filter(
      (x) => x.projectId !== input.projectId
    ),
    item,
  ]);

  addActivity({
    type: "Finance",
    title: "Project Budget Updated",
    description: `Budget updated for ${input.projectName}.`,
    projectId: input.projectId,
    projectName: input.projectName,
    metadata: {
      budget: String(input.budget),
      contractValue: String(input.contractValue),
      currency: input.currency,
    },
  });

  return item;
}

export function getBudgetVsActual(projectId: string) {
  const budget = getProjectBudget(projectId);
  const expenses = getProjectExpenses(projectId);

  const contract =
    budget?.contractValue ?? getProjectIncome(projectId);

  const planned = budget?.budget ?? 0;

  return {
    budget: planned,
    actualCost: expenses,
    variance: planned - expenses,
    contractValue: contract,
    utilization: planned
      ? Math.round((expenses / planned) * 100)
      : 0,
  };
}

export function getInvoices() {
  return read<FinanceInvoice[]>(INVOICE_KEY, []);
}

export function addInvoice(
  input: Omit<FinanceInvoice, "id" | "createdAt">
) {
  const items = getInvoices();

  const item: FinanceInvoice = {
    ...input,
    id: nextId("INV", items.map((x) => x.id)),
    createdAt: new Date().toISOString(),
  };

  write(INVOICE_KEY, [...items, item]);

  addActivity({
    type: "Finance",
    title: "Invoice Created",
    description: `Invoice ${item.id} created for ${item.projectName}.`,
    projectId: item.projectId,
    projectName: item.projectName,
    metadata: {
      invoiceId: item.id,
      amount: formatAmount(item.amount, item.currency),
      status: item.status,
    },
  });

  return item;
}

export function updateInvoice(
  id: string,
  updates: Partial<FinanceInvoice>
) {
  const items = getInvoices();

  const updated = items.map((x) =>
    x.id === id ? { ...x, ...updates } : x
  );

  write(INVOICE_KEY, updated);

  return updated;
}

export function getProjectInvoices(projectId: string) {
  return getInvoices().filter(
    (x) => x.projectId === projectId
  );
}

export function getOverdueInvoices() {
  const today = new Date().toISOString().slice(0, 10);

  return getInvoices().filter(
    (x) => x.status !== "Paid" && x.dueDate < today
  );
}

export function formatAmount(
  amount: number,
  currency: Currency
) {
  return `${amount.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function resetFinance() {
  write(TRANSACTION_KEY, []);
  write(BUDGET_KEY, []);
  write(INVOICE_KEY, []);
}