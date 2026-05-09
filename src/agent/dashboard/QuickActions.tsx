import { Button } from '../../primitives/button';
import { PlusCircle, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={() => router.push('/agent/orders/new')}
            >
                <PlusCircle className="h-5 w-5" />
                Pesanan Baru
            </Button>

            <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => router.push('/agent/customers')}
            >
                <UserPlus className="h-5 w-5" />
                Tambah Pelanggan
            </Button>
        </div>
    );
}
