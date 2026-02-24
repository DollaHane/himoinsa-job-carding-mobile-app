import React from "react";
import { StatCard } from "./StatCard";
import { Box } from "../ui/box";
import { useDashboardData } from "@/http/services";


export default function StatCards() {

  return (
    <Box className="grid grid-cols-3 gap-3">
      <StatCard label="Total kVA" value="158,665 kVA" borderColor="#f59e0b" />
      <StatCard
        label="Total kVA In Use"
        value="123,285 kVA"
        borderColor="#38bdf8"
      />
      <StatCard
        label="Total kVA Utilisation"
        value="78 %"
        borderColor="#34d399"
      />
    </Box>
  );
}
