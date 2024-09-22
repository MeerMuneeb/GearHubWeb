import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageTitle from '../components/Typography/PageTitle';
import { Card, CardBody, Button } from '@windmill/react-ui';
import dummyMap from '../assets/img/dummy-map.png';
import { getServiceById } from '../apis/servicesApi';
import { getUserById } from '../apis/usersApi';
import { getMechanicById } from '../apis/mechanicApi';
import sparePartsData from '../utils/demo/sparepartsData'
import { StarIcon } from '../icons';
import { useHistory } from 'react-router-dom';

function ServiceDetails() {    
  const history = useHistory(); 
  const { serviceID } = useParams(); // Get serviceID from URL params
  const [service, setService] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [user, setUser] = useState(null);

  const handleCancel = () => {
    history.push(`/app/service-reports`);
  };

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

  if (!service || !user || !mechanic) {
    return <div>Loading...</div>;
  }

  const generateReport = () => {
    const reportWindow = window.open('', '_blank');
    const reportContent = `
      <html>
      <head>
        <title>Service Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 800px; margin: auto; }
          .title { font-size: 24px; font-weight: bold; justify-content: center;}
          .section { margin-bottom: 20px; }
          .section h2 { font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .section p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title"><center>Service Report</center></h1>
          <div class="section">
            <h2>Service Information ID: ${service.id}</h2>
            <p><strong>Date Time:</strong> ${service.date} ${service.time}</p>
            <p><strong>Completion Time:</strong> ${service.serviceTime} minutes</p>
            <p><strong>Price:</strong> ${service.price}</p>
            <p><strong>Description:</strong> ${service.description}</p>
            <p><strong>Voice Note:</strong> ${service.voiceNote ? 'Available' : 'Not Available'}</p>
            <p><strong>Tow Option:</strong> ${service.towOption ? 'Yes' : 'No'}</p>
            <p><strong>Spare Parts:</strong> ${service.sparePartsRequired ? service.sparePartsRequired.map(part => sparePartsData.find(sp => sp.id === part.partID)?.name || 'Part not found').join(', ') : 'No Spare Parts Used!'}</p>
          </div>
          <div class="section">
            <h2>User Information</h2>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Contact:</strong> ${user.phone}</p>
            <p><strong>Vehicle Registration:</strong> ${user.vehicleRegisteration}</p>
            <p><strong>Model:</strong> ${user.vehicleModel}</p>
            <p><strong>Model Year:</strong> ${user.vehicleModelYear}</p>
            <p><strong>Make:</strong> ${user.vehicleMake}</p>
            <p><strong>Color:</strong> ${user.vehicleColor}</p>
            <p><strong>Type:</strong> ${user.vehicleType}</p>
          </div>
          <div class="section">
            <h2>Mechanic Information</h2>
            <p><strong>Name:</strong> ${mechanic.name}</p>
            <p><strong>Workshop Name:</strong> ${mechanic.workshopName}</p>
            <p><strong>Date Joined:</strong> ${mechanic.dateJoined || '01/01/2001'}</p>
            <p><strong>Contact:</strong> ${mechanic.phoneNumber}</p>
            <p><strong>Workshop Address:</strong> ${mechanic.workshopAddress}</p>
          </div>
          <div class="section">
            <h2>User Rating and Review</h2>
            <p><strong>Rating:</strong> ${service.userRating.stars} Stars</p>
            <p><strong>Comment:</strong> ${service.userRating.comment}</p>
          </div>
          <div class="section">
            <h2>Mechanic Rating and Review</h2>
            <p><strong>Rating:</strong> ${service.mechanicRating.stars} Stars</p>
            <p><strong>Comment:</strong> ${service.mechanicRating.comment}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  
    reportWindow.document.open();
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
    reportWindow.print();
  };
  

  return (
    <>
      <PageTitle>Service Details <span className='text-sm'>(Service ID : {serviceID})</span></PageTitle>

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
              {service.sparePartsRequired ? (service.sparePartsRequired.map((part, index) => {
                const foundPart = sparePartsData.find((sp) => sp.id === part.partID);
                return (
                  <p key={index} className="dark:text-gray-300">
                    <span className="dark:text-gray-100">{index + 1}:</span> {foundPart ? foundPart.name : 'Part not found'}
                  </p>
                );
              })) : (
                <span className="dark:text-gray-100">No Spare Part Used!</span>
              )
              }              
            </div>
          </CardBody>
        </Card>

        {/* User & Mechanic Info */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="mt-4 col-span-2">
            <CardBody>
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">User & Vehicle Information</h3>
              <div className="flex items-center mb-4">
                <img
                  className="w-24 h-24 rounded-full object-cover mr-6 border"
                  src={user.img || '/img/default-avatar.jpg'}
                  alt={`${user.name}'s profile`}
                />
                <div>
                  <p className="mb-4 dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Name:</span> {`${user.firstName} ${user.lastName}`}</p>
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Contact:</span> {user.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="font-extrabold mb-4 dark:text-gray-100 ">Vehicle:</h4>
                <div className="grid grid-cols-2 gap-4 ml-4">
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
          <Card className="mt-4 col-span-3">
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
              <div className="flex items-center mb-4">
                <img
                  className="w-24 h-24 rounded-full object-cover mr-6 border"
                  src={mechanic.img || '/img/default-avatar.jpg'}
                  alt={`${mechanic.name}'s profile`}
                />
                <div className="grid grid-cols-3 gap-4">
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Name:</span> {mechanic.name}</p>
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Workshop Name: </span>{mechanic.workshopName}</p>
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Date Joined:</span> {mechanic.dateJoined ? mechanic.dateJoined : "01/01/2001"}</p>
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Contact:</span> {mechanic.phoneNumber}</p>
                  <p className="dark:text-gray-300"><span className="font-semibold dark:text-gray-100">Workshop Address:</span> {mechanic.workshopAddress}</p>
            
                </div>
              </div>
          </CardBody>
        </Card>

        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">User Rating and Review</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="flex dark:text-gray-300 items-center">
                  <span className="font-semibold dark:text-gray-100 mr-2">Rating: </span>
                  <span className="flex">
                    {Array(5).fill(0).map((_, index) => (
                      <StarIcon 
                        key={index} 
                        className={`h-4 w-4 mr-1 ${index < service.userRating.stars ? 'text-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </span>
                </p>
                <p className="dark:text-gray-300">
                  <span className="font-semibold dark:text-gray-100">Comment:</span> {service.userRating.comment}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Mechanic Rating and Review</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="flex dark:text-gray-300 items-center">
                  <span className="font-semibold dark:text-gray-100 mr-2">Rating: </span>
                  <span className="flex">
                    {Array(5).fill(0).map((_, index) => (
                      <StarIcon 
                        key={index} 
                        className={`h-4 w-4 mr-1 ${index < service.mechanicRating.stars ? 'text-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </span>
                </p>
                <p className="dark:text-gray-300">
                  <span className="font-semibold dark:text-gray-100">Comment:</span> {service.mechanicRating.comment}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      

        {/* Approve / Reject Buttons */}
        <div className="mt-4 mb-5 flex justify-end">
          <Button layout="outline" className="mr-4" onClick={generateReport}>Generate Report</Button>

          <Button layout="link" className="text-red-600 dark:text-red-400" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </>
  );
}

export default ServiceDetails;

// Mock fetch functions (replace with actual API calls)
const fetchServiceData = async (serviceID) => {
  const service = await getServiceById(serviceID);
  return service
};

const fetchUserData = async (userID) => {
  const user = await getUserById(userID);
  return user
};

const fetchMechanicData = async (mechanicID) => {
  const mechanic = await getMechanicById(mechanicID);
  return mechanic
};
