import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import {Input, Alert } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import PartsTable from '../components/Tables/PartsTable';
import {
  getParts,
  updatePart
} from '../apis/partsApi';
import { getMechanics } from '../apis/mechanicApi';

function Tables() {

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  // Pagination control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // Paginate data
  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  const fetchParts = async () => {
    try {
      const parts = await getParts();      
      const mechanics = await getMechanics();

      const mergedData = parts.map(part => {
        const mechanic = mechanics.find(m => m.id === part.mechanicID);
        return {
          ...part,
          mechanicName: mechanic ? mechanic.name : 'Unknown Mechanic'
        };
      });

      setAllData(mergedData);
      setFilteredData(mergedData);
    } catch (error) {
      console.error('Error fetching parts:', error);
      window.alert("Error")
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleDelete = (id) => {
    const updatedData = allData.filter(item => item.id !== id);
    setAllData(updatedData);
    setFilteredData(updatedData); // Update both states
  };

  const addToLibrary = async (id) => {

    try {
      await updatePart(id, {isApproved: true});
      window.alert('item added to library successfully!')
      fetchParts();
    } catch (error) {
      console.error('Error fetching parts:', error);
      window.alert('Error adding the Item!')
    }

  }

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredArray = allData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray.filter(item => item.isApproved === false));
  }, [searchQuery, allData]);

  return (
    <>
      <PageTitle>Approve Spare Parts</PageTitle>

      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search by name or description..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <PartsTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        addToLibrary={addToLibrary} //don't delete just approve it
        handleDelete={handleDelete} //don't delete just disapprove of it
        byMechanic={true}
      />
    </>
  );
}

export default Tables;
