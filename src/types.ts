export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastUpdated: Date;
}

export type SortField = 'name' | 'category' | 'quantity' | 'price' | 'lastUpdated';