import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '../Icons';

interface ResultDisplayProps {
  content: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatContent = (text: string) => {
    let formattedText = text;

    // Process Tables first to avoid conflicts with other markdown
    const tableRegex = /^\|(.+)\|\s*\n\|( *[-:]+ *\|)+\s*\n((?:\|.*\|\s*\n?)*)/gm;
    formattedText = formattedText.replace(tableRegex, (match) => {
        // This is a simplified parser. A robust library would be better for complex cases.
        try {
            const lines = match.trim().split('\n');
            const headerCells = lines[0].split('|').slice(1, -1).map(h => h.trim());
            const rows = lines.slice(2).map(rowLine => rowLine.split('|').slice(1, -1).map(c => c.trim()));

            const renderCellContent = (cell: string) => {
                return cell
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">$1</a>');
            };

            let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse text-sm">';
            tableHtml += '<thead><tr class="bg-gray-100 dark:bg-gray-700">';
            headerCells.forEach(header => {
                tableHtml += `<th class="border dark:border-gray-600 px-4 py-2 text-left font-semibold">${header}</th>`;
            });
            tableHtml += '</tr></thead>';

            tableHtml += '<tbody>';
            rows.forEach(row => {
                if (row.length === headerCells.length) {
                    tableHtml += '<tr class="border-t dark:border-gray-600 even:bg-gray-50 dark:even:bg-gray-900/50">';
                    row.forEach(cell => {
                        tableHtml += `<td class="border dark:border-gray-600 px-4 py-2 align-top">${renderCellContent(cell)}</td>`;
                    });
                    tableHtml += '</tr>';
                }
            });
            tableHtml += '</tbody></table></div>';
            return tableHtml;
        } catch (e) {
            console.error("Error parsing table:", e);
            return match; // Return original text if parsing fails
        }
    });

    // Process other markdown elements on the text that is not a table
    let html = formattedText
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/(\r\n|\n|\r)/gm, '<br>')
        .replace(/(<br>){2,}/g, '<br><br>') // Consolidate multiple breaks
        .replace(/<br><li/g, '<li')
        .replace(/<\/div><br>/g, '</div>'); // Remove extra space after tables

    return { __html: html };
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
       <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition z-10"
        title="Copy to clipboard"
        aria-label="Copy content to clipboard"
      >
        {copied ? <CheckIcon className="text-green-500" /> : <ClipboardDocumentIcon />}
      </button>
      <div className="prose prose-indigo dark:prose-invert max-w-none" dangerouslySetInnerHTML={formatContent(content)} />
    </div>
  );
};

export default ResultDisplay;