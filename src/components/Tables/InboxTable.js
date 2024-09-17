import React, { useState, useEffect } from 'react';
import {
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
} from '@windmill/react-ui';
import { DotIcon, TrashIcon } from '../../icons';

const TableComponent = ({ dataTable2, totalResults, resultsPerPage, onPageChangeTable2, handleDelete, handleSelect }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'senderName', direction: 'ascending' });
  const [messages, setMessages] = useState(dataTable2);

  // Update the messages state when dataTable2 prop changes
  useEffect(() => {
    setMessages(dataTable2);
  }, [dataTable2]);

  useEffect(() => {
    let sortedArray = [...messages];
    sortedArray.sort((a, b) => {
      if (a[sortConfig.key]?.toLowerCase() < b[sortConfig.key]?.toLowerCase()) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key]?.toLowerCase() > b[sortConfig.key]?.toLowerCase()) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortedData(sortedArray);
  }, [messages, sortConfig]);

  const handleDeleteWithSort = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  // Mark the message as read when clicked
  const handleSelectMessage = (id) => {
    setMessages(prevMessages => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isRead: true } : msg
      );
      return updatedMessages;
    });
    handleSelect(id); // Call the parent function after marking it as read
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleSelectMessage(ticket.id)}
                >
                  <div>
                    <div className="flex justify-between">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{ticket.senderName}</p>
                      <span className="text-xs">{new Date(ticket.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      {ticket.isRead ? (
                        <p className="font-normal">
                          {ticket.subject.length > 20 ? `${ticket.subject.substring(0, 20)}...` : ticket.subject}
                        </p>
                      ):(
                        <span style={{marginLeft: '-5px'}} className="flex font-bold items-center justify-center">
                          <DotIcon className='w-3 h-3 mr-1 text-orange-500'/>{ticket.subject.length > 20 ? `${ticket.subject.substring(0, 20)}...` : ticket.subject}
                        </span>
                      )}                      
                      <Button
                        layout="link"
                        size="icon"
                        aria-label="Delete"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents click event from bubbling up to TableCell
                          handleDeleteWithSort(ticket.id);
                        }}
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6">
                <p className="text-center">No data available</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TableFooter>
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable2}
          label="Table navigation"
        />
      </TableFooter>
    </TableContainer>
  );
};

export default TableComponent;
