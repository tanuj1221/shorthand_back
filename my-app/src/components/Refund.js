import React from 'react';

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: 1.6,
    margin: 0,
    padding: 0,
    backgroundColor: '#f4f4f4'
  },
  refundPolicy: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  h1: {
    fontSize: '2em',
    color: '#333333',
    textAlign: 'center',
    marginBottom: '20px'
  },
  p: {
    fontSize: '1em',
    color: '#666666',
    margin: '10px 0'
  }
};

function Refund() {
  return (
    <div style={styles.refundPolicy}>
      <h1 style={styles.h1}>Refund/Cancellation Policy</h1>
      <p style={styles.p}>Amount once paid is not refundable / not transferable / non-cancellable.</p>
      <p style={styles.p}>Refunds are typically processed within 5-7 working days from the date the request is received and approved.</p>

      <p style={styles.p}>Shipping and Exchange.</p>
      <p style={styles.p}>Instant delivery by website. Amount once paid is non-refundable and non-transferable.</p>
    </div>
  );
}

export default Refund;