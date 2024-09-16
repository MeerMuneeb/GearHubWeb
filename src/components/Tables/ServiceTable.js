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
import { RightArrowIcon } from '../../icons';

const TableComponent = ({ dataTable2, totalResults, resultsPerPage, onPageChangeTable2, serviceDetails }) => {
    const [sortedData, setSortedData] = useState(dataTable2);
    const [sortConfig, setSortConfig] = useState({ key: 'serviceID', direction: 'ascending' });

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
                        <TableCell onClick={() => requestSort('serviceID')}>Service ID{getSortIcon('serviceID')}</TableCell>
                        <TableCell onClick={() => requestSort('mechanicName')}>Mechanic Name{getSortIcon('mechanicName')}</TableCell>
                        <TableCell onClick={() => requestSort('userName')}>User Name{getSortIcon('userName')}</TableCell>
                        <TableCell onClick={() => requestSort('date')}>Completion Date{getSortIcon('date')}</TableCell>
                        <TableCell onClick={() => requestSort('time')}>Completion Time{getSortIcon('time')}</TableCell>
                        <TableCell onClick={() => requestSort('price')}>Price{getSortIcon('price')}</TableCell>
                        <TableCell>Actions</TableCell>
                    </tr>
                </TableHeader>
                <TableBody>
                    {sortedData.map((service) => (
                        <TableRow key={service.id}>
                            <TableCell>
                                <span className="text-sm">{service.id}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-semibold">{service.mechanicName}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-semibold">{service.userName}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{service.date}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{`${service.serviceTime} min`}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{service.price}</span>
                            </TableCell>
                            <TableCell>
                                <Button layout="link" size="icon" aria-label="Profile" onClick={() => serviceDetails(service.id)}>
                                    <RightArrowIcon className="w-5 h-5" aria-hidden="true" />
                                </Button>
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
