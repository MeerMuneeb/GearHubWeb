import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Select, Card, CardBody, Textarea } from '@windmill/react-ui';
import { MailIcon, LockIcon, SearchIcon } from '../icons';
import response from '../utils/demo/adminData';
import userData from '../utils/demo/userData';
import InboxTable from '../components/Tables/InboxTable';

function Tables() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);  
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);  // Use `editId` instead of `editIndex`

  /////////////////////////////

  const user = userData.find(user => user.id === '01J7R1V9X88DRFCA0K6AX3RABJ')
  const userInput = `Dear HR,

I'm excited to apply for the Graphic Design Intern role at heisencorp. As a BS student studying design, I'm passionate about creative visual communication and eager to bring my skills to a dynamic team.

With a solid foundation in design principles and proficiency in Adobe Creative Suite, I'm confident in my ability to learn and contribute. I'd love to discuss my application and how my skills align with your team's needs.

Please find my resume attached. I look forward to hearing from you.

Best regards,
Noorayy`;

  ////////////////////////////////////////

  // State for all data and filtered data
  const [allData, setAllData] = useState(response); // Store original data
  const [filteredData, setFilteredData] = useState(response); // Filtered data based on search

  // pagination setup
  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // on page change, load new sliced data
  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  function openAddModal() {
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setName('');  
    setRole('');  
    setEmail('');  
    setPassword('');
    setAddModalOpen(false);
  }

  function openEditModal(id) {
    const admin = allData.find(admin => admin.id === id); // Use allData instead of filteredData
    
    setEditId(id); // Set the edit id
    setName(admin.name); 
    setRole(admin.role || "Admin");
    setDate(new Date(admin.date).toISOString().split('T')[0]); 
    setEmail(admin.email || "Hello@gmail.com"); 
    setPassword(admin.password || "QWERTY");

    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditId(null); // Clear edit id
    setName(''); 
    setRole(''); 
    setEmail(''); 
    setPassword('');
    setEditModalOpen(false);
  }

  const handleSubmit = () => {
    const newadmin = {
      id: Math.random().toString(36).substring(2, 9), // Unique ID for each admin
      name,
      role,
      date: new Date().toISOString(), 
      email,
      password
    };
  
    const updatedData = [...allData, newadmin].sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllData(updatedData);
    setFilteredData(updatedData); // Update both data states
    closeAddModal();
  };

  const handleEdit = () => {
    const updatedadmin = {
      id: editId,  // Use the existing id
      name,
      role,
      date: new Date().toISOString(), 
      email,
      password
    };
  
    const updatedData = allData.map(admin => admin.id === editId ? updatedadmin : admin)
                                .sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllData(updatedData);
    setFilteredData(updatedData);

    closeEditModal();
  };

  const handleDelete = (id) => {
    const updatedData = allData.filter(admin => admin.id !== id).sort((a, b) => new Date(b.date) - new Date(a.date));
    setAllData(updatedData);
    setFilteredData(updatedData); // Update both states
  };

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredArray = allData.filter(admin => 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray);
  }, [searchQuery, allData]); // Add `allData` as a dependency so filtering happens on change of data

  return (
    <>
      <PageTitle>Support Tickets</PageTitle>

      <div className="flex mb-4 justify-between">    
        <div></div>    
        <Button size="small" onClick={openAddModal} className="ml-2">
          <span>Add Admin</span>
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div>

      {/* Add Admin Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <ModalHeader>Add Admin</ModalHeader>
        <ModalBody>
        <div className="px-4 py-3 mb-8">
            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Label>

            <Label className="mt-4">
              <span>Role</span>
              <Select className="mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="ReportsOperator">Reports Operator</option>
              </Select>
            </Label>

            <Label className="mt-4">
              <span>Date</span>
              <Input
                type="date"
                className="mt-1"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled
              />
            </Label>

            <Label className="mt-4">
              <span>Email</span>
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                  <MailIcon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </Label>

            <Label className="mt-4">
              <span>Password</span>
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  type="password"
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                  <LockIcon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeAddModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </ModalFooter>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Admin</ModalHeader>
        <ModalBody>
        <div className="px-4 py-3 mb-8">
            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Label>

            <Label className="mt-4">
              <span>Role</span>
              <Select className="mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="ReportsOperator">Reports Operator</option>
              </Select>
            </Label>

            <Label className="mt-4">
              <span>Date</span>
              <Input
                type="date"
                className="mt-1"
                value={date}
                disabled
              />
            </Label>

            <Label className="mt-4">
              <span>Email</span>
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                  <MailIcon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </Label>

            <Label className="mt-4">
              <span>Password</span>
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  type="password"
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 flex items-center ml-3 pointer-events-none">
                  <LockIcon className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeEditModal}>
            Cancel
          </Button>
          <Button onClick={handleEdit}>Save</Button>
        </ModalFooter>
      </Modal>

      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div>
          <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500 mb-4">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search by name, email or role..."
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
            openEditModal={openEditModal}
            handleDelete={handleDelete}
            className="col-span-1"
          />
        </div>
        <div className='col-span-2'>
        <Card className="h-full w-full flex flex-col justify-between">
  <CardBody style={{ maxHeight: '630px', overflowY: 'auto' }}>
    <h3 className="text-xl font-bold mb-4 dark:text-gray-100">Job post expiration notifications</h3>
    <div className="flex mb-4">
      <img
        className="w-20 h-20 rounded-full object-cover mr-6 border"
        src={user.img || '/img/default-avatar.jpg'}
        alt={`${user.name}'s profile`}
      />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold dark:text-gray-100">ID: </span>{user.id}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold dark:text-gray-100">Name: </span>{`${user.firstName} ${user.lastName}`}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold dark:text-gray-100">Date: </span>{user.dateJoined}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold dark:text-gray-100">Time: </span>11:00 am
        </p>
      </div>
    </div>
    <hr/>
    <div>
      <p className="mt-4 mb-8 text-gray-800 whitespace-pre-wrap dark:text-gray-200">
        {userInput}
      </p>
    </div>
    <div>
      <p className="dark:text-gray-300 mb-4">
        <span className="font-semibold dark:text-gray-100">Attachments:</span>
      </p>

      {/* Grid of Vehicle Pictures */}
      <div className="flex overflow-x-auto space-x-4 pb-2"> {/* Ensure horizontal overflow is handled */}
        {user.vehiclePictures.map((picture, index) => (
          <div key={index} className="w-20 h-20 overflow-hidden rounded-lg border border-gray-300">
            <img 
              src={picture.url} 
              alt={`Vehicle Picture ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
    </div>
  </CardBody>
  <hr />
  <div className="relative p-2">
    <Textarea 
      className="w-full h-32 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
      placeholder="Enter some long form content."
    />
    <button 
      style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        backgroundColor: '#3B82F6', // Tailwind 'blue-500'
        color: 'white',
        padding: '12px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    />
  </div>
</Card>

</div>

      </div>
    </>
  )
}

export default Tables;
