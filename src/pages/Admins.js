import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Select } from '@windmill/react-ui';
import { MailIcon, LockIcon, SearchIcon } from '../icons';
import AdminTable from '../components/Tables/AdminTable';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../apis/adminApi'; // Import API functions

function Tables() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Current date
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null); // Use `editId` instead of `editIndex`

  // State for all data and filtered data
  const [allData, setAllData] = useState([]); // Store original data
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on search

  // pagination setup
  const [pageTable2, setPageTable2] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  // Fetch admin data from the API when the component mounts
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const admins = await getAdmins(); 
        setAllData(admins);
        setFilteredData(admins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  // Pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // On page change, load new sliced data
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
    setRole(admin.role);
    setDate(new Date(admin.date).toISOString().split('T')[0]);
    setEmail(admin.email);
    setPassword(admin.password);

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

  const handleSubmit = async () => {
    try {
      const newAdmin = {
        name,
        role,
        date: new Date().toISOString(),
        email,
        password
      };

      // Create a new admin using the API
      const createdAdmin = await createAdmin(newAdmin);

      const updatedData = [...allData, newAdmin].sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllData(updatedData);
      setFilteredData(updatedData); // Update both data states
      closeAddModal();
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedAdmin = {
        id: editId, // Use the existing id
        name,
        role,
        date: new Date().toISOString(),
        email,
        password
      };

      // Update the admin using the API
      await updateAdmin(editId, updatedAdmin);

      const updatedData = allData
        .map(admin => (admin.id === editId ? updatedAdmin : admin))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllData(updatedData);
      setFilteredData(updatedData);

      closeEditModal();
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete the admin using the API
      await deleteAdmin(id);

      const updatedData = allData.filter(admin => admin.id !== id).sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllData(updatedData);
      setFilteredData(updatedData); // Update both states
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
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
      <PageTitle>Admins</PageTitle>

      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
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
        <form onSubmit={handleSubmit}>
        <ModalBody>
        <div className="px-4 py-3 mb-8">          
            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Label>

            <Label className="mt-4">
              <span>Role</span>
              <Select required className="mt-1" value={role} onChange={(e) => setRole(e.target.value)}>
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
                  type='email'
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  placeholder="jane.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  type="text"
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
          <Button type="submit">Submit</Button>
        </ModalFooter>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Admin</ModalHeader>
        <form onSubmit={handleEdit}>
        <ModalBody>
        <div className="px-4 py-3 mb-8">
            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Label>

            <Label className="mt-4">
              <span>Role</span>
              <Select className="mt-1" value={role} onChange={(e) => setRole(e.target.value)} required>
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
                  type='email'
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  placeholder='Type to change password!'
                  className="block w-full pl-10 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"                  
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
          <Button type="submit">Save</Button>
        </ModalFooter>
        </form>
      </Modal>

      <AdminTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />
    </>
  )
}

export default Tables;
