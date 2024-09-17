import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import userData from '../utils/demo/userData';
import PageTitle from '../components/Typography/PageTitle';
import { Modal, ModalHeader, ModalBody, Card, CardBody, Badge, Button } from '@windmill/react-ui';
import dummyCar from '../assets/img/dummy-car.png'; // Dummy car image
import dummyMap from '../assets/img/dummy-map.png';

function UserDetails() {
  const { userID } = useParams(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePath, setImagePath] = useState(null);

  const openModal = (path) => {
    if (path !== null) {
      setImagePath(path);
    }
    setIsModalOpen(true);
  };

  function closeModal() {
    setImagePath(null);
    setIsModalOpen(false);
  }

  // Find the user based on the ID
  const user = userData.find((u) => u.id === userID);

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <>
      <PageTitle>User Profile</PageTitle>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="text-center">Vehicle Picture</ModalHeader>
        <ModalBody>
          {imagePath ? (
            <div className="mt-4">
              <img className="w-full mt-2" style={{ maxHeight: '400px', objectFit: 'contain' }} src={imagePath} alt="Vehicle" />
            </div>
          ) : (
            <p><strong>No Image Found!</strong></p>
          )}
        </ModalBody>
      </Modal>

      <div className="container mx-auto mb-8">
        {/* User Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              className="w-32 h-32 rounded-full object-cover mr-6"
              src={user.img || '/img/default-avatar.jpg'}
              alt={`${user.firstName} ${user.lastName}'s profile`}
            />
            <div>
              <h2 className="text-xl font-semibold dark:text-gray-100">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Joined on {user.dateJoined}</p>
            </div>
          </div>
        </div>

        {/* Basic Info Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Basic Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">First Name:</span> {user.firstName}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Last Name:</span> {user.lastName}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Phone:</span> {user.phone}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Email:</span> {user.email}</p>
            </div>
          </CardBody>
        </Card>

        {/* Vehicle Info Section */}
        <Card className="mt-4">
          <CardBody className="flex">
            <div className="w-2/3">
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Vehicle Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Registration No:</span> {user.vehicleRegisteration}</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Model:</span> {user.vehicleModel}</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Year:</span> {user.vehicleModelYear}</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Make:</span> {user.vehicleMake}</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Color:</span> {user.vehicleColor}</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Type:</span> {user.vehicleType}</p>
              </div>
            </div>
            <div className="w-1/3">
              <img src={dummyCar} alt="Dummy Car" className="w-full h-auto object-cover" />
            </div>
          </CardBody>
        </Card>

        {/* Vehicle Pictures Section */}
        <Card className="mt-4">
          <CardBody>
            <h4 className="font-semibold mb-2 dark:text-gray-100">Vehicle Pictures</h4>
            <div className="grid grid-cols-6 gap-4">
              {user.vehiclePictures.map((pic, index) => (
                <img
                  key={index}
                  className="w-full h-32 object-cover rounded-md"
                  src={pic.url}
                  alt={`Vehicle ${index + 1}`}
                  onClick={() => openModal(pic.url)}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default UserDetails;
