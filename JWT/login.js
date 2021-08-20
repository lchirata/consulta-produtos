exports.login = async function(email, password){
    let login = "Logon failed";
    try{
        login = await session.run(
            'MATCH (u:user {email: $email}) MATCH (p:user {password: $password}) return u',{
                email:email,
                password: password    
            }
        )

        for(var i = 0; i < login.records.length; i++ ){
            user = login.records[i]._fields
            if(email == user[0].properties.email && password == user[0].properties.password ){
                user_name = login.records[0]._fields[0].properties.name
                    return user_name
            }
            else{
                user_name = undefined
                return user_name
            }
        }
    }
    catch(err){
        console.error(err);
        return user;
    }

}