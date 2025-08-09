const express = require('express')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 8000

// Middleware
app.use(bodyParser.json())
app.use(cors())

let pool  

// Initialize MySQL pool ection to TiDB
// const initMySQL = async () => {
//     try {
//         pool  = await mysql.createpool ection({
//             host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
//             user: '4PKNnir42HtwSYB.root',
//             password: 'cckdTdxhUGx1Nuwd',
//             database: 'Nero',
//             port: 4000,
//             ssl: {
//                 minVersion: 'TLSv1.2',
//                 rejectUnauthorized: true
//             }
//         })
//         console.log('pool ected to TiDB successfully!')
//     } catch (error) {
//         console.error('Error pool ecting to TiDB:', error)
//         process.exit(1)
//     }
// }

// Initialize MySQL pool ection to TiDB

const initMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to TiDB successfully (using pool)!');
  } catch (error) {
    console.error('Error connecting to TiDB:', error);
    process.exit(1);
  }
};

app.get('/customers', async(req, res) => {
    try{
        const [row] = await pool .execute('select * from CustomerData')
        res.json(row)
    }catch (error){
        console.log("Error fetching data", error)
        res.status(500).json({error : 'Server Erorr'})
    }
})



app.post('/createuser', async (req, res) => {   
    let user = req.body; 
    try{


       const [results] = await pool .query(
            'INSERT INTO CustomerData (FullName, PhoneNumber, Email, RegisterDate) VALUES (?, ?, ?, ?)',
            [user.fullName, user.phoneNumber, user.email, user.registerDate]
            );

        
        console.log('resuts',results)


        res.status(201).json({
            message: 'เพิมข้อมูลสำเร็จ',
            inserId: results.inserId
        })
   
    }catch(error){
        console.error('Error inserting data:', error);
        res.status(500).json({
            message: 'something wrong'
        })
    }
});

app.delete('/customers/:id', async (req , res) =>{
    const  custmerId = req.params.id;

    try{
        const [result] = await pool .query( 'delete from CustomerData where CustomerID = ?', [custmerId]);
        if (result.affectedRows == 0){
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }
        res.status(200).json({message: 'ลบข้อมูลแล้ว'});
/*
DELETE FROM CustomerData WHERE CustomerID = ?
MySQL / TiDB จะส่งกลับผลลัพธ์ในตัวแปร result ซึ่งมี property ชื่อ affectedRows
ที่บอกว่า คำสั่งนี้มีผลกับกี่แถว (แถวที่ถูกลบ/อัปเดต/แทรก)

จากนั้น if ว่า 

 ถ้าไม่มีแถวไหนถูกลบเลย → ส่ง response แจ้งว่า “ไม่พบข้อมูลที่ต้องการลบ”

 */

    }catch(err){
        console.error('Error deleting data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
} )



// Start server
// const startServer = async () => {
//     await initMySQL()
//     app.listen(port, () => {
//         console.log(`Server is running on http://localhost:${port}`)
//     })
// }

// Start server
const startServer = async () => {
    await initMySQL()
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`)
    })
}

// localhost = Container ใช้เองภายในเท่านั้น
// 0.0.0.0 = เปิดให้บริการทุก interface → ทำให้ Render (หรือใครก็ได้) เข้าถึงได้

// เปิด http://localhost:8000/customers

startServer();