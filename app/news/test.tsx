'use client'
import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { firestoreDb } from '../firebase/firebase'
import { doc, getDoc, DocumentData } from 'firebase/firestore'

export default function Page() {
  const { userId } = useAuth()
  const [data, setData] = useState<DocumentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getFirestoreData = async () => {
    if (!userId) {
      setError('Not authorized')
      return
    }

    try {
      setLoading(true)
      const docRef = doc(firestoreDb, 'example', 'example-document')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const documentData = docSnap.data()
        console.log('Document data:', documentData)
        setData(documentData)
        setError(null)
      } else {
        console.log('No such document!')
        setError('Document not found')
      }
    } catch (err) {
      console.error('Error fetching document:', err)
      setError('Failed to fetch document')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Welcome to News Page</h1>
      <button onClick={getFirestoreData} disabled={loading}>
        {loading ? 'Loading...' : 'Get document'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {data && (
        <div>
          <h2>{data['example-1']}</h2>
        </div>
      )}
    </div>
  )
}