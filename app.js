// REQUIRE MODULES
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Express connection
const app = express();

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'parkville'
});

db.connect((err) => {
    if(err) {
        throw err;
    } else {
        console.log('Connected to the database');
    }
});

// create a Database
function createDatabase() {
    const sql = 'CREATE DATABASE Parkville';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
    });
}

//createDatabase();

// create a user table
function RoleTable() {
   let sql = `CREATE TABLE role(
        id INT AUTO_INCREMENT,
        name VARCHAR(100), 
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
        console.log(result);
        }
    });
}

// create department table
function DepartmentTable() {
    let sql = `CREATE TABLE department( 
        id INT AUTO_INCREMENT,
        name VARCHAR(255),
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {    
        if(err) {
            throw err;
        } else {
            console.log(result);
        }
    });
}

// create user table
function createUserTable() {
    let sql = `CREATE TABLE user( 
        id INT AUTO_INCREMENT,
        name VARCHAR(100),
        department_id INT(50),
        role_id INT(50),
        PRIMARY KEY(id),
        FOREIGN KEY(role_id) REFERENCES role(id),
        FOREIGN KEY(department_id) REFERENCES department(id)
        )`;
    db.query(sql, (err, result) => {    
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('User table created');
        }
    });
}

// create a unit table
function createUnitTable() {
    let sql = `CREATE TABLE unit(
        id INT AUTO_INCREMENT,
        number_plate VARCHAR(100) UNIQUE,
        color VARCHAR(100),
        model VARCHAR(100),
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Unit table created');
        }
    });
}

// create parking service table
function createParkingServiceTable() {
    let sql = `CREATE TABLE parkingService(
        id INT(50) AUTO_INCREMENT,
        date_of_arrival DATETIME,
        date_of_departure DATETIME,
        PRIMARY KEY(id),
        user_id INT(50),
        unit_id INT(50),
        driver_id INT(50),
        FOREIGN KEY(user_id) REFERENCES user(id),
        FOREIGN KEY(unit_id) REFERENCES unit(id),
        FOREIGN KEY(driver_id) REFERENCES driver(id),
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Parking service table created');
        }
    });
}

// CREATE A PARKING FEE TABLE
function createParkingFeeTable() {
    let sql = `CREATE TABLE parkingFee(
        id INT(50) AUTO_INCREMENT,
        unit_type VARCHAR(100),
        duration VARCHAR(50),
        fee INT(50),
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Parking fee table created');
        }
    });
}

// create parking charge table
function createParkingChargeTable() {
    let sql = `CREATE TABLE parkingCharge(
        id INT(50) AUTO_INCREMENT,
        parking_service_id INT(50),
        parking_fee_id INT(50),
        FOREIGN KEY(parking_service_id) REFERENCES parkingService(id),
        FOREIGN KEY(parking_fee_id) REFERENCES parkingF bee(id),
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Parking charge table created');
        }
    });
}

// create driver table
function createDriverTable() {
    let sql = `CREATE TABLE driver(
        id INT AUTO_INCREMENT,
        name VARCHAR(100),
        gender VARCHAR(50),
        phone_number VARCHAR(100),
        nin VARCHAR(100),
        PRIMARY KEY(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Driver table created');
        }
    });
}

// Create a car tyre service fee table
function createCarTyreServiceFeeTable() {
    let sql = `CREATE TABLE car_tyre_service_fee(
        id INT AUTO_INCREMENT,
        name VARCHAR(100),
        fee INT(255),
        user_id INT(255),
        PRIMARY KEY(id),
        FOREIGN KEY(user_id) REFERENCES user(id)
        )`;
    db.query(sql, (err, result) => {
        if(err) {
            throw err;
        } else {
            console.log(result);
            console.log('Car tyre service fee table created');
        }
    });
}


// create all tables
function createAllTables() {
    //RoleTable();
    //DepartmentTable();
    //createUserTable();
    //createUnitTable();cls
    //createDriverTable();
    //createParkingServiceTable();
    //createCarTyreServiceFeeTable();
    createParkingChargeTable();
}

createAllTables();

// CRUD - Create, Read, Update, Delete OPERATIONS
// insert data into the table
app.post('/roles', (req, res) => {
    let role = req.body;
    let sql = 'INSERT INTO Role SET ?';
    let id = null;

    let query = null;
    new Promise ( (resolve, reject) => {
        query = db.query(sql, role, (err, result) => {
            if (err) throw err;
            id = result['insertId'];
            resolve(id)
        });
       
    }).then((id) => {
        let response = {id: id, ...query.values}
        res.json(response);
    })
   
});

// fetching all roles
app.get('/roles', (req, res) => {
    let sql = 'SELECT * FROM Role';
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

// fetching a single role
app.get('/roles/:id', (req, res) => {
    let sql = `SELECT * FROM Role WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result[0]);
        console.log(result);
    });
});

// update a role
app.put('/roles/:id', (req, res) => {
    let sql = `UPDATE Role SET name = '${req.body.name}' WHERE id = ${req.params.id}`;
    let role = null;
    new Promise ( (resolve, reject) => {
        db.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log(result)
        });
        
        resolve();
        
    }).then(() => {
        let sql = `SELECT * FROM Role WHERE id = ${req.params.id}`;
        db.query(sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.json(results[0]);
        });
    })
});


// delete a role
app.delete('/roles/:id', (req, res) => {
    let sql = `DELETE FROM Role WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

// Server Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});