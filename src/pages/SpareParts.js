import React, { useState, useRef, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Textarea, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from '@windmill/react-ui';
import { SearchIcon } from '../icons';
import PartsTable from '../components/Tables/PartsTable';
import {
  getParts,
  createPart,
  updatePart,
  deletePart
} from '../apis/partsApi';

function Tables() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [pageTable2, setPageTable2] = useState(1);
  const fileInputRef = useRef(null);
  const resultsPerPage = 10;
  const totalResults = filteredData.length;

  const fetchParts = async () => {
    try {
      const parts = await getParts();
      setAllData(parts);
      setFilteredData(parts);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  // Pagination control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  // Paginate data
  const paginatedData = filteredData.slice((pageTable2 - 1) * resultsPerPage, pageTable2 * resultsPerPage);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function openAddModal() {
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setName('');
    setDescription('');
    setPrice('');
    setImg('');
    setAddModalOpen(false);
  }

  function openEditModal(id) {
    const item = allData.find(item => item.id === id);

    setEditId(id); // Set the edit id
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setImg(item.img);

    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImg('');
    setEditModalOpen(false);
  }

  const handleSubmit = async () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      description,
      price: parseFloat(price),
      img,
      mechanicID: null, 
      isApproved: true
    };

    try {
      await createPart(newItem);
      window.alert('item added successfully!')
      fetchParts();
    } catch (error) {
      console.error('Error fetching parts:', error);
      window.alert('Error Adding the Item!')
    }

    // Update both data states
    closeAddModal();
  };

  const handleEdit = async () => {
    const updatedItem = {
      id: editId, // Use the existing id
      name,
      description,
      price: parseFloat(price),
      img,
      mechanicID: null, 
      isApproved: true
    };

    try {
      await updatePart(editId, updatedItem);
      window.alert('item updated successfully!')
      fetchParts();
    } catch (error) {
      console.error('Error fetching parts:', error);
      window.alert('Error updating the Item!')
    }

    closeEditModal();
  };

  const handleDelete = async (id) => {
    try {
      await deletePart(id)
      window.alert('item deleted successfully!')
      fetchParts();
    } catch (e) {
      console.error(e);      
      window.alert('Error deleting the Item!')
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredArray = allData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredArray.filter(item => item.isApproved === true));
  }, [searchQuery, allData]);

  return (
    <>
      <PageTitle>Spare Parts</PageTitle>

      <div className="flex mb-4 justify-between">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-gray-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search by name or description..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button size="small" onClick={openAddModal} className="ml-2">
          <span>Add Item</span>
          <span className="ml-2" aria-hidden="true">+</span>
        </Button>
      </div>

        {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <ModalHeader>Add Item</ModalHeader>
        <ModalBody>
          <div className="px-4 py-3 mb-8">
            <Label>
              <span>Name</span>
              <Input
                className="mt-1"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Label>

            <Label className="mt-4">
              <span>Description</span>
              <Textarea
                className="mt-1" rows='3'
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>

            <Label className="mt-4">
              <span>Price</span>
              <Input
                type="number"
                className="mt-1"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Label>

            {/* Image Upload Section */}
            <Label className="mt-4">
              <span>Image URL</span>
              <div className="relative text-gray-500 focus-within:text-purple-600">
                <input
                  className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  placeholder="http://dummyimage.com/231x100.png"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={() => fileInputRef.current.click()}
                >
                  Browse
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
            </Label>

            {/* Image Preview */}
            <Label className="mt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Image Preview</span>
                <div className="flex items-center">
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={img || "/img/default-avatar.jpg"}
                      className="w-full h-full object-cover"
                      alt="Product"
                    />
                  </div>
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

      {/* Edit Product Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalHeader>Edit Item</ModalHeader>
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
              <span>Description</span>
              <Textarea
                className="mt-1" rows='3'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Label>

            <Label className="mt-4">
              <span>Price</span>
              <Input
                type="number"
                className="mt-1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Label>

            {/* Image Upload Section */}
            <Label className="mt-4">
              <span>Image URL</span>
              <div className="relative text-gray-500 focus-within:text-purple-600">
                <input
                  className="block w-full pr-20 mt-1 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 px-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-r-md active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={() => fileInputRef.current.click()}
                >
                  Browse
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
            </Label>

            {/* Image Preview */}
            <Label className="mt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Image Preview</span>
                <div className="flex items-center">
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={img || "/img/default-avatar.jpg"}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
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

      <PartsTable
        dataTable2={paginatedData}
        totalResults={totalResults}
        resultsPerPage={resultsPerPage}
        onPageChangeTable2={onPageChangeTable2}
        openEditModal={openEditModal}
        handleDelete={handleDelete}
      />
    </>
  );
}

export default Tables;
