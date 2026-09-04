import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Button } from '../../primitives/button';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BRAND_NAME } from '../../brand';

interface OrderSuccessProps {
    orderNumber: string;
    customerPhone: string;
    /** Name used in the WhatsApp message. Defaults to the lib-ui brand constant. */
    brand?: string;
}

export function OrderSuccess({ orderNumber, customerPhone, brand = BRAND_NAME }: OrderSuccessProps) {
    const router = useRouter();

    const handleWhatsApp = () => {
        // Format phone number for WhatsApp (remove leading 0, add 60)
        const formattedPhone = '60' + customerPhone.replace(/^0+/, '');

        const message = encodeURIComponent(
            `Terima kasih! Pesanan anda telah berjaya dibuat.\n\n` +
            `No. Pesanan: ${orderNumber}\n\n` +
            `Kami akan menghubungi anda tidak lama lagi untuk pengesahan. ` +
            `Thank you for choosing ${brand}!`
        );

        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-green-900">Pesanan Berjaya!</h2>
                            <p className="text-green-700 mt-2">
                                Pesanan telah dihantar untuk diproses
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-green-200">
                            <p className="text-sm text-muted-foreground">No. Pesanan</p>
                            <p className="text-3xl font-bold text-green-900 mt-1">{orderNumber}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Langkah Seterusnya</CardTitle>
                    <CardDescription>Apa yang perlu dilakukan sekarang</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-primary">1</span>
                            </div>
                            <div>
                                <p className="font-medium">Maklumkan kepada pelanggan</p>
                                <p className="text-sm text-muted-foreground">
                                    Gunakan butang WhatsApp di bawah untuk menghantar maklumat pesanan
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-primary">2</span>
                            </div>
                            <div>
                                <p className="font-medium">Pantau status pesanan</p>
                                <p className="text-sm text-muted-foreground">
                                    Pesanan boleh dilihat di senarai pesanan anda
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-primary">3</span>
                            </div>
                            <div>
                                <p className="font-medium">Komisen akan dikira</p>
                                <p className="text-sm text-muted-foreground">
                                    Komisen akan ditambah selepas pesanan selesai
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            onClick={handleWhatsApp}
                            className="flex-1 gap-2"
                            size="lg"
                        >
                            <MessageCircle className="h-5 w-5" />
                            WhatsApp Pelanggan
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/agent/orders')}
                            className="flex-1"
                        >
                            Lihat Pesanan
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/agent')}
                            className="flex-1"
                        >
                            Ke Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
