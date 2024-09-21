import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from "@mui/material";

const DeliveryNotePDF = ({ order, totalPrice, products }) => {
    const [signatureURL, setSignatureURL] = useState('');
    const signatureRef = useRef(null);

    useEffect(() => {
        const handleSaveSignature = () => {
            if (signatureRef.current && !signatureURL && !signatureRef.current.isEmpty()) {
                setSignatureURL(signatureRef.current.toDataURL());
            }
        };

        const canvas = signatureRef.current.getCanvas();
        canvas.addEventListener('mouseup', handleSaveSignature);
        canvas.addEventListener('touchend', handleSaveSignature);

        return () => {
            canvas.removeEventListener('mouseup', handleSaveSignature);
            canvas.removeEventListener('touchend', handleSaveSignature);
        };
    }, [signatureURL]);

    const clearSignature = () => {
        signatureRef.current.clear();
        setSignatureURL('');
    };

    const productsMap = new Map(products.map(product => [product.productId, product]));

    const generateBonDeLivraisonPDF = () => {
        const doc = new jsPDF();
        const todayDate = new Date().toLocaleDateString();

        // Company Header
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

        // Title
        doc.setFontSize(18);
        doc.setTextColor(0);
        doc.text('Delivery Note', 14, 50);

        // Order Details
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Order ID: ${order.orderId}`, 14, 65);
        doc.text(`Order Date: ${new Date(order.orderDate).toLocaleDateString()}`, 14, 75);
        doc.text(`Customer Name: ${order.customerName}`, 14, 85);
        doc.text(`Customer Phone: ${order.customerPhone}`, 14, 95);
        doc.text(`Customer Address: ${order.customerAddress}`, 14, 105);
        // Line Break
        doc.line(14, 110, 196, 110);

        // Map orderItems to products
        const items = order.orderItems.map(item => {
            const product = productsMap.get(item.productId);
            const originalPrice = product?.productPrice || 0;
            const discountPercentage = product?.discountPercentage || 0;
            const finalPrice = originalPrice * (1 - discountPercentage / 100);
            const totalPrice = finalPrice * item.quantity;

            return [
                product?.productName || 'N/A',
                item.quantity || 0,
                `$${originalPrice.toFixed(2)}`, // Original Price
                `${discountPercentage}%`, // Discount Percentage
                `$${finalPrice.toFixed(2)}`, // Final Price after discount
                `$${totalPrice.toFixed(2)}` // Total Price
            ];
        });

        doc.autoTable({
            head: [['Product Name', 'Quantity', 'Original Price', 'Discount %', 'Final Price', 'Total']],
            body: items,
            startY: 120,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            bodyStyles: { valign: 'middle', halign: 'center' },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        // Total Price
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 160, doc.autoTable.previous.finalY + 15);

        // Signature Section
        const pageHeight = doc.internal.pageSize.height;

        if (signatureURL) {
            doc.addImage(signatureURL, 'PNG', 150, pageHeight - 60, 40, 20);
            doc.text(`Date: ${todayDate}`, 150, pageHeight - 30);
        } else {
            doc.text('Signature:', 150, pageHeight - 60);
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 p-4">Signature</h2>
            <SignatureCanvas
                ref={signatureRef}
                canvasProps={{ width: 500, height: 200, className: 'sigCanvas border rounded-lg m-2' }}
                backgroundColor="#f5f5f5"
            />
            <div className="mt-4 flex space-x-4 p-4 justify-center">
                <Button onClick={clearSignature} variant="contained" color="white">
                    Clear Signature
                </Button>
                <Button onClick={generateBonDeLivraisonPDF} variant="contained" color="primary" sx={{ marginLeft: "5px" }}>
                    Generate PDF
                </Button>
            </div>
        </div>
    );
};

export default DeliveryNotePDF;
