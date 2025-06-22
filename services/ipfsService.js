const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;

const pinataBaseURL = "https://api.pinata.cloud/pinning";

/** Upload single file (image) to Pinata IPFS */
async function uploadToIPFS(filePath) {
  const formData = new FormData();
  const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

  formData.append('file', fileStream);
  formData.append('pinataMetadata', JSON.stringify({ name: fileName }));

  const response = await axios.post(`${pinataBaseURL}/pinFileToIPFS`, formData, {
    maxBodyLength: "Infinity",
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_SECRET_API_KEY,
    },
  });

  const hash = response.data.IpfsHash;
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

/** Upload multiple metadata objects to Pinata IPFS */
async function uploadMetadataToIPFS(metadataList) {
  const ipfsUrls = [];

  for (let i = 0; i < metadataList.length; i++) {
    const metadata = metadataList[i];

    const response = await axios.post(
      `${pinataBaseURL}/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const hash = response.data.IpfsHash;
    ipfsUrls.push(`https://gateway.pinata.cloud/ipfs/${hash}`);
  }

  return ipfsUrls;
}

module.exports = {
  uploadToIPFS,
  uploadMetadataToIPFS,
};
