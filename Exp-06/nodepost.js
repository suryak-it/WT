const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

// MongoDB connection URI including the database name
const uri = 'mongodb://localhost:27017/exp6';
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    const query = url.parse(req.url).query;
    const params = querystring.parse(query);
    const username = params["username"];
    const id = params["id"];
    const branch = params["branch"];
    const mobileNo = params["phno"];
    const gender = params["gender"];
    const branchadd = params["branchadd"];

    if (req.url.includes("/insert")) {
        await insertData(req, res, username, id, branch, mobileNo, gender, branchadd);
    } else if (req.url.includes("/delete")) {
        await deleteData(req, res, id);
    } else if (req.url.includes("/update")) {
        await updateData(req, res, id, mobileNo);
    } else if (req.url.includes("/display")) {
        await displayTable(req, res);
    }
}

async function insertData(req, res, username, id, branch, mobileNo, gender, branchadd) {
    try {
        const database = client.db('webtech');
        const collection = database.collection('employee_details');

        const employee = {
            username,
            id,
            branch,
            mobileNo,
            gender,
            branchadd
        };

        const result = await collection.insertOne(employee);
        console.log(`${result.insertedCount} document inserted`);

        // HTML response
        var htmlResponse = `
            <html>
            <head>
                <title>Employee Details</title>
                <style>
                    table {
                        width: 80%;
                        margin: auto;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th{
                        background-color:#ff5050;
                        color:white;
                    }
                    td {
                        background-color: #6a6a6a;
                        color:white;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;">Employee Details</h1>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Gender</th>
                        <th>Branch</th>
                        <th>Mobile No</th>
                        <th>Address</th>
                    </tr>
                    <tr>
                        <td>${username}</td>
                        <td>${id}</td>
                        <td>${gender}</td>
                        <td>${branch}</td>
                        <td>${mobileNo}</td>
                        <td>${branchadd}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(htmlResponse);
        res.end();
    } catch (error) {
        console.error('Error inserting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function deleteData(req, res, id) {
    try {
        const database = client.db('webtech');
        const collection = database.collection('employee_details');

        const filter = { id: id };

        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} document deleted`);

        if (result.deletedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Document deleted successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Document not found');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function updateData(req, res, id, newPhoneno) {
    try {
        const database = client.db('webtech');
        const collection = database.collection('employee_details');

        const filter = { id: id };

        const updateDoc = {
            $set: { mobileNo: newPhoneno }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.modifiedCount} document updated`);

        if (result.modifiedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Phone number updated successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Employee ID not found');
        }
    } catch (error) {
        console.error('Error updating data:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTable(req, res) {
    try {
        const database = client.db('webtech');
        const collection = database.collection('employee_details');

        const cursor = collection.find({});
        const employees = await cursor.toArray();

        let tableHtml = `
            <html>
                <head>
                    <title>Employee Details</title>
                    <style>
                    table {
                        width: 80%;
                        margin: auto;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ccc;
                        padding: 8px;
                        text-align: left;
                    }
                    th{
                        background-color:#ff5050;
                        color:white;
                    }
                    td {
                        background-color: #6a6a6a;
                        color:white;
                    }
                    </style>
                </head>
                <body>
                    <h2 style="text-align:center;">Employee Details</h2>
                    <table>
                        <tr>
                            <th>Username</th>
                            <th>ID</th>
                            <th>Branch</th>
                            <th>Mobile No</th>
                            <th>Gender</th>
                            <th>Branch Address</th>
                        </tr>
        `;

        employees.forEach(employee => {
            tableHtml += `
                <tr>
                    <td>${employee.username}</td>
                    <td>${employee.id}</td>
                    <td>${employee.branch}</td>
                    <td>${employee.mobileNo}</td>
                    <td>${employee.gender}</td>
                    <td>${employee.branchadd}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </table>
                </body>
            </html>
        `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(tableHtml);
        res.end();
    } catch (error) {
        console.error('Error displaying table:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Create HTTP server
http.createServer(onRequest).listen(7050);
console.log('Server is running...');