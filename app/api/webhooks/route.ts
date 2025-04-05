import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth} from 'firebase-admin/auth'










function initFirebase() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '', 'base64').toString('utf-8')
    )
    
    initializeApp({
      credential: cert(serviceAccount)
    })
  }
  
  return getAuth()
}



export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET



  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

   // Initialize Firebase Auth
   const auth = initFirebase()

   try {
    switch (evt.type) {
      case 'user.created': {
        // Create a new user in Firebase when a user is created in Clerk
        const { id } = evt.data        
        console.log(`User ${id} created in Firebase`)
        break
      }
      
      case 'user.updated': {
        // Update user details in Firebase when updated in Clerk
        const { id, email_addresses, username, first_name, last_name, image_url } = evt.data
        
        // Get primary email if available
        const primaryEmail = email_addresses?.find(email => email.id === evt.data.primary_email_address_id)
        const emailAddress = primaryEmail?.email_address
        
        const updateData: Partial<{ email: string; displayName: string; photoURL: string }> = {}
        
        if (emailAddress) updateData.email = emailAddress
        if (username || first_name || last_name) {
          updateData.displayName = username || `${first_name || ''} ${last_name || ''}`.trim() || undefined
        }
        if (image_url) updateData.photoURL = image_url
        
        await auth.updateUser(id, updateData)


        console.log(`User ${id} updated in Firebase`)
        break
      }
      
      case 'user.deleted': {
        // Delete user from Firebase when deleted from Clerk
        const { id } = evt.data
        if (id) {
          await auth.deleteUser(id)
          console.log(`User ${id} deleted from Firebase`)
        } else {
          console.error('Error: User ID is undefined')
        }
        break
      }
      
      case 'session.created': {
        // Optional: Track when a user signs in via Clerk
        const { id } = evt.data
       
        console.log(`Session created for user: ${id}`)

        break
      }
      
      case 'session.removed': {
        // Optional: Track when a user signs out of Clerk
        const { user_id } = evt.data
        try {
          console.log('User signed out from Firebase')
        } catch (err) {
          console.error('Firebase sign-out error:', err)
        }
        console.log(`Session removed for user: ${user_id}`)
        break
      }
    }
  

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', body)

  


  return new Response('Webhook received', { status: 200 })
} catch (error) {
  console.error('Error processing webhook:', error)
  return new Response(`Error processing webhook: ${error}`, { 
    status: 500 
  })
}
}