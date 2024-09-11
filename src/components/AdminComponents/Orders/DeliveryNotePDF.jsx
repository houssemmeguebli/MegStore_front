import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DeliveryNotePDF = ({ order, totalPrice }) => {
    const [signatureURL, setSignatureURL] = useState('');
    const signatureRef = useRef(null);

    // Save signature automatically when drawing is complete
    useEffect(() => {
        const handleSaveSignature = () => {
            if (signatureRef.current && !signatureURL && !signatureRef.current.isEmpty()) {
                setSignatureURL(signatureRef.current.toDataURL());
            }
        };

        const canvas = signatureRef.current.getCanvas();
        canvas.addEventListener('mouseup', handleSaveSignature);
        return () => canvas.removeEventListener('mouseup', handleSaveSignature);
    }, [signatureURL]);

    const clearSignature = () => {
        signatureRef.current.clear();
        setSignatureURL('');
    };

    const generateBonDeLivraisonPDF = () => {
        const doc = new jsPDF();
        const todayDate = new Date().toLocaleDateString();

        // Add Company Header or Logo
        doc.setFontSize(20);
        doc.setTextColor(40, 44, 47);
        doc.text('MegStore', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('123 Company Address, City, Country', 105, 28, { align: 'center' });
        doc.text('Phone: +123 456 789 | Email: info@megstore.com', 105, 34, { align: 'center' });

        // Line Break
        doc.setLineWidth(0.5);
        doc.line(14, 40, 196, 40);

        // Title Section
        doc.setFontSize(18);
        doc.setTextColor(0);
        doc.text('Delivery Note', 14, 50);

        // Order Details Section
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Order ID: ${order.orderId}`, 14, 65);
        doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, 75);
        doc.text(`Customer Name: ${order.customerName}`, 14, 85);
        doc.text(`Customer Address: ${order.customerAddress}`, 14, 95);
        doc.text(`Order Status: ${order.orderStatus}`, 14, 105);

        // Line Break
        doc.line(14, 110, 196, 110);

        // Products Table
        const products = order.products.map(product => [
            product.productName,
            product.itemQuantiy,
            `$${product.productPrice.toFixed(2)}`,
            `$${(product.productPrice * product.itemQuantiy).toFixed(2)}`
        ]);

        doc.autoTable({
            head: [['Product Name', 'Quantity', 'Price', 'Total']],
            body: products,
            startY: 120,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185], // Blue header
                textColor: [255, 255, 255], // White text in header
                halign: 'center'
            },
            bodyStyles: { valign: 'middle', halign: 'center' },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        // Total Price
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 15);

        // Signature Section
        const pageHeight = doc.internal.pageSize.height;

        if (signatureURL) {
            doc.addImage(signatureURL, 'PNG', 150, pageHeight - 60, 40, 20);
            doc.text(`Date: ${todayDate}`, 150, pageHeight - 30);
        } else {
            doc.text(' Signature:', 150, pageHeight - 60);
            doc.text(`Date: ${todayDate}`, 150, pageHeight - 30);

        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for your purchase!', 105, pageHeight - 20, { align: 'center' });
        doc.text('For any inquiries, contact us at info@megstore.com.', 105, pageHeight - 10, { align: 'center' });

        // Create PDF as a Blob
        const pdfBlob = doc.output('blob');
        const blobURL = URL.createObjectURL(pdfBlob);
        window.open(blobURL, '_blank');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4"> Signature</h2>
            <SignatureCanvas
                ref={signatureRef}
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas border rounded-lg' }}
                backgroundColor="#f5f5f5"
            />
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={clearSignature}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Clear Signature
                </button>
                <button
                    onClick={generateBonDeLivraisonPDF}
                    className="px-4 py-2 bg-green-500  rounded-lg hover:bg-green-600 transition-colors"
                >
                    Generate PDF
                </button>
            </div>
        </div>
    );
};

export default DeliveryNotePDF;
