import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Tu es un expert en marketing digital.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 200
  })

  return NextResponse.json({
    result: completion.choices[0].message.content
  })
}
