import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '../components/Typography/PageTitle';
import { Modal, ModalHeader, ModalBody, Card, CardBody, Button } from '@windmill/react-ui';
import dummyMap from '../assets/img/dummy-map.png';
import serviceData from '../utils/demo/serviceData'
import mechanicData from '../utils/demo/mechanicData'
import userData from '../utils/demo/userData'
import sparePartsData from '../utils/demo/sparepartsData'

function ServiceDetails() {
  const { serviceID } = useParams(); // Get serviceID from URL params

  const [service, setService] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePath, setImagePath] = useState(null);

  useEffect(() => {
    // Simulate fetching service data from API or state based on serviceID
    const fetchData = async () => {
      try {
        // Replace the following with actual API calls
        const fetchedServiceData = await fetchServiceData(serviceID); // Fetch service data
        const fetchedUserData = await fetchUserData(fetchedServiceData.userID); // Fetch user data
        const fetchedMechanicData = await fetchMechanicData(fetchedServiceData.mechanicID); // Fetch mechanic data

        setService(fetchedServiceData);
        setUser(fetchedUserData);
        setMechanic(fetchedMechanicData);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchData();
  }, [serviceID]);

  const openModal = (path) => {
    if (path !== null) {
      setImagePath(path);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setImagePath(null);
    setIsModalOpen(false);
  };

  if (!service || !user || !mechanic) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageTitle>Service Details <span className='text-sm'>(Service ID : {serviceID})</span></PageTitle>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="text-center">Voice Note</ModalHeader>
        <ModalBody>
            <audio controls>
              <source src={'http://commondatastorage.googleapis.com/codeskulptor-assets/week7-bounce.m4a'} type="audio/mp3" />
            </audio>
        </ModalBody>
      </Modal>

      <div className="container mx-auto">
        {/* Service Details Section */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Service Information</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Date Time:</span> {service.date} {service.time}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Completion Time:</span> {service.serviceTime} minutes</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Price:</span> {service.price}</p>
              
            </div>
            <div>
              <span className="font-semibold dark:text-gray-100">Description:</span>
              <p className="text-justify dark:text-gray-300">{service.description} </p>
            </div>

            {/* Dummy Voice Note*/}
                        
            <div className="flex mt-4 border p-4 justify-between items-center">
              {service.voiceNote ? (
                <>
                  <div className="flex items-center">
                    <span className="font-semibold dark:text-gray-100 mr-4">Voice Note: </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <audio controls style={{ width: '100%' }}>
                      <source src={'http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3'} type="audio/mp3" />
                    </audio>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-center dark:text-gray-300">No Voice Note Available!</p>
                </div>
              )}
            </div>

            {/* Dummy Voice Note*/}

          </CardBody>
        </Card>

        {/* Spare Parts Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Additional Requirements</h3>
            <p className="mb-4 dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Tow Option:</span> {service.towOption ? 'Yes' : 'No'}</p>
            <span className="font-semibold dark:text-gray-100">Spare Parts:</span>
            <div className="grid grid-cols-3 gap-4">
              {service.sparePartsRequired && service.sparePartsRequired.map((part, index) => {
                const foundPart = sparePartsData.find((sp) => sp.id === part.partID);
                return (
                  <p key={index} className="dark:text-gray-300">
                    <span className="dark:text-gray-100">{index + 1}:</span> {foundPart ? foundPart.name : 'Part not found'}
                  </p>
                );
              })}              
            </div>
          </CardBody>
        </Card>

        {/* User & Mechanic Info */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="mt-4">
            <CardBody>
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">User & Vehicle Information</h3>
              <div>
                <p className="mb-4 dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Name:</span> {`${user.firstName} ${user.lastName}`}</p>
                <p className="mb-4 dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Contact:</span> {mechanic.name}</p>
              </div>
              <div>
                <h4 className="font-extrabold mb-4 dark:text-gray-100 ">Vehicle:</h4>
                <div className="grid grid-cols-3 gap-4">
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Registration:</span> {user.vehicleRegisteration}
                  </p>
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Model:</span> {user.vehicleModel}
                  </p>
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Model Year:</span> {user.vehicleModelYear}
                  </p>
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Make:</span> {user.vehicleMake}
                  </p>
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Color:</span> {user.vehicleColor}
                  </p>
                  <p className="dark:text-gray-300">
                    <span className="font-semibold dark:text-gray-100">Type:</span> {user.vehicleType}
                  </p>
                </div>
              </div>              
            </CardBody>
          </Card>
          <Card className="mt-4">
            <CardBody>
              <div className="border p-4">
                <img className="w-full object-cover max-h-64" src={dummyMap} alt="Workshop Map" />
                <p className="mt-2 dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Location:</span> {service.userLocation.address}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* User & Mechanic Info */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Mechanic and Workshop Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Name:</span> {`${user.firstName} ${user.lastName}`}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Mechanic Name:</span> {mechanic.name}</p>
              <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Address:</span> {service.userLocation.address}</p>
            </div>
          </CardBody>
        </Card>

        {/* Ratings Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Ratings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Mechanic Rating:</span> {service.mechanicRating.stars} stars</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Mechanic Comment:</span> {service.mechanicRating.comment}</p>
              </div>
              <div>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Rating:</span> {service.userRating.stars} stars</p>
                <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">User Comment:</span> {service.userRating.comment}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Approve / Reject Buttons */}
        <div className="mt-4 mb-5 flex justify-end">
          <Button layout="outline" className="mr-4">Approve Service</Button>
          <Button layout="link" className="text-red-600 dark:text-red-400">Reject Service</Button>
        </div>
      </div>
    </>
  );
}

export default ServiceDetails;

// Mock fetch functions (replace with actual API calls)
const fetchServiceData = async (serviceID) => {
  // Simulate API call to fetch service data based on serviceID
  return serviceData.find(service => service.id === Number(serviceID));
};

const fetchUserData = async (userID) => {
  // Simulate API call to fetch user data based on userID
  return userData.find(user => user.id === userID);
};

const fetchMechanicData = async (mechanicID) => {
  // Simulate API call to fetch mechanic data based on mechanicID
  return mechanicData.find(mechanic => mechanic.id === mechanicID);
};
