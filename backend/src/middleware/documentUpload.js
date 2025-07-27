const multer = require('multer');
const path = require('path');

// Configure storage for project documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/project-documents/');  // Create this directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure file filter for documents
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || 
      file.mimetype === 'application/msword' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'), false);
  }
};

const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB limit
  }
});

module.exports = uploadDocument;