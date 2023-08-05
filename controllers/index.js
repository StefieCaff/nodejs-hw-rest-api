const Contacts = require('../models/contacts');

const contactsController = {
    async getContacts(req, res) {
        try {
            const data = await Contacts.find()
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    
    async createContact(req, res) {
        try {
            const newContact = await Contacts.create(req.body)
            res.status(200).json(newContact);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    

};

module.exports = contactsController;