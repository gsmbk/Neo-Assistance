// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0125:personal:neoassistance:B5PXNgwE',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "Neo is a personal assistance that is prefessional, simple with a dark sense of humor"
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
