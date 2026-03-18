export const TOOL_CATEGORIES = ["Tractor", "Equipment", "Harvester", "Irrigation", "Other"];

const DEFAULT_CATEGORY = "Equipment";
const DEFAULT_DESCRIPTION = "No description provided.";

const toNumber = (value) => {
  const normalized = Number(value ?? 0);
  return Number.isFinite(normalized) ? normalized : 0;
};

export function createId(prefix) {
  return `${prefix}_${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// Normalize tool data so legacy records and new records share the same shape.
export function normalizeTool(tool = {}) {
  const pricePerDay = toNumber(tool.pricePerDay ?? tool.pricePerHour ?? tool.hourly);

  return {
    ...tool,
    id: tool.id ?? createId("tool"),
    title: (tool.title ?? tool.name ?? "").trim(),
    description: (tool.description ?? DEFAULT_DESCRIPTION).trim(),
    category: (tool.category ?? DEFAULT_CATEGORY).trim() || DEFAULT_CATEGORY,
    image: tool.image ?? "",
    pricePerDay,
    pricePerHour: pricePerDay,
    hourly: pricePerDay,
    ownerEmail: tool.ownerEmail ?? "",
    ownerName: tool.ownerName ?? "",
    ownerPhone: tool.ownerPhone ?? "",
    createdAt: tool.createdAt ?? new Date().toISOString(),
  };
}

export function buildTool(tool, owner = {}) {
  return normalizeTool({
    ...tool,
    ownerEmail: owner.email,
    ownerName: owner.name,
    ownerPhone: owner.phone,
  });
}
