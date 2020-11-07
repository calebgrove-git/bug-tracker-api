# Bug Tracker API 

This REST API is made for my bug tracker application using Node and Express. 
It processes requests to store, update, and get data from a postgres database.

# Endpoints  https://secure-journey-81702.herokuapp.com/

### Users Route /api/users/

#### /create
- Post Requests create a new user
Body  
email : string : required   
password : string : required    
company : string : required  
<br/>
Passwords are hashed by the server before they are stored.

#### /login
- Post Requests authenticate email and password so user can log in
Body  
email : string : required   
password : string : required    

### Bugs Route /api/bugs/
#### /  
- Post Requests create a new bug  
Body  
name : string : required  
details : string : required  
steps : string : required  
version : string :required  
priority : int : required   
creator : string : required  
company : string : required   
#### /:id
- Delete reqests delete specified bug   
- Patch requests update specified bug  
Body  
name : string   
details : string   
steps : string  
version : string     
priority : int  
creator : string  
company : string
#### /:id/complete
- Patch Requests automatically sets bugs completed  
Body  
name : string   
details : string   
steps : string  
version : string     
priority : int  
creator : string  
company : string
#### /get/:company
- Get Requests grab all bugs for specified company
