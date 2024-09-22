import React, { useEffect, useState } from 'react';
import ChartCard from '../components/Chart/ChartCard';
import { Line, Bar } from 'react-chartjs-2';
import { Button, Input } from '@windmill/react-ui';
import PageTitle from '../components/Typography/PageTitle';
import {
  serviceLineOptions,
  servicebarOptions,
  serviceDayLineOptions,
} from '../utils/demo/serviceChartsData';
import { BarChartIcon, SearchIcon, LineChartIcon } from '../icons';
import ServiceTable from '../components/Tables/ServiceTable';
import { useHistory } from 'react-router-dom';

// Importing API functions
import { getServices } from '../apis/servicesApi';
import { getUsers } from '../apis/usersApi';
import { getMechanics } from '../apis/mechanicApi';

function ServiceAnalytics() {
  const [style, setStyle] = useState('Line'); // State for chart style
  const [dataType, setDataType] = useState('Months'); // State for data type (Months or Days)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [allData, setAllData] = useState([]); // Full dataset
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on search query
  const [pageTable2, setPageTable2] = useState(1); // Pagination state
  const resultsPerPage = 10;
  const totalResults = filteredData.length;
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();

  // Toggle chart style (Line/Bar) and update button icon
  const toggleChartStyle = () => {
    setStyle((prevStyle) => (prevStyle === 'Line' ? 'Bar' : 'Line'));
  };

  //////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Fetch all services, mechanics, and users from their respective APIs
    const fetchData = async () => {
      try {
        const [services, users, mechanics] = await Promise.all([
          getServices(),
          getUsers(),
          getMechanics(),
        ]);

        // Merge service data with mechanic and user info
        const mergedData = services.map((service) => {
          const mechanic = mechanics.find((m) => m.id === service.mechanicID);
          const user = users.find((u) => u.id === service.userID);
          return {
            ...service,
            mechanicName: mechanic ? mechanic.name : 'Unknown Mechanic',
            userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown User',
          };
        });

        setAllData(mergedData);
        setFilteredData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  // Handle search functionality
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredArray = allData.filter(
      (service) =>
        service.mechanicName.toLowerCase().includes(lowercasedQuery) ||
        service.userName.toLowerCase().includes(lowercasedQuery) ||
        service.id.toString().includes(lowercasedQuery)
    );
    setFilteredData(filteredArray);
  }, [searchQuery, allData]);

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  const paginatedData = filteredData.slice(
    (pageTable2 - 1) * resultsPerPage,
    pageTable2 * resultsPerPage
  );

  const serviceDetails = (id) => {
    history.push(`/app/service/${id}`);
  };

  //////////////////////////////////////////////////////

  return (
    <>
      <PageTitle>Services Statistics</PageTitle>
      <div className="flex justify-between mb-4">
        <div>
          {/* Data type selector (Days or Months) */}
          <label className="dark:text-gray-100">Select Data Type: </label>
          <select
            id="dataType"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            <option value="Months">Months</option>
            <option value="Days">Days</option>
          </select>

          {/* Month and Year selectors for Days view */}
          {dataType === 'Days' && (
            <>
              <div>
                <label className="dark:text-gray-100">Select Year: </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {[2024, 2023, 2022].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="dark:text-gray-100">Select Month: </label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(0, month - 1).toLocaleString('en', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        <div>
          {/* Toggle button for Line/Bar chart */}
          <Button
            size="small"
            className="ml-2 flex items-center"
            onClick={toggleChartStyle}
          >
            {style === 'Line' ? (
              <BarChartIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <LineChartIcon className="w-6 h-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Render the selected chart */}
      <div className="grid gap-6 mb-4 md:grid-cols-1">
        {dataType === 'Months' ? (
          style === 'Line' ? (
            <ChartCard key="months-line-chart" className="w-full" title="Services Per Month">
              <Line {...serviceLineOptions(allData)} />
            </ChartCard>
          ) : (
            <ChartCard key="months-bar-chart" className="w-full" title="Services Per Month">
              <Bar {...servicebarOptions(allData)} />
            </ChartCard>
          )
        ) : (
          <ChartCard
            key={`days-line-chart-${selectedYear}-${selectedMonth}`}
            className="w-full"
            title={`Services for ${selectedYear} - Month ${selectedMonth}`}
          >
            <Line {...serviceDayLineOptions(allData, selectedYear, selectedMonth)} />
          </ChartCard>
        )}
      </div>

      <PageTitle>Services</PageTitle>
      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search by mechanic, user, or service ID..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ServiceTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        serviceDetails={serviceDetails}
      />
    </>
  );
}

export default ServiceAnalytics;
