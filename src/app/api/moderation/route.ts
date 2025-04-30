import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const { message } = await req.json()
  const check = await openai.moderations.create({ input: message })
  const flagged = check.results[0].flagged

  return NextResponse.json({ allowed: !flagged, flagged })
}
