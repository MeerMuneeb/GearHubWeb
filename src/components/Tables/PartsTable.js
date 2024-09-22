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
  Pagination
} from '@windmill/react-ui';
import { ApproveIcon, CrossIcon, EditIcon, TrashIcon } from '../../icons';

const TableComponent = ({
  dataTable2,
  totalResults,
  resultsPerPage,
  onPageChangeTable2,
  openEditModal,
  handleDelete,
  addToLibrary,
  byMechanic,
}) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    let sortedArray = [...dataTable2];
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

  const handleEdit = (id) => {
    openEditModal(id);
  };

  const handleDeleteWithSort = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  return (
    <TableContainer className="mb-8">
      <Table>
        <TableHeader>
          <tr>
            <TableCell>
              Image
            </TableCell>
            <TableCell onClick={() => requestSort('name')}>
              Name {getSortIcon('name')}
            </TableCell>
            <TableCell>
              Description
            </TableCell>
            <TableCell >
              Price
            </TableCell>
            {byMechanic && (
            <TableCell>
              Added by (Mechanic)
            </TableCell>
            )}
            <TableCell>Actions</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell style={{ width: 40, whiteSpace: 'nowrap' }}> 
                <div className="flex items-center">
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={item.img || "/img/default-avatar.jpg"}
                      className="w-full h-full object-cover"
                      alt="Product"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.role}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">$ {item.price}</span>
              </TableCell>
              {byMechanic && (
              <TableCell>
                <span className="text-sm">
                {
                  // Find the mechanic name based on the mechanicID
                  item.mechanicName
                }
                </span>
              </TableCell>              
              )}
              <TableCell>                
              {byMechanic ? (
                <div className="flex items-center space-x-3">
                  <Button
                    layout="link"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => addToLibrary(item.id)}
                  >
                    <ApproveIcon className="w-6 h-6 text-green-500" aria-hidden="true" />
                  </Button>            
                  <Button
                    layout="link"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => handleDeleteWithSort(item.id)}
                  >
                    <CrossIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
                  </Button>                  
                </div>
                ) : (                   
                <div className="flex items-center space-x-4">
                  <Button
                    layout="link"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => handleEdit(item.id)}
                  >
                    <EditIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>                  
                  <Button
                    layout="link"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => handleDeleteWithSort(item.id)}
                  >
                    <TrashIcon className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
                )}
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
