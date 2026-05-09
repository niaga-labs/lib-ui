'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
    onSelect: (location: string) => void;
    currentLocation?: string;
}

export default function LocationSelector({ onSelect, currentLocation }: LocationSelectorProps) {
    const [aisle, setAisle] = useState(currentLocation?.split('-')[0] || '');
    const [rack, setRack] = useState(currentLocation?.split('-')[1] || '');
    const [shelf, setShelf] = useState(currentLocation?.split('-')[2] || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (aisle && rack && shelf) {
            const location = `${aisle}-${rack}-${shelf}`;
            onSelect(location);
        }
    };

    const location = aisle && rack && shelf ? `${aisle}-${rack}-${shelf}` : '';

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-warehouse-primary" />
                <label className="text-sm font-medium text-gray-700">
                    Storage Location
                </label>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Aisle</label>
                    <input
                        type="text"
                        value={aisle}
                        onChange={(e) => setAisle(e.target.value.toUpperCase())}
                        className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:border-warehouse-primary focus:outline-none"
                        placeholder="A"
                        maxLength={2}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Rack</label>
                    <input
                        type="text"
                        value={rack}
                        onChange={(e) => setRack(e.target.value.toUpperCase())}
                        className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:border-warehouse-primary focus:outline-none"
                        placeholder="1"
                        maxLength={2}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 mb-1">Shelf</label>
                    <input
                        type="text"
                        value={shelf}
                        onChange={(e) => setShelf(e.target.value.toUpperCase())}
                        className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-center font-semibold text-lg focus:border-warehouse-primary focus:outline-none"
                        placeholder="1"
                        maxLength={2}
                        required
                    />
                </div>
            </div>

            {location && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-600">Selected Location</p>
                    <p className="text-xl font-bold text-warehouse-primary mt-1">{location}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={!location}
                className="w-full bg-warehouse-success text-white py-3 px-4 rounded-lg font-semibold touch-target hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Confirm Location
            </button>
        </form>
    );
}
