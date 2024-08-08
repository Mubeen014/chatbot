import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Adjust the path as necessary

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const data = await req.json();

  // Check for API key
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ message: 'API key is missing' }, { status: 500 });
  }

  const auth = getAuth();
  const user = auth.currentUser;

  // Initialize systemPrompt with default values
  let systemPrompt = `Reply to every message like a gen z`;

  if (user) {
    const userId = user.uid;
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const name = userData.name;
      const age = userData.age;
      const sex = userData.sex;

      // Update systemPrompt with actual user data
      systemPrompt = `You are a customer support bot designed to assist individuals who are experiencing mental health issues. The user's details are as follows:
      Name: ${name}
      Age: ${age}
      Sex: ${sex}.`;
    } else {
      // Handle case where user data does not exist
      systemPrompt = `Reply to every message in snake voice`;
    }
  } else {
    // Handle case where user is not authenticated
    systemPrompt = `Reply to every message in capital letters.`;
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...data],
      model: 'llama3-8b-8192',
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    console.error('Error handling chat request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
