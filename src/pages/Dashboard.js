import React, { useState, useEffect } from 'react';

import InfoCard from '../components/Cards/InfoCard';
import ChartCard from '../components/Chart/ChartCard';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartLegend from '../components/Chart/ChartLegend';
import PageTitle from '../components/Typography/PageTitle';
import { ChatIcon, PeopleIcon, ApprovalIcon, ToolsIcon } from '../icons';
import RoundIcon from '../components/RoundIcon';
import response from '../utils/demo/tableData';
import { getServices } from '../apis/servicesApi.js';
import { getUsers } from '../apis/usersApi';
import { getMechanics } from '../apis/mechanicApi';
import { getTickets } from '../apis/ticketsApi';
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui';

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../utils/demo/chartsData';
import { serviceLineOptions } from '../utils/demo/serviceChartsData';

function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsData, usersData, mechanicsData, servicesData] = await Promise.all([
          getTickets(),
          getUsers(),
          getMechanics(),
          getServices(),
        ]);

        if (ticketsData && usersData && mechanicsData && servicesData) {
          setTickets(ticketsData);
          setUsers(usersData);
          setMechanics(mechanicsData);
          setServices(servicesData);
        } else {
          throw new Error('Incomplete data received');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle pagination
  useEffect(() => {
    setData(response.slice((page - 1) * 10, page * 10)); // Assume response is a static data array for table
  }, [page]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  //////////////////////////////

  const nonVerifiedMechanics = mechanics.filter((mechanic) => mechanic.verified === false);
  const nonVerifiedCount = nonVerifiedMechanics.length;
  const newTickets = tickets.filter((ticket) => ticket.isRead === false);

  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }


  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Users" value={users.length}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Mechanics" value={mechanics.length}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Services" value={services.length}>
          <RoundIcon
            icon={ToolsIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Verifications" value={nonVerifiedCount}>
          <RoundIcon
            icon={ApprovalIcon}
            iconColorClass="text-red-500 dark:text-red-100"
            bgColorClass="bg-red-100 dark:bg-red-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Support Requests" value={newTickets.length}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>        
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Revenue">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>

        <ChartCard title="Services Analytics">
          <Line {...serviceLineOptions(services)} />
        </ChartCard>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User image" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user.job}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.amount}</span>
                </TableCell>
                <TableCell>
                  <Badge type={user.status}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(user.date).toLocaleDateString()}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>      
    </>
  )
}

export default Dashboard
