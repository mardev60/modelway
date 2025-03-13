export const mockChatGPTResponse = {
  id: 'chatcmpl-39473394bc4f4f9286f9555ea1375031',
  choices: [
    {
      finish_reason: 'length',
      index: 0,
      logprobs: null,
      message: {
        content:
          'Yes I can create a simple NestJS application with a Angular frontend',
        refusal: null,
        role: 'assistant',
        audio: null,
        function_call: null,
        tool_calls: [],
      },
      stop_reason: null,
    },
  ],
  created: 1739816308,
  model: 'meta-llama/Llama-3.3-70B-Instruct',
  object: 'chat.completion',
  service_tier: null,
  system_fingerprint: null,
  usage: {
    completion_tokens: 1,
    prompt_tokens: 45,
    total_tokens: 46,
    completion_tokens_details: null,
    prompt_tokens_details: null,
  },
  prompt_logprobs: null,
};
