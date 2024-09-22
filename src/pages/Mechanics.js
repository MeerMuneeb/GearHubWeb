import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Input } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import MechanicTable from '../components/Tables/MechanicTable';
import { useHistory } from 'react-router-dom';
import { getMechanics } from '../apis/mechanicApi'; 

function Tables() {
  const [allData, setAllData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]);
  const [pageTable2, setPageTable2] = useState(1);
  const [showNotVerified, setShowNotVerified] = useState(false);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const mechanics = await getMechanics(); 
        setAllData(mechanics); 
        setFilteredData(mechanics);
        setLoading(false); 
      } catch (err) {
        setError('Failed to fetch mechanics');
        setLoading(false); 
      }
    };
    fetchMechanics(); 
  }, []);

  useEffect(() => {
    let filteredArray = allData.filter(mechanic => 
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.workshopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.cnic.includes(searchQuery)
    );

    if (showNotVerified) {
      filteredArray = filteredArray.filter(mechanic => mechanic.verified === false);
    }

    setFilteredData(filteredArray);
  }, [searchQuery, allData, showNotVerified]);

  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  const toggleNotVerified = () => {
    setShowNotVerified(prev => !prev);
  };

  const goToProfile = (id) => {
    history.push(`/app/mechanic/${id}`);
  };

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  if (loading) {
    return <p>Loading mechanics...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <>
      <PageTitle>Mechanics</PageTitle>
      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search by CNIC, name or workshop..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <MechanicTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        goToProfile={goToProfile}
        toggleNotVerified={toggleNotVerified}
      />
    </>
  )
}

export default Tables
