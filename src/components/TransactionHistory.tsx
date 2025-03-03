import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Transaction {
  id: string;
  type: "mint" | "transfer" | "burn" | "approve";
  from: string;
  to: string;
  amount: string;
  timestamp: string;
}

interface TransactionHistoryProps {
  transactions?: Transaction[];
}

export const TransactionHistory = ({
  transactions = [
    {
      id: "tx1",
      type: "mint",
      from: "0x0000...",
      to: "0xabc1...",
      amount: "1000",
      timestamp: "2023-06-15T10:30:00Z",
    },
    {
      id: "tx2",
      type: "transfer",
      from: "0xabc1...",
      to: "0xdef2...",
      amount: "500",
      timestamp: "2023-06-16T14:45:00Z",
    },
  ],
}: TransactionHistoryProps) => {
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "mint":
        return <Badge variant="outline">Mint</Badge>;
      case "transfer":
        return <Badge variant="outline">Transfer</Badge>;
      case "burn":
        return <Badge variant="destructive">Burn</Badge>;
      case "approve":
        return <Badge variant="secondary">Approve</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Transaction History</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3 border rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {getTransactionTypeLabel(tx.type)}
                  <span className="text-sm font-medium">{tx.amount}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(tx.timestamp)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">From:</span>{" "}
                  <span className="font-mono">{tx.from}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">To:</span>{" "}
                  <span className="font-mono">{tx.to}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
