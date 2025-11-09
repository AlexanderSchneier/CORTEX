'use client';

import {useEffect, useState} from "react";
import {SidebarLeftIcon} from "@/components/ui/icons/akar-icons-sidebar-left";
import {PaperIcon} from "@/components/ui/icons/akar-icons-paper";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface PdfItem {
    name: string;
    url: string;
    paperId?: string;
}

interface PaperNavProps {
    onSelectPdf: (pdfUrl: string) => void;
    selectedPdf: string | null;
    onPdfListChange?: (pdfList: PdfItem[]) => void;
    title?: string;
    textColor?: string;
    selectedPaperId?: string | null;
}

export default function PaperNav({
                                     onSelectPdf,
                                     selectedPdf,
                                     onPdfListChange,
                                     selectedPaperId,   // ← ADD THIS
                                     title = 'PAPER DIRECTORY',
                                     textColor = 'text-white'
                                 }: PaperNavProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [pdfList, setPdfList] = useState<PdfItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        onPdfListChange?.(pdfList);
    }, [pdfList, onPdfListChange]);

    const handlePdfClick = (pdf: PdfItem, index: number) => {
        setSelectedIndex(index);
        onSelectPdf(pdf.url);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setIsUploading(true);

            // Create a URL for the uploaded file
            const fileUrl = URL.createObjectURL(file);

            // Add the new PDF to the list
            const newPdf: PdfItem = {
                name: file.name,
                url: fileUrl
            };

            setPdfList([...pdfList, newPdf]);

            // Auto-select the newly uploaded PDF
            setSelectedIndex(pdfList.length);
            onSelectPdf(fileUrl);

            // Upload to backend
            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('https://cortex-production-8481.up.railway.app/upload', {
                    method: 'POST',
                    body: formData,
                } as RequestInit);

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                console.log('Upload successful:', result);

                // Update the PDF item with the paper ID from backend
                setPdfList(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        paperId: result.paper_id
                    };
                    return updated;
                });
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file to backend');
            } finally {
                setIsUploading(false);
            }

            // Reset the input
            event.target.value = '';
        } else {
            alert('Please upload a valid PDF file');
        }
    };

    return (
        <aside
            className={`flex flex-col border-l border-gray-200 transition-all duration-300 rounded-t-lg h-full ${
                isOpen ? 'w-64' : 'w-16'
            }`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between bg-maroon h-12 px-3 font-bold text-lg flex-shrink-0 ${textColor}`}>
                {isOpen && <span className="whitespace-nowrap overflow-hidden">{title}</span>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="focus:outline-none hover:opacity-80 transition-opacity flex-shrink-0"
                    title={isOpen ? 'Collapse' : 'Expand'}
                >
                    <SidebarLeftIcon/>
                </button>
            </div>
            {/* List */}
            {isOpen && (
                <ul>
                    {pdfList.map((pdf, index) => (
                        <li
                            key={index}
                            onClick={() => handlePdfClick(pdf, index)}
                            className={`px-3 py-2 cursor-pointer list-none transition-colors ${
                                selectedPaperId
                                    ? (pdf.paperId === selectedPaperId
                                        ? 'bg-[#edd5d7] border-l-4 border-[#8f0913]'
                                        : 'bg-[#F9F6EE] hover:bg-stone-300')
                                    : (selectedIndex === index
                                        ? 'bg-[#edd5d7] border-l-4 border-[#8f0913]'
                                        : 'bg-[#F9F6EE] hover:bg-stone-300')
                            }`}
                        >

                        <div className="flex items-center gap-2">
                                <span className="text-black">
                                    <PaperIcon size={19}/>
                                </span>
                                <span className="text-sm truncate">{pdf.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && (
                <div className="p-3 border-gray-200 flex-shrink-0">
                    <Input
                        id="picture"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="cursor-pointer bg-[#FCFAF6] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isUploading && (
                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                    )}
                </div>
            )}
        </aside>
    );
}