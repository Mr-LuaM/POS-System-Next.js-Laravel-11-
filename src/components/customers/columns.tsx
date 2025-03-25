import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LoyaltyCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  total_points: number;
}

export const getLoyaltyColumns = (onOpenClaimModal: (customer: LoyaltyCustomer) => void): ColumnDef<LoyaltyCustomer>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "N/A",
  },
  {
    accessorKey: "total_points",
    header: "Total Points",
    cell: ({ row }) => <span className="font-bold">{row.original.total_points}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button size="sm" onClick={() => onOpenClaimModal(row.original)}>
        Claim
      </Button>
    ),
  },
];
