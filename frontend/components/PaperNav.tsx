'use client';

import {useState} from "react";

interface PaperNavProps {
    onSelectPdf: (pdfUrl: string) => void;
    title?: string;
    textColor?: string;
}

const samplePdfs = [
    { name: 'Research Paper 1', url: '/pdfs/paper1.pdf' },
    { name: 'Research Paper 2', url: '/pdfs/paper2.pdf' },
    { name: 'Research Paper 3', url: '/pdfs/paper3.pdf' },
];

export default function PaperNav({
                      onSelectPdf,
                      title = 'PAPER DIRECTORY',
                      textColor = 'text-white'
                  }: PaperNavProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handlePdfClick = (pdf, index) => {
        setSelectedIndex(index);
        onSelectPdf(pdf.url);
    };

    return (
        <aside
            className={`flex flex-col border-l border-gray-200 bg-white transition-all duration-300 ${
                isOpen ? 'w-64' : 'w-16'
            }`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between bg-maroon h-12 px-3 font-bold text-lg ${textColor}`}>
                {isOpen && <span>{title}</span>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="focus:outline-none"
                    title={isOpen ? 'Collapse' : 'Expand'}
                >
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>
            {/* List */}
            {isOpen && (
                <ul className="m-0 p-0">
                    {samplePdfs.map((pdf, index) => (
                        <li
                            key={index}
                            onClick={() => handlePdfClick(pdf, index)}
                            className={`px-3 py-2 cursor-pointer list-none transition-colors ${
                                selectedIndex === index
                                    ? 'bg-blue-100 border-l-4 border-blue-500'
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-red-500">📄</span>
                                <span className="text-sm">{pdf.name}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}