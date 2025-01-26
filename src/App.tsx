import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { InventoryTable } from './components/InventoryTable';
import { InventoryForm } from './components/InventoryForm';
import { InventoryItem, SortField } from './types';

// Sample initial data
const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Laptop',
    category: 'Electronics',
    quantity: 15,
    price: 999.99,
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Desk Chair',
    category: 'Furniture',
    quantity: 8,
    price: 199.99,
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Appliances',
    quantity: 12,
    price: 79.99,
    lastUpdated: new Date(),
  },
];

function App() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: 'asc' | 'desc';
  }>({ field: 'name', direction: 'asc' });

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category))],
    [items]
  );

  const handleAddItem = (
    newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>
  ) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setItems((prev) => [...prev, item]);
  };

  const handleEditItem = (
    updatedItem: Omit<InventoryItem, 'id' | 'lastUpdated'>
  ) => {
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...updatedItem, lastUpdated: new Date() }
          : item
      )
    );
    setEditingItem(undefined);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSort = useCallback(
    (field: SortField) => {
      setSortConfig((prev) => ({
        field,
        direction:
          prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
      }));
    },
    []
  );

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === '' || item.category === categoryFilter)
      )
      .sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        const modifier = sortConfig.direction === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        return ((aValue as number) - (bValue as number)) * modifier;
      });
  }, [items, searchTerm, categoryFilter, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Item
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InventoryTable
            items={filteredAndSortedItems}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteItem}
            onSort={handleSort}
          />
        </div>
      </div>

      {isFormOpen && (
        <InventoryForm
          item={editingItem}
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(undefined);
          }}
        />
      )}
    </div>
  );
}

export default App;