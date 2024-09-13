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

const TableComponent = ({ dataTable2, totalResults, resultsPerPage, onPageChangeTable2, goToProfile, toggleNotVerified }) => {
  const [sortedData, setSortedData] = useState(dataTable2);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const check = (id) => {
    // Find the mechanic by id in the dataTable2
    const mechanic = dataTable2.find(mechanic => mechanic.id === id);
  
    if (mechanic) {
      // Display the name in an alert
      window.alert(mechanic.name);
    } else {
      window.alert("mechanic not found");
    }
  };
  
  

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
    if(key === 'verified') {
      toggleNotVerified();
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
            <TableCell onClick={() => requestSort('name')}>Mechanic {getSortIcon('name')}</TableCell>
            <TableCell onClick={() => requestSort('cnic')}>CNIC {getSortIcon('cnic')}</TableCell>
            <TableCell onClick={() => requestSort('phoneNumber')}>Phone Number {getSortIcon('phoneNumber')}</TableCell>
            <TableCell onClick={() => requestSort('verified')}>Status {getSortIcon('verified')}</TableCell>
            <TableCell>Actions</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {sortedData.map((mechanic) => (
            <TableRow key={mechanic.id}>
              <TableCell>
                <div className="flex items-center text-sm">
                  <img
                    src={mechanic.img}
                    alt="Mechanic"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{mechanic.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{mechanic.workshopName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{mechanic.cnic}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{mechanic.phoneNumber}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {mechanic.verified ? (
                    <Badge type="success">Verified</Badge>
                  ) : (
                    <Badge type="warning">Not Verified</Badge>
                  )}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Button layout="link" size="icon" aria-label="Edit" onClick={() => goToProfile(mechanic.id)}>
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
