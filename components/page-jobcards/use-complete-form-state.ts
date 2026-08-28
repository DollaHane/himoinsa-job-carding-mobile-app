import { useReducer, useEffect, useCallback } from "react";

interface SmrEntry {
  smr_reading: string;
  equipment_condition: string;
  recommendations: string;
}

interface State {
  technician_signature: string;
  customer_signature: string;
  technician_signature_name: string;
  customer_signature_name: string;
  slot_images: Record<string, string>;
  smr_entries: Record<number, SmrEntry>;
  task_status: Record<number, boolean>;
  task_reasons: Record<number, string>;
  inventory_used: Record<number, number>;
  inventory_reasons: Record<number, string>;
  checklist_item_checked: Record<string, boolean>;
  checklist_item_notes: Record<string, string>;
}

type Action =
  | {
      type: "SET_FIELD";
      field:
        | "technician_signature"
        | "customer_signature"
        | "technician_signature_name"
        | "customer_signature_name";
      value: string;
    }
  | { type: "SET_SLOT_IMAGE"; key: string; dataUrl: string }
  | { type: "SET_SMR"; assetId: number; field: keyof SmrEntry; value: string }
  | { type: "SET_TASK_STATUS"; taskId: number; completed: boolean }
  | { type: "SET_TASK_REASON"; taskId: number; reason: string }
  | { type: "SET_INVENTORY_USED"; invId: number; qty: number }
  | { type: "SET_INVENTORY_REASON"; invId: number; reason: string }
  | { type: "SET_CHECKLIST_ITEM"; checklistId: number; step: number; checked: boolean }
  | { type: "SET_CHECKLIST_NOTE"; checklistId: number; step: number; note: string }
  | { type: "CLEAR_STATE" };

function initialState(): State {
  return {
    technician_signature: "",
    customer_signature: "",
    technician_signature_name: "",
    customer_signature_name: "",
    slot_images: {},
    smr_entries: {},
    task_status: {},
    task_reasons: {},
    inventory_used: {},
    inventory_reasons: {},
    checklist_item_checked: {},
    checklist_item_notes: {},
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_SLOT_IMAGE": {
      const slotImages = { ...state.slot_images };
      if (action.dataUrl) {
        slotImages[action.key] = action.dataUrl;
      } else {
        delete slotImages[action.key];
      }
      return { ...state, slot_images: slotImages };
    }

    case "SET_SMR": {
      const smrEntries = { ...state.smr_entries };
      const current = smrEntries[action.assetId] ?? {
        smr_reading: "",
        equipment_condition: "",
        recommendations: "",
      };
      smrEntries[action.assetId] = {
        ...current,
        [action.field]: action.value,
      };
      return { ...state, smr_entries: smrEntries };
    }

    case "SET_TASK_STATUS":
      return {
        ...state,
        task_status: {
          ...state.task_status,
          [action.taskId]: action.completed,
        },
        task_reasons: action.completed
          ? { ...state.task_reasons, [action.taskId]: "" }
          : state.task_reasons,
      };

    case "SET_TASK_REASON":
      return {
        ...state,
        task_reasons: {
          ...state.task_reasons,
          [action.taskId]: action.reason,
        },
      };

    case "SET_INVENTORY_USED":
      return {
        ...state,
        inventory_used: {
          ...state.inventory_used,
          [action.invId]: action.qty,
        },
      };

    case "SET_INVENTORY_REASON":
      return {
        ...state,
        inventory_reasons: {
          ...state.inventory_reasons,
          [action.invId]: action.reason,
        },
      };

    case "SET_CHECKLIST_ITEM": {
      const key = `${action.checklistId}_${action.step}`;
      return {
        ...state,
        checklist_item_checked: {
          ...state.checklist_item_checked,
          [key]: action.checked,
        },
      };
    }

    case "SET_CHECKLIST_NOTE": {
      const key = `${action.checklistId}_${action.step}`;
      return {
        ...state,
        checklist_item_notes: {
          ...state.checklist_item_notes,
          [key]: action.note,
        },
      };
    }

    case "CLEAR_STATE":
      return initialState();

    default:
      return state;
  }
}

export function useCompleteFormState(jobcardId: number) {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  useEffect(() => {
    dispatch({ type: "CLEAR_STATE" });
  }, [jobcardId]);

  const clearState = useCallback(() => {
    dispatch({ type: "CLEAR_STATE" });
  }, []);

  return { state, dispatch, clearState };
}
