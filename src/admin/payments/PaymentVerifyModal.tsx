'use client';

import { useState } from 'react';
import { X, Check, AlertCircle, Eye, FileText } from 'lucide-react';
import { Button } from '../../primitives/button';
import { Textarea } from '../../primitives/textarea';
import ReceiptViewer from './ReceiptViewer';
import { useToast } from '../common/Toast';

interface PaymentReceipt {
    orderId: string;
    orderNumber: string;
    customerName: string;
    amount: number;
    depositorName: string;
    depositDate: string;
    referenceNumber: string;
    bankName: string;
    receiptUrl: string;
    uploadedAt: string;
}

interface PaymentVerifyModalProps {
    payment: PaymentReceipt;
    onClose: () => void;
    onApprove: (note: string) => Promise<void>;
    onReject: (reason: string) => Promise<void>;
}

const isPdf = (url: string) => url?.toLowerCase().endsWith('.pdf');

export default function PaymentVerifyModal({ payment, onClose, onApprove, onReject }: PaymentVerifyModalProps) {
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [note, setNote] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showReceiptViewer, setShowReceiptViewer] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const { showToast, ToastContainer } = useToast();

    const formatMYR = (amount: number) => {
        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ms-MY', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleApprove = async () => {
        setShowApproveConfirm(false);
        try {
            setProcessing(true);
            await onApprove(note);
            onClose();
        } catch (error) {
            showToast('Gagal sahkan pembayaran', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            showToast('Sila masukkan sebab penolakan', 'error');
            return;
        }
        setShowRejectConfirm(false);
        try {
            setProcessing(true);
            await onReject(rejectionReason);
            onClose();
        } catch (error) {
            showToast('Gagal tolak pembayaran', 'error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                        <h2 className="text-2xl font-bold text-gray-900">Sahkan Pembayaran</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            disabled={processing}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Order Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-blue-700">No. Pesanan</p>
                                    <p className="font-mono font-bold text-blue-900">{payment.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-blue-700">Jumlah</p>
                                    <p className="text-2xl font-bold text-blue-900">{formatMYR(payment.amount)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-blue-700">Pelanggan</p>
                                    <p className="font-semibold text-blue-900">{payment.customerName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Details */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Maklumat Resit</h3>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Nama Pendeposit:</span>
                                    <span className="font-medium">{payment.depositorName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tarikh Deposit:</span>
                                    <span className="font-medium">{new Date(payment.depositDate).toLocaleDateString('ms-MY')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">No. Rujukan:</span>
                                    <span className="font-mono font-medium">{payment.referenceNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-medium">{payment.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dihantar pada:</span>
                                    <span className="font-medium">{formatDate(payment.uploadedAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Image / PDF */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Resit Pembayaran</h3>
                            <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition group"
                                onClick={() => setShowReceiptViewer(true)}
                            >
                                {isPdf(payment.receiptUrl) ? (
                                    <div className="w-full h-64 bg-gray-50 flex flex-col items-center justify-center">
                                        <FileText className="w-16 h-16 text-red-500 mb-3" />
                                        <p className="text-sm font-medium text-gray-700">Resit PDF</p>
                                        <p className="text-xs text-gray-500 mt-1">Klik untuk lihat PDF</p>
                                    </div>
                                ) : (
                                    <img
                                        src={payment.receiptUrl}
                                        alt="Receipt"
                                        className="w-full h-64 object-cover"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition">
                                        <Eye className="w-12 h-12 text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 text-center">
                                    Klik untuk lihat penuh
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {!action ? (
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setAction('reject')}
                                    className="h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                    disabled={processing}
                                >
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Tolak
                                </Button>
                                <Button
                                    onClick={() => setAction('approve')}
                                    className="h-12 bg-green-600 hover:bg-green-700"
                                    disabled={processing}
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Sahkan Pembayaran
                                </Button>
                            </div>
                        ) : action === 'approve' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nota (Optional)
                                    </label>
                                    <Textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Tambah nota untuk rekod dalaman..."
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setAction(null)}
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={() => setShowApproveConfirm(true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        disabled={processing}
                                    >
                                        {processing ? 'Processing...' : 'Sahkan Sekarang'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sebab Penolakan *
                                    </label>
                                    <Textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Masukkan sebab penolakan (akan dihantar ke pelanggan)..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Nota:</strong> Pelanggan akan menerima email dengan sebab penolakan dan boleh upload resit baru.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setAction(null);
                                            setRejectionReason('');
                                        }}
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (!rejectionReason.trim()) {
                                                showToast('Sila masukkan sebab penolakan', 'error');
                                                return;
                                            }
                                            setShowRejectConfirm(true);
                                        }}
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                        disabled={processing || !rejectionReason.trim()}
                                    >
                                        {processing ? 'Processing...' : 'Tolak Pembayaran'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Modal */}
            {showApproveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowApproveConfirm(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Sahkan Pembayaran</h3>
                        <p className="text-sm text-neutral-600 mb-6">
                            Sahkan pembayaran ini? Order akan diproses selepas pengesahan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowApproveConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            >
                                Sahkan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            {showRejectConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowRejectConfirm(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Tolak Pembayaran</h3>
                        <p className="text-sm text-neutral-600 mb-6">
                            Tolak pembayaran ini? Customer akan dimaklumkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Full Screen Viewer */}
            {showReceiptViewer && (
                <ReceiptViewer
                    imageUrl={payment.receiptUrl}
                    onClose={() => setShowReceiptViewer(false)}
                />
            )}
        </>
    );
}
