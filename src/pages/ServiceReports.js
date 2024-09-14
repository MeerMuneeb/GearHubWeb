import React, { useState } from 'react';
import ChartCard from '../components/Chart/ChartCard';
import { Line, Bar } from 'react-chartjs-2';
import {Button} from '@windmill/react-ui'
import PageTitle from '../components/Typography/PageTitle';
import {
  serviceLineOptions,
  servicebarOptions,
  serviceDayLineOptions,
} from '../utils/demo/serviceChartsData';
import { BarChartIcon, ChartsIcon, LineChartIcon } from '../icons'; // Icons for chart types

function Charts() {
  const [style, setStyle] = useState('Line'); // State for chart style
  const [dataType, setDataType] = useState('Months'); // State for data type (Months or Days)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month

  // Toggle chart style (Line/Bar) and update button icon
  const toggleChartStyle = () => {
    setStyle((prevStyle) => (prevStyle === 'Line' ? 'Bar' : 'Line'));
  };

  // Handle chart rendering based on style and data type
  let chart;

  if (dataType === 'Months') {
    // Monthly data charts
    switch (style) {
      case 'Line':
        chart = (
          <ChartCard className="w-full" title="Services Per Month">
            <Line {...serviceLineOptions} />
          </ChartCard>
        );
        break;
      case 'Bar':
        chart = (
          <ChartCard className="w-full" title="Services Per Month">
            <Bar {...servicebarOptions} />
          </ChartCard>
        );
        break;
      default:
        chart = <p>No chart available</p>;
    }
  } else if (dataType === 'Days') {
    // Daily data chart for selected month and year
    chart = (
      <ChartCard className="w-full" title={`Services for ${selectedYear} - Month ${selectedMonth}`}>
        <Line {...serviceDayLineOptions(selectedYear, selectedMonth)} />
      </ChartCard>
    );
  }

  return (
    <>
      <PageTitle>Services Reports</PageTitle>
      <div className='flex justify-between mb-4'>
        <div>
          {/* Data type selector (Days or Months) */}
          <label>Select Data Type:</label>
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
                <label>Select Year:</label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {/* You can generate years dynamically or hardcode them */}
                  {[2024, 2023, 2022].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Select Month:</label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
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
              {style === 'Line' ? <BarChartIcon className="w-6 h-6" aria-hidden="true"/> : <LineChartIcon className="w-6 h-6" aria-hidden="true"/>}         
          </Button>
        </div>
      </div>

      {/* Render the selected chart */}
      <div className="grid gap-6 mb-8 md:grid-cols-1">{chart}</div>
    </>
  );
}

export default Charts;
