import React, { useState, useEffect } from 'react';
import {
    Table,
    TableHeader,
    TableCell,
    TableBody,
    TableRow,
    TableFooter,
    TableContainer,
    Button,
    Pagination,
    Badge
  } from '@windmill/react-ui';
import { RightArrowIcon } from '../../icons';

const TableComponent = ({ dataTable2, totalResults, resultsPerPage, onPageChangeTable2, goToProfile }) => {
  const [sortedData, setSortedData] = useState(dataTable2);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const check = (id) => {
    // Find the user by id in the dataTable2
    const user = dataTable2.find(user => user.id === id);
  
    if (user) {
      // Display the name in an alert
      window.alert(`${user.firstName} ${user.lastName}`);
    } else {
      window.alert("User not found");
    }
  }
  
  

  useEffect(() => {
    let sortedArray = [...dataTable2];
    sortedArray.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortedData(sortedArray);
  }, [dataTable2, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell onClick={() => requestSort('name')}>User{getSortIcon('name')}</TableCell>
            <TableCell onClick={() => requestSort('vehicle')}>Vehicle{getSortIcon('vehicle')}</TableCell>
            <TableCell onClick={() => requestSort('dateJoined')}>Date Joined{getSortIcon('dateJoined')}</TableCell>
            <TableCell onClick={() => requestSort('servicesTaken')}>Services Taken{getSortIcon('servicesTaken')}</TableCell>
            <TableCell>Actions</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {sortedData.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center text-sm">
                  <img
                    src={user.img}
                    alt="user"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{`${user.firstName} ${user.lastName}`}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">{`${user.vehicleMake} ${user.vehicleModel}`}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{user.vehicleModelYear}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{user.dateJoined}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{user.servicesTaken}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <Button layout="link" size="icon" aria-label="Edit" onClick={() => check(user.id)}>
                    <RightArrowIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
