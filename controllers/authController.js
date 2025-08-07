const bcrypt = require('bcrypt');
const pool = require('../db');
const generateToken = require('../utils/generateToken');


const register = async (req, res) =>{

    //get req parameters
    const {name, email, password, role} = req.body;

    //password to encrypt
    const hashPassword = await bcrypt.hash(password,10);

   //query to store req data
    const result = await pool.query('insert into users (name, email, password, role) values ($1, $2, $3, $4) returning *',[name, email, hashPassword, role || 'user'])

    //return user object with generated token

    const user = result.rows[0];

    res.json({
        user:{
            id:user.id,
            name:user.name,
            email: user.email,
            role: user.role
        },
        token:generateToken(user)
    });
};

module.exports = {register};