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
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../../icons';

const TableComponent = ({
  dataTable2,
  totalResults,
  resultsPerPage,
  onPageChangeTable2,
  openEditModal,
  handleDelete,
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
    <TableContainer>
      <Table>
        <TableBody>
          {sortedData.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>
                <div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{admin.name}</p>
                    <span className="text-xs">{new Date(admin.date).toLocaleDateString()}</span>                 
                  </div>
                  <div className="flex justify-between">
                    <p className="font-semibold">{admin.role}</p>
                    <Button
                      layout="link"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => handleDeleteWithSort(admin.id)}
                    >
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
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
