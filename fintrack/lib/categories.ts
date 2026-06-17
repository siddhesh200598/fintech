export const CATEGORIES = [
  "Food",
  "Groceries",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Investment",
  "Other",
] as const;

// Distinct, calm palette for the spending chart and category badges
export const CATEGORY_COLORS: Record<string, string> = {
  Food: "#E07A5F",
  Groceries: "#0E7C66",
  Transport: "#3D7EA6",
  Shopping: "#9B6DD3",
  Bills: "#C2410C",
  Entertainment: "#D6A419",
  Health: "#D14343",
  Salary: "#147D64",
  Investment: "#2A6F97",
  Other: "#7A8B92",
};

export function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? "#7A8B92";
}
