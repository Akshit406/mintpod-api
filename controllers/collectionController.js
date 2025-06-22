const fs = require('fs');
const path = require('path');
const { uploadToIPFS, uploadMetadataToIPFS } = require('../services/ipfsService');
const { deployCollection, mintNFTs } = require('../services/deployService');
const Collection = require('../models/collection');

exports.createCollection = async (req, res) => {
  try {
    const { collectionName, symbol, descriptions } = req.body;
    const imageFiles = req.files;
    const descriptionArr = JSON.parse(descriptions);

    const imageUrls = await Promise.all(imageFiles.map(file => uploadToIPFS(file.path)));

    const metadataList = imageUrls.map((url, i) => ({
      name: `${collectionName} #${i + 1}`,
      description: descriptionArr[i],
      image: url
    }));

    const metadataUrls = await uploadMetadataToIPFS(metadataList);

    const contractAddress = await deployCollection(collectionName, symbol);
    await mintNFTs(contractAddress, metadataUrls);

    const firstImage = metadataList[0].image;

    const saved = await Collection.create({
      collectionName,
      symbol,
      contractAddress,
      owner: process.env.OWNER_ADDRESS,
      firstImageUrl: firstImage
    });

    imageFiles.forEach(file => fs.unlinkSync(file.path));
    res.json({ success: true, collection: saved });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
