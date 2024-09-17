import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Card, CardBody, Textarea } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import mechanicData from '../utils/demo/mechanicData';
import userData from '../utils/demo/userData';
import tickets from '../utils/demo/tickets';
import InboxTable from '../components/Tables/InboxTable';

function Tables() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  const handleDelete = (id) => {
    const updatedData = allData.filter(ticket => ticket.id !== id).sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllData(updatedData);
    setFilteredData(updatedData); // Update both states
  };

  const handleSelect = (id) => {
    const fetchedTicket = allData.find(ticket => ticket.id === id);
    const sender = userData.find(u => u.id === fetchedTicket.senderID);
    setSelectedTicket(fetchedTicket);
    setUser(sender);

    // Update ticket status to read or any other status
    const updatedData = allData.map(ticket =>
      ticket.id === id ? { ...ticket, isRead: true } : ticket
    );
    setAllData(updatedData);
    setFilteredData(updatedData);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const refresh = () => {
    setSearchQuery('');
    setUser(null);
    setSelectedTicket(null);
    setFilteredData(allData);
  };

  useEffect(() => {
    const mergedData = tickets.map(ticket => {
      const mechanic = mechanicData.find(m => m.id === ticket.senderID);
      const user = userData.find(u => u.id === ticket.senderID);
      return {
        ...ticket,
        senderName: mechanic ? mechanic.name : user ? `${user.firstName} ${user.lastName}` : 'Unknown Sender',
        isRead: false // Default status
      };
    });
    setAllData(mergedData);
    setFilteredData(mergedData);
  }, []);

  useEffect(() => {
    const filteredArray = allData.filter(ticket =>
      ticket.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray);
  }, [searchQuery, allData]);

  const handleSubmitResponse = () => {
    // Implement the logic to handle the response submission
    alert("Response submitted!");
  };

  return (
    <>
      <PageTitle style={{marginBottom:'-50px'}}>Support Tickets</PageTitle>

      {/* <div className="flex mb-4 justify-between">
        <div></div>
        <Button size="small" onClick={refresh}>
          <span>Refresh</span>
        </Button>
      </div> */}

      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div>
          <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500 mb-4">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search by name, subject, or message..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <InboxTable
            dataTable2={paginatedData}
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onPageChangeTable2={onPageChangeTable2}
            handleDelete={handleDelete}
            handleSelect={handleSelect}
            className="col-span-1"
          />
        </div>
        <div className='col-span-2'>
          <Card className="h-full w-full flex flex-col justify-between">
            {selectedTicket !== null ? (
              <>
                <CardBody style={{ maxHeight: '630px', overflowY: 'auto' }}>
                  <h3 className="text-xl font-bold mb-4 dark:text-gray-100">{selectedTicket.subject}</h3>
                  <div className="flex mb-4">
                    <img
                      className="w-20 h-20 rounded-full object-cover mr-6 border"
                      src={user.img}
                      alt="User profile"
                    />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">ID: </span>{selectedTicket.senderID === user.id ? user.id : "Not Correct!"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">Name: </span>{`${user.firstName} ${user.lastName}`}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">Date: </span>{selectedTicket.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">Time: </span>{selectedTicket.time}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <p className="mt-4 mb-8 text-gray-800 whitespace-pre-wrap dark:text-gray-200">
                      {selectedTicket.message}
                    </p>
                  </div>
                  <div>
                    <p className="dark:text-gray-300 mb-4">
                      <span className="font-semibold dark:text-gray-100">Attachments:</span>
                    </p>
                    <div className="flex overflow-x-auto space-x-4 pb-2">
                      {selectedTicket.attachments.map((img, index) => (
                        <div key={index} className="w-20 h-20 overflow-hidden rounded-lg border border-gray-300">
                          <img
                            src={img.url}
                            alt={`Attached Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
                <div className="relative p-2">
                  <hr />
                  <Textarea
                    className="mt-4 w-full h-32 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter Response..."
                  />
                  <Button
                    onClick={handleSubmitResponse}
                    style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '15px',
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <div className='m-8'>Select a ticket to view details</div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default Tables;
