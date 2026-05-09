import { MapPin, Navigation } from 'lucide-react';

interface LocationGuideProps {
    location: string;
}

export default function LocationGuide({ location }: LocationGuideProps) {
    const [aisle, rack, shelf] = location.split('-');

    return (
        <div className="bg-warehouse-primary text-white rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5" />
                <h3 className="font-semibold">Location Guide</h3>
            </div>

            <div className="flex items-center justify-center gap-2 text-center">
                <div className="flex-1">
                    <div className="text-xs opacity-80 mb-1">Aisle</div>
                    <div className="text-3xl font-bold bg-white/20 rounded-lg py-3">{aisle}</div>
                </div>

                <div className="text-2xl opacity-60">→</div>

                <div className="flex-1">
                    <div className="text-xs opacity-80 mb-1">Rack</div>
                    <div className="text-3xl font-bold bg-white/20 rounded-lg py-3">{rack}</div>
                </div>

                <div className="text-2xl opacity-60">→</div>

                <div className="flex-1">
                    <div className="text-xs opacity-80 mb-1">Shelf</div>
                    <div className="text-3xl font-bold bg-white/20 rounded-lg py-3">{shelf}</div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                <span>Full Location: {location}</span>
            </div>
        </div>
    );
}
