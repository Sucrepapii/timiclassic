import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image
} from '@react-pdf/renderer';

// Define styling
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    color: '#333333',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37', // Gold Accent
    paddingBottom: 20,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  businessName: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#050505',
  },
  businessSubtitle: {
    fontSize: 8,
    letterSpacing: 3,
    color: '#d4af37',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
    textAlign: 'right',
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#8e8e88',
    textAlign: 'right',
    marginTop: 4,
  },
  metaContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metaBlock: {
    width: '45%',
  },
  metaTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#d4af37',
    marginBottom: 5,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  metaText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  table: {
    marginTop: 10,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#050505',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1b12',
  },
  tableHeaderCol: {
    fontSize: 8,
    color: '#d4af37',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    padding: 10,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 10,
    color: '#333333',
  },
  descCol: { width: '55%' },
  qtyCol: { width: '15%', textAlign: 'center' },
  priceCol: { width: '30%', textAlign: 'right' },
  summaryContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  summaryBlock: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#8e8e88',
    textTransform: 'uppercase',
    fontWeight: 'medium',
  },
  summaryValue: {
    fontSize: 10,
    color: '#333333',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#d4af37',
    paddingTop: 8,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 10,
    color: '#050505',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  grandTotalValue: {
    fontSize: 12,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 15,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#8e8e88',
    lineHeight: 1.4,
  },
});

interface InvoicePDFProps {
  order: {
    orderNumber: string;
    createdAt: string;
    dueDate: string | null;
    totalAmount: number | null;
    depositPaid: number | null;
    balanceDue: number | null;
    status: string;
    notes: string | null;
    client: {
      firstName: string;
      lastName: string;
      email: string | null;
      phone: string | null;
      address: string | null;
    };
    garments: {
      id: string;
      name: string;
      description: string | null;
      fabricType: string | null;
      color: string | null;
    }[];
  };
}

export function InvoicePDF({ order }: InvoicePDFProps) {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString();
  const deliveryDate = order.dueDate ? new Date(order.dueDate).toLocaleDateString() : 'N/A';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image src="/logo.jpg" style={{ width: 45, height: 45, borderRadius: 22.5 }} />
            <View>
              <Text style={styles.businessName}>TIMICLASSIC</Text>
              <Text style={styles.businessSubtitle}>Bespoke Fashion House</Text>
            </View>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>No: {order.orderNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {invoiceDate}</Text>
          </View>
        </View>

        {/* Client & Billing Info */}
        <View style={styles.metaContainer}>
          <View style={styles.metaBlock}>
            <Text style={styles.metaTitle}>Client Profile</Text>
            <Text style={styles.metaText}>{order.client.firstName} {order.client.lastName}</Text>
            {order.client.address && <Text style={styles.metaText}>{order.client.address}</Text>}
            {order.client.phone && <Text style={styles.metaText}>Phone: {order.client.phone}</Text>}
            {order.client.email && <Text style={styles.metaText}>Email: {order.client.email}</Text>}
          </View>
          <View style={styles.metaBlock}>
            <Text style={styles.metaTitle}>Order Logistics</Text>
            <Text style={styles.metaText}>Status: {order.status === 'DONE' ? 'Completed' : 'Active Production'}</Text>
            <Text style={styles.metaText}>Delivery Target: {deliveryDate}</Text>
          </View>
        </View>

        {/* Itemized Garments Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableHeaderCol, styles.descCol]}>
              <Text>Garment Description & Details</Text>
            </View>
            <View style={[styles.tableHeaderCol, styles.qtyCol]}>
              <Text>Qty</Text>
            </View>
            <View style={[styles.tableHeaderCol, styles.priceCol]}>
              <Text>Unit Price</Text>
            </View>
          </View>

          {order.garments.map((garment, idx) => (
            <View key={garment.id} style={styles.tableRow}>
              <View style={styles.descCol}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{garment.name}</Text>
                <Text style={[styles.tableCell, { fontSize: 8, color: '#8e8e88', marginTop: 2 }]}>
                  Fabric: {garment.fabricType || 'Bespoke Sourced'} | Color: {garment.color || 'Custom dyed'}
                </Text>
                {garment.description && (
                  <Text style={[styles.tableCell, { fontSize: 8, color: '#555555', marginTop: 2, fontStyle: 'italic' }]}>
                    Specs: {garment.description}
                  </Text>
                )}
              </View>
              <View style={styles.qtyCol}>
                <Text style={styles.tableCell}>1</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.tableCell}>
                  ₦{idx === 0 ? (order.totalAmount || 0).toFixed(2) : '0.00'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Invoice Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryValue}>₦{(order.totalAmount || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deposit Received:</Text>
              <Text style={styles.summaryValue}>
                -₦{(order.depositPaid || 0).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, { marginTop: 8, borderTopWidth: 1, borderTopColor: '#e5e5e5', paddingTop: 8 }]}>
              <Text style={[styles.summaryLabel, { fontSize: 12, color: '#000' }]}>Balance Due:</Text>
              <Text style={[styles.summaryValue, { fontSize: 12, color: '#000' }]}>
                ₦{(order.balanceDue || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Notes */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for choosing Timiclassic Bespoke Clothing.</Text>
          <Text style={[styles.footerText, { marginTop: 3, fontSize: 8, color: '#050505' }]}>
            Remit payment to: [ACCOUNT NUMBER] (Timiclassic Bank)
          </Text>
          <Text style={[styles.footerText, { marginTop: 5, fontSize: 6 }]}>
            Payments are non-refundable for custom-cut textiles. Terms: 80% deposit, 20% due at final fitting.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
