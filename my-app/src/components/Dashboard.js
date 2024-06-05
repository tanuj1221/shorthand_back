import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';  // Needed for Chart.js v3

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['Paid', 'Pending'],
    datasets: [{
      label: 'Payment Status',
      data: [0, 0],  // Initial data set to zero
      backgroundColor: [
        'rgba(75, 192, 192, 0.2)',  // Green for Paid
        'rgba(255, 99, 132, 0.2)'   // Red for Pending
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getstudents');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (students && students.length > 0) {
      const newPaidCount = students.filter(student => student.amount === 'paid').length;
      const newPendingCount = students.filter(student => student.amount === 'pending').length;
      setPaidCount(newPaidCount);
      setPendingCount(newPendingCount);

      setChartData({
        labels: ['Paid', 'Pending'],
        datasets: [{
          label: 'Payment Status',
          data: [newPaidCount, newPendingCount],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',  // Green
            'rgba(255, 99, 132, 0.2)',  // Red
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        }]
      });
    }
  }, [students]);  // Re-calculate when students data changes

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '60%' }}>
        <h1>Student Payment Status</h1>
        <Pie data={chartData} />
      </div>
      <div style={{ width: '40%', padding: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
        <h2>Summary</h2>
        <p><strong>Paid Students:</strong> {paidCount}</p>
        <p><strong>Pending Students:</strong> {pendingCount}</p>
      </div>
    </div>
  );
}

export default Dashboard;