import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, character, characterId, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Extract system prompt from character object or fallback to direct systemPrompt
    const characterSystemPrompt = character?.systemPrompt || systemPrompt || 'You are a helpful AI assistant.';
    const characterName = character?.name || 'Assistant';

    // Prepare messages with system prompt
    const formattedMessages = [
      {
        role: 'system',
        content: `You are ${characterName}. ${characterSystemPrompt}

Important guidelines:
- Stay in character at all times
- Respond naturally and conversationally  
- Keep responses engaging but concise
- Maintain the personality traits described above
- If asked about your nature, acknowledge you're an AI character but stay in role`
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenRouter API via custom endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_SGPn4uhjPI0F4w',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/anthropic/claude-sonnet-4',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get AI response' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      );
    }

    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({
      content: aiMessage,
      characterId: characterId || character?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Chat API is running' },
    { status: 200 }
  );
}