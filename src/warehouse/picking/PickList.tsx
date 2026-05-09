import { Check, Package } from 'lucide-react';
import LocationGuide from './LocationGuide';
import type { PickItem } from '../types';

interface PickListProps {
    items: PickItem[];
    currentItem: PickItem | null;
    onSelectItem: (item: PickItem) => void;
}

export default function PickList({ items, currentItem, onSelectItem }: PickListProps) {
    const pendingItems = items.filter(item => item.status === 'pending');
    const pickedItems = items.filter(item => item.status === 'picked');

    return (
        <div className="space-y-4">
            {/* Pending Items */}
            {pendingItems.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Items to Pick ({pendingItems.length})</h3>
                    <div className="space-y-2">
                        {pendingItems.map((item) => (
                            <div key={item.id}>
                                <button
                                    onClick={() => onSelectItem(item)}
                                    className={`w-full card text-left transition-all ${currentItem?.id === item.id
                                            ? 'ring-2 ring-warehouse-primary bg-blue-50'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.productName}</h4>
                                            <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-warehouse-primary">{item.quantity}</div>
                                            <div className="text-xs text-gray-500">units</div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <LocationGuide location={item.location} />
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Picked Items */}
            {pickedItems.length > 0 && (
                <div>
                    <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Picked Items ({pickedItems.length})
                    </h3>
                    <div className="space-y-2">
                        {pickedItems.map((item) => (
                            <div key={item.id} className="card bg-green-50 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{item.productName}</h4>
                                        <p className="text-sm text-gray-600">SKU: {item.sku} • {item.location}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">{item.pickedQuantity}/{item.quantity}</div>
                                        </div>
                                        <Check className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {items.length === 0 && (
                <div className="card text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No items in this order</p>
                </div>
            )}
        </div>
    );
}
