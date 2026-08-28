import type { Jobcard } from "@/types/jobcard";

interface CompleteFormState {
  technician_signature: string;
  customer_signature: string;
  technician_signature_name: string;
  customer_signature_name: string;
  slot_images: Record<string, string>;
  smr_entries: Record<number, { smr_reading: string; equipment_condition: string; recommendations: string }>;
  inventory_used: Record<number, number>;
  inventory_reasons: Record<number, string>;
}

export function getMissingCloseFields(
  state: CompleteFormState,
  jobcard: Jobcard,
): string[] {
  const missing: string[] = [];
  const assets = jobcard.assets ?? [];
  const inventory = jobcard.inventory ?? [];

  for (const a of assets) {
    const entry = state.smr_entries[a.id];
    if (!entry?.smr_reading?.trim()) {
      missing.push(`SMR reading for ${assetLabel(a)}`);
    }
    if (!entry?.recommendations?.trim()) {
      missing.push(`Work performed for ${assetLabel(a)}`);
    }
  }

  if (!state.technician_signature) {
    missing.push("Technician signature");
  }
  if (!state.technician_signature_name?.trim()) {
    missing.push("Technician name");
  }
  if (!state.customer_signature) {
    missing.push("Customer signature");
  }
  if (!state.customer_signature_name?.trim()) {
    missing.push("Customer name");
  }

  for (const a of assets) {
    const hasImage = Object.keys(state.slot_images).some((k) =>
      k.startsWith(`${a.asset_id}_`),
    );
    if (!hasImage) {
      missing.push(`Photos for ${assetLabel(a)}`);
    }
  }

  for (const inv of inventory) {
    const used = state.inventory_used[inv.id] ?? 0;
    const requested = inv.quantity_requested ?? 0;
    if (used < requested) {
      const reason = state.inventory_reasons?.[inv.id];
      if (!reason || reason.trim() === "") {
        const itemName =
          [inv.inventory?.stock_code, inv.inventory?.description]
            .filter(Boolean)
            .join(" - ") ||
          inv.inventory?.barcode ||
          `Item #${inv.inventory_id}`;
        missing.push(`Reason not fully used for ${itemName}`);
      }
    }
  }

  return missing;
}

function assetLabel(a: any): string {
  const name =
    a.asset?.fleet_number ??
    a.asset?.description ??
    `Asset #${a.asset_id}`;
  return name;
}
