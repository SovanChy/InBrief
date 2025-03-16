'use client'
import React, { useState, useEffect } from 'react';
import {AddFireStoreData} from '../firebase/(hooks)/addFireStoreData';
import { GetFirestoreData } from '../firebase/(hooks)/getFirestoreData';
import { OpenAI } from 'openai';






export default function Page() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const {addData} = AddFireStoreData('test');
    const {data} = GetFirestoreData('test');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const doc = {
            name: name,
            email: email,
        }
        try {
            await addData(doc).then(() => {
                alert('Data added successfully');
            });
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    };

  

    return (
        <div>
            <h1>Submit Data to Firebase</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {data && (
                <div>
                    <h2>{data.name}</h2>
                    <p>{data.email}</p>
                </div>
            )}
        </div>
    );
};

