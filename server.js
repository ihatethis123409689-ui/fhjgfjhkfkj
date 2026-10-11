import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// 1. 🔑 PASTE YOUR VAPI PRIVATE API KEY HERE
const VAPI_API_KEY = 'a07a4cdf-0abf-43df-967c-30369767135b'; 

// 2. 🎵 PASTE YOUR DIRECT LIVE MP3 LINK HERE
const MP3_URL = 'https://www.dropbox.com/scl/fi/67vmrupvf9kfysch7z0ff/sam.wav?rlkey=83k5utbx7vu461hovg48hkr0d&st=s677w0pu&raw=1'; 

app.post('/vapi-webhook', async (req, res) => {
  const event = req.body;

  // Listen for the transcript text from Vapi in real-time
  if (event.type === 'transcript' || event.type === 'speech-update') {
    const text = event.transcript?.toLowerCase() || '';
    const callId = event.call?.id;

    // Check if the caller said "buy", "bye", or "by"
    if (text.includes('buy') || text.includes('bye') || text.includes('by')) {
      console.log(`Trigger phrase detected in call ${callId}. Playing MP3...`);

      try {
        // Send a request to Vapi to interrupt the AI and play the file
        await axios.post(
          `https://vapi.ai{callId}/play-audio`,
          {
            url: MP3_URL,
            interrupt: true 
          },
          {
            headers: {
              Authorization: `Bearer ${VAPI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error('Error triggering Vapi audio playback:', error.response?.data || error.message);
      }
    }
  }

  // Always return a 200 OK status to Vapi
  res.sendStatus(200);
});

// Required for continuous 24/7 hosting on Vercel
export default app;

