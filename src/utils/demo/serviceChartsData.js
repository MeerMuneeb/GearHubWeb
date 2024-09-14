import serviceData from './serviceData'

// Count services per month
const countServicesPerMonth = (services, year) => {
  const counts = Array(12).fill(0); // For 12 months
  services.forEach(service => {
    const [month, day, serviceYear] = service.date.split('/'); // Assuming date format is MM/DD/YYYY
    if (serviceYear == year) { // Filter for the specific year
      const monthIndex = parseInt(month, 10) - 1; // Convert month to zero-based index
      counts[monthIndex]++;
    }
  });
  return counts;
};

// Count services per day for a specific month and year
const countServicesPerDay = (services, year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // Get number of days in month
  const counts = Array(daysInMonth).fill(0); // For the number of days in the selected month
  services.forEach(service => {
    const [serviceMonth, day, serviceYear] = service.date.split('/');
    if (serviceYear == year && parseInt(serviceMonth, 10) === month) {
      const dayIndex = parseInt(day, 10) - 1; // Convert day to zero-based index
      counts[dayIndex]++;
    }
  });
  return counts;
};

// Get unique years from the dataset
const getUniqueYears = (services) => {
  const years = new Set();
  services.forEach(service => {
    const [, , year] = service.date.split('/');
    years.add(year);
  });
  return Array.from(years);
};

// Generate datasets for line chart by month
const generateLineDatasets = (services) => {
  const years = getUniqueYears(services);
  return years.map(year => ({
    label: year,
    backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, // Random color for each year
    borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    data: countServicesPerMonth(services, year),
    fill: false, // Line chart without fill
  }));
};

// Generate datasets for bar chart by month
const generateBarDatasets = (services) => {
  const years = getUniqueYears(services);
  return years.map(year => ({
    label: year,
    backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
    data: countServicesPerMonth(services, year)
  }));
};

// Generate datasets for chart by days in a month
const generateDayDatasets = (services, year, month) => {
  return [
    {
      label: `${year} - Month ${month}`,
      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      data: countServicesPerDay(services, year, month),
      fill: false, // Line chart without fill
    }
  ];
};

// Line chart options by months
export const serviceLineOptions = {
  data: {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ],
    datasets: generateLineDatasets(serviceData),
  },
  options: {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Month',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Number of Services',
        },
      },
    },
  },
  legend: {
    display: true,
  },
};

// Bar chart options by months
export const servicebarOptions = {
  data: {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ],
    datasets: generateBarDatasets(serviceData),
  },
  options: {
    responsive: true,
  },
  legend: {
    display: true,
  },
}

// Line chart options by days
export const serviceDayLineOptions = (year, month) => ({
  data: {
    labels: Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1), // Days of the month
    datasets: generateDayDatasets(serviceData, year, month),
  },
  options: {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Day of the Month',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 31,
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Number of Services',
        },
      },
    },
  },
  legend: {
    display: true,
  },
});
