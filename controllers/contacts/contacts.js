const Contacts = require('../../models/contacts');
const gravatar = require('gravatar');

const contactsController = {
    async getContacts(req, res) {
        const { page = 1, limit = 20, favorite } = req.query;
        const filter = favorite === true ? { isfavorite: true } : {};
        try {

           const query = Contacts.find(filter)
                .limit(limit * 1)
                .skip((page - 1) * limit);
                
            const count = await Contacts.countDocuments(filter)
            const contacts = await query.exec();

            res.status(200).json({
                contacts,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            });
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
    },

    async addToFavorites(req, res) {
        try {
            const body = req.body;
            const contactId = req.params.contactId;
            const favoriteContact = await Contacts.findByIdAndUpdate(
                contactId,
                body,
                { new: true, },
            );
            res.status(200).json(favoriteContact);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async uploadFile (req, res) {
        try {
             res.json(req.body)
        } catch (err) {
             console.log(err);
        }
    }
};

module.exports = contactsController;