import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create PDF component
const MyPDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Dynamic PDF Report</Text>
        <Text>{JSON.stringify(data)}</Text> {/* Render your dynamic data here */}
      </View>
    </Page>
  </Document>
);

export default MyPDFDocument;
