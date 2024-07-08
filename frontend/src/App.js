import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(3); // March is the default month
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  useEffect(() => {
    fetchStatistics();
    fetchBarChartData();
  }, [month]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/transactions`, {
        params: {
          month,
          search,
          page,
          perPage: 10
        }
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/statistics`, {
        params: { month }
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/bar-chart`, {
        params: { month }
      });
      const labels = response.data.map(item => item.range);
      const data = response.data.map(item => item.count);
      setBarChartData({
        labels,
        datasets: [{
          label: 'Number of Items',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to the first page
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="App">
      <h1>Transaction List</h1>

      <div className="controls">
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="statistics">
        <div className="stat-box">
          <h3>Total Sale Amount</h3>
          <p>${statistics.totalSaleAmount.toFixed(2)}</p>
        </div>
        <div className="stat-box">
          <h3>Total Sold Items</h3>
          <p>{statistics.totalSoldItems}</p>
        </div>
        <div className="stat-box">
          <h3>Total Not Sold Items</h3>
          <p>{statistics.totalNotSoldItems}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td><img src={transaction.image} alt={transaction.title} style={{ width: '50px' }} /></td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>

      <div className="barchart">
      <h2 >Transactions Bar Chart</h2>
      <Bar
        data={barChartData}
        options={{
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }}
      />
      </div>
    </div>
  );
};

export default App;
