'use client';

import { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, RotateCw } from 'lucide-react';
import Image from 'next/image';

interface ReceiptViewerProps {
    imageUrl: string;
    onClose: () => void;
}

const isPdf = (url: string) => url?.toLowerCase().endsWith('.pdf');

export default function ReceiptViewer({ imageUrl, onClose }: ReceiptViewerProps) {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const pdf = isPdf(imageUrl);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = pdf ? 'receipt.pdf' : 'receipt.jpg';
        link.click();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex items-center justify-between z-10">
                <h3 className="text-white font-semibold">Receipt Preview</h3>

                <div className="flex items-center gap-2">
                    {!pdf && (
                        <>
                            <button
                                onClick={handleZoomOut}
                                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition"
                                title="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="text-white text-sm font-medium min-w-[60px] text-center">
                                {zoom}%
                            </span>
                            <button
                                onClick={handleZoomIn}
                                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleRotate}
                                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition"
                                title="Rotate"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleDownload}
                        className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {pdf ? (
                <iframe
                    src={imageUrl}
                    className="w-full h-full mt-16 rounded-lg bg-white"
                    title="Receipt PDF"
                />
            ) : (
                <div className="max-w-6xl max-h-[90vh] overflow-auto">
                    <div
                        style={{
                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                            transition: 'transform 0.3s ease',
                        }}
                        className="relative min-w-[400px] min-h-[400px] bg-white"
                    >
                        <Image
                            src={imageUrl}
                            alt="Receipt"
                            width={800}
                            height={1000}
                            className="w-full h-auto"
                            unoptimized
                        />
                    </div>
                </div>
            )}

            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
}
