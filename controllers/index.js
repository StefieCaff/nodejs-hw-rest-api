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
    
    async getSingleContact(req, res) {
        try {
            const contact = await Contacts.findOne({ _id: req.params.contactId });
            res.json(contact);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: `${req.params.contactId} is not a valid ID` });
        }
    },

    async deleteContact(req, res) {
        try {
            await Contacts.findOneAndDelete({ _id: req.params.contactId });
            res.status(200).json({message: 'contact deleted'})
        } catch (err) {
            console.log(err);
            res.status(404).json({ message: 'Not Found' });
        }
    },

    async updateContact(req, res) {
        try {
            const updatedContact = await Contacts.findOneAndUpdate(
                { _id: req.params.contactId, }, //* Where are we updating
                { $set: req.body, }, // * What is the new data
                { new: true, } // * Always return the latest change
            );
            res.status(200).json(updatedContact);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
};

module.exports = contactsController;