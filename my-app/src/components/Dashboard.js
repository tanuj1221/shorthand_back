import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['Paid', 'Pending'],
    datasets: [{
      label: 'Payment Status',
      data: [0, 0],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2
    }]
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://shorthandexam.in/getstudents');
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
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 2,
        }]
      });
    }
  }, [students]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Payment Status</h1>
      <div className="dashboard-content">
        <div className="chart-container">
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="summary-container">
          <h2 className="summary-title">Summary</h2>
          <div className="summary-item">
            <span className="summary-label">Paid Students:</span>
            <span className="summary-value paid">{paidCount}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending Students:</span>
            <span className="summary-value pending">{pendingCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;