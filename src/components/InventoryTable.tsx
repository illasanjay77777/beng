import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { InventoryItem, SortField } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
  onSort: (field: SortField) => void;
}

export function InventoryTable({ items, onEdit, onDelete, onSort }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');

  const handleSort = (field: SortField) => {
    setSortField(field);
    onSort(field);
  };

  const SortButton = ({ field }: { field: SortField }) => (
    <button
      onClick={() => handleSort(field)}
      className="inline-flex items-center hover:text-blue-600"
    >
      <ArrowUpDown className="h-4 w-4 ml-1" />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name <SortButton field="name" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category <SortButton field="category" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity <SortButton field="quantity" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price <SortButton field="price" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated <SortButton field="lastUpdated" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              className={item.quantity < 10 ? 'bg-red-50' : 'hover:bg-gray-50'}
            >
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`${item.quantity < 10 ? 'text-red-600 font-medium' : ''}`}>
                  {item.quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(item.lastUpdated).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}