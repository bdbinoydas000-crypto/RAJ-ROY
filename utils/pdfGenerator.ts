import type { Order } from '../types';

// These are loaded from CDN in index.html, so we declare them as globals for TypeScript
declare const jspdf: any;

export const generateOrderPdf = (order: Order, t: (key: string) => string) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(t('appName'), 14, 22);

    doc.setFontSize(16);
    doc.text('Order Receipt', 14, 32);

    // Order Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.id}`, 14, 45);
    doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, 14, 50);
    doc.text(`Status: ${order.status}`, 14, 55);

    // Shipping Address
    if (order.shippingAddress) {
        const { fullName, address, city, pincode } = order.shippingAddress;
        doc.setFont('helvetica', 'bold');
        doc.text('Shipping To:', 120, 45);
        doc.setFont('helvetica', 'normal');
        doc.text(fullName, 120, 50);
        doc.text(address, 120, 55);
        doc.text(`${city}, ${pincode}`, 120, 60);
    }

    // Items Table
    const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
    const tableRows = order.items.map(item => {
        const itemPrice = item.variation?.price ?? item.product.price;
        const itemName = `${t(item.product.nameKey)}${item.variation ? ` - ${t(item.variation.nameKey)}` : ''}`;
        return [
            itemName,
            item.quantity,
            `₹${itemPrice.toFixed(2)}`,
            `₹${(itemPrice * item.quantity).toFixed(2)}`,
        ];
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        headStyles: { fillColor: [88, 28, 135] }, // Purple
    });

    // Totals
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    const rightAlignX = 196;

    doc.setFontSize(10);
    doc.text('Subtotal:', 150, finalY);
    doc.text(`₹${order.subtotal?.toFixed(2) ?? '0.00'}`, rightAlignX, finalY, { align: 'right' });

    if (order.shipping !== undefined) {
        finalY += 7;
        doc.text('Shipping:', 150, finalY);
        doc.text(`₹${order.shipping.toFixed(2)}`, rightAlignX, finalY, { align: 'right' });
    }

    if (order.discount !== undefined && order.discount > 0) {
        finalY += 7;
        doc.text('Discount:', 150, finalY);
        doc.text(`-₹${order.discount.toFixed(2)}`, rightAlignX, finalY, { align: 'right' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    finalY += 10;
    doc.text('Total:', 150, finalY);
    doc.text(`₹${order.total.toFixed(2)}`, rightAlignX, finalY, { align: 'right' });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text('Thank you for your purchase!', 14, 285);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 14, 285, { align: 'right' });
    }

    // Save
    doc.save(`receipt-${order.id}.pdf`);
};
