const express = require('express');
const router = express.Router();
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const fs = require("fs");
const readline = require('readline');
const users = require("../fixtures/users.json")
const organization = require("../fixtures/organization.json");
const { strict } = require('assert');
let role = ""



//authentication
router.post('/login', (req, res, next) => {
    if(
        users.find(user => user.email ===  req.body.email) && 
        users.find( user => user.password ===  req.body.password)
    ){
      let user = users.find(user => user.email ===  req.body.email) 
      const id = user.id 
      const role = user.roles[0]; 
      const token = jwt.sign({ id, role }, process.env.SECRET, {
        expiresIn: 3600 // 1h
      });
      return res.json({ auth: true, token: token, roles: user.roles[0], userId: user.userId });
    }else{
        res.status(500).json({message: 'Login inválido!'});
    }
})

//authorization
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'Token inválido.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if(!decoded){
        return res.send("Sessão expirada. ")
      }
      if (err) return res.status(500).json({ auth: false, message: 'falha ao autenticar o token.' });
      role = decoded.role
      next();
    });
}

router.get('/products/:organizationName', verifyJWT, (req, res, next) => { 
    let organizationName = req.query.organizationName
    let tag = req.query.tag
    let tags = []
    let arr = []
    let products = []
    let data = []
    require('fs').readFileSync('fixtures/products.txt', 'utf-8').split(/\r?\n/).forEach(function(line){
      if(line){products.push(JSON.parse(line))}
    })

    if(role == "junior"){
      for (const org of organization) {
        if(org.name.includes(organizationName)|| org.parent &&  org.parent.includes(organizationName)){
          arr.push(org)
        }
      }
      let organizations = arr.filter(organization => organization.level == 2)
      if(organizations){
        try {
          for (const org of organizations) {
            data.push(products.filter(prod => prod.department == org.name ))
          }  
        }catch (err) {
          res.send("Falha ao carregar produtos. Tente novamente mais tarde")
        }

        if(tag){
          if(typeof(tag) === "string"){
            tags.push(tag)
          }else{
            tags = tag
          }
          let filterByTag = []
          for (let t = 0; t < tags.length; t++ ) {
            for(let i = 0; i < data[0].length; i ++){
              let array = data[0][i].tags
              for(let j = 0; j < array.length; j++){
                  if(array[j] == tags[t]){
                    filterByTag.push(data[0][i])
                  }
              }
            }
          }
          res.send({total: filterByTag.length, products: filterByTag})
        }else{
          let count = 0
          for (const countData of data) {
            count += countData.length
          }
          res.send({total: count, products: data})
        }
      }
      else{      
        res.send("Acesso negado.")
      }
    }

    if(role == "middle"){
      let organizationLevel = organization.find(org => org.name == organizationName);
      if(organizationLevel.level === 1 || organizationLevel.level === 2){
        for (const org of organization) {
          if(org.name.includes(organizationName) || org.parent && org.parent.includes(organizationName)){
            arr.push(org)
          }
        }
        let organizations = arr.filter(organization => organization.level == 1 || organization.level == 2)
        try {
          for (const org of organizations) {
            data.push(products.filter(prod => prod.department == org.name ))
          }  
        }catch (err) {
          res.send("Falha ao carregar produtos. Tente novamente mais tarde")
        }
        if(tag){
          if(typeof(tag) === "string"){
            tags.push(tag)
          }else{
            tags = tag
          }
          let filterByTag = []
          for (let t = 0; t < tags.length; t++ ) {
            for(let i = 0; i < data[0].length; i ++){
              let array = data[0][i].tags
              for(let j = 0; j < array.length; j++){
                  if(array[j] == tags[t]){
                    filterByTag.push(data[0][i])
                  }
              }
            }
          }
          res.send({total: filterByTag.length, products: filterByTag})
        }else{
          let count = 0
          for (const countData of data) {
            count += countData.length
          }
          res.send({total: count, products: data})
        }
      }else{
        res.send("Acesso negado.")
      }
    }

    if(role == "senior"){
        for (const org of organization) {
          if(org.name.includes(organizationName) || org.parent && org.parent.includes(organizationName) ){
            arr.push(org)
          }
        }
        let organizations = arr
        try {
          for (const org of organizations) {
            data.push(products.filter(prod => prod.department == org.name ))
          }  
        }catch (err) {
          res.send("Falha ao carregar produtos. Tente novamente mais tarde")
        }
        if(tag){
          if(typeof(tag) === "string"){
            tags.push(tag)
          }else{
            tags = tag
          }
          let filterByTag = []
          for (let t = 0; t < tags.length; t++ ) {
            for(let i = 0; i < data[0].length; i ++){
              let array = data[0][i].tags
              for(let j = 0; j < array.length; j++){
                  if(array[j] == tags[t]){
                    filterByTag.push(data[0][i])
                  }
              }
            }
          }
          res.send({total: filterByTag.length, products: filterByTag})
        }else{
          let count = 0
          for (const countData of data) {
            count += countData.length
          }
          res.send({total: count, products: data})
        }
    }

    if(role == "intern"){
      let arr = []
      if(!organizationName.includes("STUFF A")){
        res.send("permissão negada")
      }
      for (const org of organization) {
        if(org.name.includes("STUFF A")|| org.parent && org.parent.includes("STUFF A")){
          arr.push(org)
        }
      }
      try {
        for (const org of arr) {
          let item = products.filter(prod => prod.department == org.name )
            if(item.length > 0) {
              data.push(item)
            }
        }
      }catch(err){
        res.send("Falha ao carregar produtos. Tente novamente mais tarde")
      }  

      if(tag){
        if(typeof(tag) === "string"){
          tags.push(tag)
        }else{
          tags = tag
        }
        let filterByTag = []
        for (let t = 0; t < tags.length; t++ ) {
          for(let i = 0; i < data.length; i ++){
            for(let k = 0; k< data[i].length; k++){
              let array = data[i][k].tags
              for(let j = 0; j < array.length; j++){
                if(array[j] == tags[t]){
                  filterByTag.push(data[i])
                }
              }
            }     
          }
        }
        res.send({total: filterByTag.length, products: filterByTag})
      }else{
        let count = 0
        for (const countData of data) {
          count += countData.length
        }
        res.send({total: count, products: data})
      }
    }
    
})

module.exports = router;