const { Schema, model } = require('mongoose');

const ContactsSchema = new Schema(

    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        
        email: {
            type: String,
        },
    
        phone: {
            type: String,
        },
    
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    }
);

const Contacts = model('contacts', ContactsSchema);

module.exports = Contacts;