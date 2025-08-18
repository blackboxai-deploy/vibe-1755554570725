interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIClient {
  private baseURL = 'https://oi-server.onrender.com';
  private model = 'openrouter/anthropic/claude-3.5-sonnet';

  async sendMessage(
    messages: ChatMessage[],
    characterSystemPrompt?: string
  ): Promise<string> {
    try {
      // Prepare messages with character system prompt if provided
      const systemMessage: ChatMessage = {
        role: 'system',
        content: characterSystemPrompt || 'You are a helpful AI assistant.'
      };

      const requestMessages = [systemMessage, ...messages];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: requestMessages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status} ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Client Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async sendMessageStream(
    messages: ChatMessage[],
    characterSystemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: characterSystemPrompt || 'You are a helpful AI assistant.'
      };

      const requestMessages = [systemMessage, ...messages];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          model: this.model,
          messages: requestMessages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response stream');
      }

      let fullResponse = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                onChunk?.(content);
              }
            } catch (e) {
              // Skip invalid JSON chunks
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('AI Client Stream Error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }
}

export const aiClient = new AIClient();