import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Card, CardBody, Textarea } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import { getUsers } from '../apis/usersApi';
import { getMechanics } from '../apis/mechanicApi';
import { getTickets, updateTicket, deleteTicket } from '../apis/ticketsApi';
import InboxTable from '../components/Tables/InboxTable';

function Tables() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState('');
  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  const handleDelete = (id) => {
    deleteTicket(id)
    const updatedData = allData.filter(ticket => ticket.id !== id).sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllData(updatedData);
    setFilteredData(updatedData);
  };

  const handleSelect = async (id) => {
    const fetchedTicket = allData.find(ticket => ticket.id === id);

    // Ensure the ticket is fetched correctly
    if (!fetchedTicket) {
      console.error("Ticket not found.");
      return;
    }

    // Fetch users and mechanics
    const users = await getUsers();
    const mechanics = await getMechanics();

    // Find the sender (either user or mechanic)
    const sender = users.find(u => u.id === fetchedTicket.senderID) || mechanics.find(m => m.id === fetchedTicket.senderID);

    // Check if the sender exists
    if (!sender) {
      console.error("Sender not found.");
      setUser(null);  // Clear previous sender
      setSelectedTicket(null);  // Clear previous ticket
      return;
    }

    if (fetchedTicket.isRead === false) {
      await updateTicket(id, {isRead: true})
    }

    setSelectedTicket(fetchedTicket);
    setUser(sender);
    setResponse(fetchedTicket.response || '');

    // Mark ticket as read and update the data
    const updatedData = allData.map(ticket =>
      ticket.id === id ? { ...ticket, isRead: true } : ticket
    );
    setAllData(updatedData);
    setFilteredData(updatedData);
  };

  const refresh = () => {
    setSearchQuery('');
    setUser(null);
    setSelectedTicket(null);
    setFilteredData(allData);
  };

  const fetchData = async () => {
    const ticketsData = await getTickets();
    const usersData = await getUsers();
    const mechanicsData = await getMechanics();

    const mergedData = ticketsData.map(ticket => {
      const mechanic = mechanicsData.find(m => m.id === ticket.senderID);
      const user = usersData.find(u => u.id === ticket.senderID);
      return {
        ...ticket,
        senderName: mechanic ? mechanic.name : user ? `${user.firstName} ${user.lastName}` : 'Unknown Sender'
      };
    });
    
    setAllData(mergedData);
    setFilteredData(mergedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredArray = allData.filter(ticket =>
      ticket.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray);
  }, [searchQuery, allData]);

  const handleSubmitResponse = async () => {
    if (response.trim() === '') return;

    const updatedTicket = { ...selectedTicket, response };
    await updateTicket(selectedTicket.id, updatedTicket);

    // Update the UI to reflect the new response
    const updatedData = allData.map(ticket =>
      ticket.id === selectedTicket.id ? { ...ticket, response } : ticket
    );
    
    setAllData(updatedData);
    setFilteredData(updatedData);
    setSelectedTicket(updatedTicket);
    alert("Response submitted!");
  };

  return (
    <>
      <PageTitle style={{ marginBottom: '-50px' }}>Support Tickets</PageTitle>

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
            {selectedTicket !== null && user !== null ? (
              <>
                <CardBody style={{ maxHeight: '630px', overflowY: 'auto' }}>
                  <h3 className="text-xl font-bold mb-4 dark:text-gray-100">{selectedTicket.subject}</h3>
                  <div className="flex mb-4">
                    {/* Ensure user image exists */}
                    {user.img ? (
                      <img
                        className="w-20 h-20 rounded-full object-cover mr-6 border"
                        src={user.img}
                        alt="User profile"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full object-cover mr-6 border flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">No Image</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">ID: </span>{user.id}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-bold dark:text-gray-100">Name: </span>
                        {`${user.firstName || 'Unknown'} ${user.lastName || ''}`}
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
                    {selectedTicket.attachments?.length > 0 ? (
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
                    ) : (
                      <p>No attachments available.</p>
                    )}
                  </div>
                </CardBody>
                <div className="relative p-2">
                  <hr />
                  <Textarea
                    className="mt-4 w-full h-32 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter Response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={!!selectedTicket.response} // Disable if a response already exists
                  />
                  <Button
                    onClick={handleSubmitResponse}
                    style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '15px',
                    }}
                    disabled={!!selectedTicket.response} // Disable if a response already exists
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
