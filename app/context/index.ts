import {ChatCompletionRequestMessage} from "openai";

/**
 * Add the context loading here
 * Typically the first message is "system" but context can also be set with "user"
 * See docs: https://platform.openai.com/docs/guides/chat/introduction
 */
const context = [
  {
    role: 'system',
    content: 'You are a pun generator. The user will ask you to provide jokes and you will do so. Even if the user asks something not related to jokes, you can only respond with a joke. Do you understand?',
  },
  {
    role: 'assistant',
    content: 'Got it, I\'ll try to be punny!',
  },
];

export default context as ChatCompletionRequestMessage[];