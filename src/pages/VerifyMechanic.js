import React from 'react';
import { useParams } from 'react-router-dom';
import mechanicData from '../utils/demo/mechanicData';
import PageTitle from '../components/Typography/PageTitle';
import { Card, CardBody, Badge, Button } from '@windmill/react-ui';

function VerifyMechanic() {
  const { mechanicID } = useParams();  // Retrieve mechanic ID from route params

  // Find the mechanic based on the ID
  const mechanic = mechanicData.find((m) => m.id === mechanicID);

  if (!mechanic) {
    return <p>Mechanic not found</p>;
  }

  return (
    <>
      <PageTitle>Mechanic Profile</PageTitle>
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
                  <h2 className="text-xl font-semibold">{mechanic.name}</h2>
                  <p className="text-sm text-gray-600">{mechanic.workshopName}</p>
                </div>
              </div>
              <div>
                <Badge type={mechanic.verified ? 'success' : 'danger'}>
                  {mechanic.verified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Basic Info Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>First Name:</strong> {mechanic.name.split(' ')[0]}</p>
              <p><strong>Last Name:</strong> {mechanic.name.split(' ')[1]}</p>
              <p><strong>CNIC No:</strong> {mechanic.cnic}</p>
              <p><strong>Phone:</strong> {mechanic.phoneNumber}</p>
              <p><strong>Email:</strong> {mechanic.email}</p>
            </div>
          </CardBody>
        </Card>

        {/* CNIC Confirmation Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">CNIC Information</h3>
            <div className="grid grid-cols-2 gap-4 flex items-center justify-between" >
              <div style={{  width: '525px', height: '300px' }} className="border p-4">
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={mechanic.cnicPictures[0]?.front} alt="CNIC Front" />
                <p className="text-center mt-2">CNIC Front</p>
              </div>
              <div style={{ width: '525px', height: '300px' }} className="border p-4">
                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={mechanic.cnicPictures[1]?.back} alt="CNIC Back" />
                <p className="text-center mt-2">CNIC Back</p>
              </div>
            </div>
            <div className="mt-4">
              <p><strong>CNIC Confirmation:</strong></p>
              <img className="w-full mt-2" src={mechanic.cnicConfirmation} alt="CNIC Confirmation" />
            </div>
          </CardBody>
        </Card>

        {/* Workshop Section */}
        <Card className="mt-4">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">Workshop Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Workshop Name:</strong> {mechanic.workshopName}</p>
              <p><strong>Workshop Address:</strong> {mechanic.workshopAddress}</p>
            </div>
            {/* Dummy Map */}
            <div className="mt-4 border p-4 text-center">
              <p className="text-sm text-gray-500">Map showing {mechanic.workshopAddress} will be placed here.</p>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Workshop Pictures</h4>
              <div className="grid grid-cols-3 gap-4">
                {mechanic.workshopPictures.map((pic, index) => (
                  <img key={index} className="w-full h-32 object-cover" src={pic.url} alt={`Workshop ${index + 1}`} />
                ))}
              </div>
              <div className="mt-4">
                <p><strong>Workshop Confirmation:</strong></p>
                <img className="w-full mt-2" src={mechanic.workshopConfirmation} alt="Workshop Confirmation" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Approve / Reject Buttons */}
        <div className="mt-4 flex justify-between">
          <Button layout="outline" className="mr-4">Approve Mechanic</Button>
          <Button layout="link" className="text-red-600">Reject Mechanic</Button>
        </div>
      </div>
    </>
  );
}

export default VerifyMechanic;
