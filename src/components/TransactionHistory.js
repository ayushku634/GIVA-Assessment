import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaMinusCircle, FaEdit, FaCircle } from 'react-icons/fa';
import '../styles/TransactionHistory.css';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5006/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const getIcon = (action) => {
    switch (action) {
      case 'add':
        return <FaPlusCircle style={{ color: 'green' }} />;
      case 'edit':
        return <FaEdit style={{ color: 'orange' }} />;
      case 'delete':
        return <FaMinusCircle style={{ color: 'red' }} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Transaction History</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Product ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{getIcon(transaction.action)} {transaction.action}</td>
              <td>{transaction.product_id}</td>
              <td>{transaction.name}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.quantity}</td>
              <td>{new Date(transaction.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
