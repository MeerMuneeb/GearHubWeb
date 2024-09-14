import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import mechanicData from '../utils/demo/mechanicData';
import PageTitle from '../components/Typography/PageTitle';
import {  Modal, ModalHeader, ModalBody, Card, CardBody, Badge, Button } from '@windmill/react-ui';
import dummyMap from '../assets/img/dummy-map.png'

function VerifyMechanic() {
  const { mechanicID } = useParams();  // Retrieve mechanic ID from route params
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imagePath, setImagePath] = useState(null)

  const openModal = (path) => {
    if (path !== null) {
      setImagePath(path)
    }
    setIsModalOpen(true)
  }

  function closeModal() {
    setImagePath(null)
    setIsModalOpen(false)
  }

  // Find the mechanic based on the ID
  const mechanic = mechanicData.find((m) => m.id === mechanicID);

  if (!mechanic) {
    return <p>Mechanic not found</p>;
  }

  return (
    <>
      <PageTitle>Mechanic Profile</PageTitle>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="text-center">Verification Image</ModalHeader>
        <ModalBody>
          {imagePath ? (
            <div className="mt-4">
              <img className="w-full mt-2" style={{ maxHeight: '400px', objectFit: 'contain' }} src={imagePath} alt="CNIC Verification" />
            </div>
          ) : (
            <p><strong>No Image Found!</strong></p>
          )}
        </ModalBody>
      </Modal>

      <div className="container mx-auto">
        {/* Mechanic Header */}
        <Card>
          <CardBody>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  className="w-32 h-32 rounded-full object-cover mr-6"
                  src={mechanic.img || '/img/default-avatar.jpg'}
                  alt={`${mechanic.name}'s profile`}
                />
                <div>
                  <h2 className="text-xl font-semibold dark:text-gray-100">{mechanic.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{mechanic.workshopName}</p>
                </div>
              </div>
              <div>
                <Badge className="text-lg p-3 pr-5 pl-5" type={mechanic.verified ? 'success' : 'danger'}>
                  {mechanic.verified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Basic Info Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">First Name:</span> {mechanic.name.split(' ')[0]}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Last Name:</span> {mechanic.name.split(' ')[1]}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">CNIC No:</span> {mechanic.cnic}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Phone:</span> {mechanic.phoneNumber}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Email:</span> {mechanic.email}</p>
            </div>
          </CardBody>
        </Card>

        {/* CNIC Verification Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">CNIC Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-center mt-2 dark:text-gray-300">CNIC Front</p>              
              <p className="text-center mt-2 dark:text-gray-300">CNIC Back</p>
            </div>
            <div className="grid grid-cols-2 gap-4 flex items-center justify-between" >
              <div style={{ height: '350px' }} className="border p-4">
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={mechanic.cnicPictures[0]?.front} alt="CNIC Front" />
              </div>
              <div style={{ height: '350px' }} className="border p-4">  
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={mechanic.cnicPictures[1]?.back} alt="CNIC Back" />
              </div>
            </div>
            <div className="flex mt-4 border p-4 justify-between items-center">
              <div className="flex items-center">
                <span className="font-semibold dark:text-gray-100">CNIC Verification: </span><span className="text-gray-500 ml-2"> {mechanic.cnicConfirmation}</span>
              </div>
              <div>
                <Button size="small" onClick={() => openModal(mechanic.cnicConfirmation)} className="ml-2">
                  <span>View</span>
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Workshop Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Workshop Information</h3>
            <div className="grid grid-cols-2 gap-4 flex items-center justify-center">
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Workshop Name:</span> {mechanic.workshopName}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Workshop Address:</span> {mechanic.workshopAddress}</p>
            </div>            
            <div className="mt-4 border p-4 text-center">
              <img className="w-full object-cover max-h-64" src={dummyMap} alt="Workshop Map" />
            </div>
            {/* Dummy Map */}
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2 dark:text-gray-100">Workshop Pictures</h4>
              <div className="grid grid-cols-3 gap-4">
                {mechanic.workshopPictures.map((pic, index) => (
                  <img key={index} className="w-full h-50 object-cover" src={pic.url} alt={`Workshop ${index + 1}`} />
                ))}
              </div>
              <div className="flex mt-4 border p-4 justify-between items-center">
                <div className="flex items-center">
                  <span className="font-semibold dark:text-gray-100">Workshop Address Verification: </span><span className="text-gray-500 ml-2"> {mechanic.workshopConfirmation}</span>
                </div>
                <div>
                  <Button size="small" onClick={() => openModal(mechanic.workshopConfirmation)} className="ml-2">
                    <span>View</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Approve / Reject Buttons */}
        <div className="mt-4 mb-5 flex justify-end">
          <Button layout="outline" className="mr-4">Approve Mechanic</Button>
          <Button layout="link" className="text-red-600 dark:text-red-400">Reject Mechanic</Button>
        </div>
      </div>
    </>
  );
}

export default VerifyMechanic;
