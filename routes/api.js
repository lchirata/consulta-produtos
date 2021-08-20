const express = require('express');
const router = express.Router();
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const fs = require("fs");
const users = require("../fixtures/users.json")


//authentication
router.post('/login', (req, res, next) => {
    if(
        users.find(user => user.email ===  req.body.email) && 
        users.find( user => user.password ===  req.body.password)
    ){
      let user = users.find(user => user.email ===  req.body.email) 
      const id = 1; 
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 // 5min 
      });
      return res.json({ auth: true, token: token, roles: user.roles[0], userId: user.userId });
    }else{
        res.status(500).json({message: 'Login inválido!'});
    }
})


//authorization
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

router.get('/products', verifyJWT, (req, res, next) => { 
    console.log("Retornou todos clientes!");
    res.json([{id:1,nome:'luiz'}]);
})

module.exports = router;