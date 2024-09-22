import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Input } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import UserTable from '../components/Tables/UserTable';
import { useHistory } from 'react-router-dom';
import { getUsers } from '../apis/usersApi';

function Tables() {
  const [allData, setAllData] = useState([]); // Original data with servicesTaken count
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on search
  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;
  const history = useHistory();
  
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers(); // Fetch users from API
        // Simulate servicesTaken count for each user (you may replace this logic based on your actual service data)
        const mergedData = users.map(user => {
          const servicesTakenCount = Math.floor(Math.random() * 10); // Need to replace with the service api
          return { ...user, servicesTaken: servicesTakenCount };
        });
        setAllData(mergedData);
        setFilteredData(mergedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Filter data based on search query
  useEffect(() => {
    let filteredArray = allData.filter(user => 
      (`${user.firstName} ${user.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray);
  }, [searchQuery, allData]); 

  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage); 
  
  const goToProfile = (id) => {
    history.push(`/app/user/${id}`);
  };

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  return (
    <>
      <PageTitle>Users</PageTitle>
      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search by name..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <UserTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        goToProfile={goToProfile}
      />
    </>
  );
}

export default Tables;
