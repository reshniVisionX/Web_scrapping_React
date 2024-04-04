const express = require('express');
const app = express();

const db_connect=require('./model/db');
const formats = require('./routes/fileformatting');
const port = process.env.PORT || 3000;


app.use(express.json());
db_connect(); 

app.use(formats);

app.listen(port, () => {
   console.log(`Server started on port ${port}`); 
});
