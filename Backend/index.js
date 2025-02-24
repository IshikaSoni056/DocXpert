const express = require('express')    // Express framework for handling HTTP requests
const multer = require('multer')      // Middleware for handling file uploads
const cors = require('cors')          // Middleware for handling Cross-Origin Resource Sharing (CORS)
const docxToPDF = require('docx-pdf') // Library to convert Word files to PDF
const path = require('path')          // Built-in Node.js module for file paths
const app = express()


const port = 3000
app.use(cors());

// setting up the storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

app.post('/convertFile', upload.single('file'),  (req, res, next) =>{
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  try {

    if(!req.file){
      return res.status(400).json({
        message : "No File Uploaded"
      })
    }
    //  output file path 
    let outputPath =  path.join(__dirname, "files", `${req.file.originalname}.pdf`)
    docxToPDF(req.file.path,outputPath,(err,result)=>{
      if(err){
        console.log(err);
        return res.status(500).json({
          message : "Error converting docs to pdf"
        })
      }
      res.download(outputPath,()=>{
        console.log("file downloaded")
      })
      
    });
  
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message : "Internal server Error"
    })
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})