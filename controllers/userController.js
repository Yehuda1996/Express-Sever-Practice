import {v4 as uuidv4}  from 'uuid';
import validator from 'validator';
import jsonfile from 'jsonfile';
import axios from 'axios';

const filePath = './users.json';
const dummyJsonProductUrl = 'https://dummyjson.com/products/1';
const jsonPlaceholderUrl = 'https://jsonplaceholder.typicode.com/users';

const users =[
    {
        id: "1",
        email: "happyhour@gmail.com",
        password: "1234"
    },
    {
        id: "2",
        email: "theniggun@gmail.com",
        password: "4321"
    },
    {
        id: "3",
        email: "lazysong@gmail.com",
        password: "5678"
    }
];

const getUsersFromFile = async () => {
    try{
        return await jsonfile.readFile(filePath);
    }
    catch(error){
        throw new Error("Error reading users data");
    }
};

const saveUsersToFile = async (users) => {
    try{
        await jsonfile.writeFile(filePath, users, {spaces: 2});
    }
    catch(error){
        throw new Error("Error saving users data");
    }
}

export const getAllUsers =  async (req, res) => {
    try{
        const users = await getUsersFromFile();
        res.status(200).json(users);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try{
        const users = await getUsersFromFile();
        const user = users.find(u => u.id === req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
};

export const createUser = async (req, res) => {
    const {email, password} = req.body;
    if (!validator.isEmail(email)){
        return res.status(400).json({message: "Invalid email fromat"})
    }
    if(!validatePassword(password)){
        return res.status(400).json({
            message: 'Password must be at least 8 characters long, contain one uppercase letter, and one lowercase letter.'
        });
    }

    const newUser = {...req.body, id: uuidv4()};
    try{
        const users = await getUsersFromFile();
        users.push(newUser);
        await saveUsersToFile(users);
        res.status(201).json(newUser);
    }
    catch(error){
        res.status(500).json({message: "Error creating user"})
    }
};

export const updateUser = async (req, res) => {
    try{
        const users = await getUsersFromFile();
        const userId = req.params.id;
        const index = users.findIndex(u => u.id === userId);
        if(index === -1){
            res.status(404).send("User not found");
        }
        users[index] = {...users[index], ...req.body};
        await saveUsersToFile(users);
        res.json(users[index]);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

export const deleteUser = async (req, res) => {
    try{
        const users = await getUsersFromFile();
        const userId = req.params.id;
        users = users.filter(u => u.id !== userId);
        await saveUsersToFile(users);
        res.status(200).json({message: "User deleted successfully"})
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const users = await getUsersFromFile();
        const user = users.find(u => u.email === email && u.password === password);
        if(user){
            res.status(200).send("User is connected");
        }
        else{
            res.status(401).send("Wrong crendentials");
        }
    }
    catch(error){
        res.status(500).json({message: "Error during login process"});
    }
};

export const enrichAndSendUser = async (req, res) => {
    const {userId} = req.body;
    try{
        const productResponse = await axios.get(dummyJsonProductUrl);
        const product = productResponse.data;

        let users = await getUsersFromFile();
        let user = users.find(u => u.id == userId);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.product = product;

        const updatedUsser = {...user, id: 11};
        await axios.post(jsonPlaceholderUrl, updateUser);

        await saveUsersToFile(users);
        res.status(200).json({message: 'User enriched and sent to external server successfully', updatedUser})
    }
    catch(error){
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Error enriching user and sending data to external server' });
    }
};