import {type ChatCompletionRequestMessage} from 'openai';

/**
 * Add the context loading here
 * Typically the first message is "system" but context can also be set with "user"
 * See docs: https://platform.openai.com/docs/guides/chat/introduction
 */
const context = [
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
];

export default context as ChatCompletionRequestMessage[];