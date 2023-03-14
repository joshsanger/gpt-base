import {useRef, useEffect, useCallback, useState} from 'react';
import {Configuration, OpenAIApi, ChatCompletionRequestMessage} from 'openai';

import {type ActionArgs} from '@remix-run/node';
import {Form, useActionData, useNavigation, Link, useSubmit} from '@remix-run/react';

import context from '~/context';
import {Send as SendIcon} from '~/components/Icons';
import Message from '~/components/Message';

export interface ReturnedDataProps {
  message?: string;
  answer: string;
  error?: string;
  chatHistory: ChatCompletionRequestMessage[];
}

export interface ChatHistoryProps extends ChatCompletionRequestMessage {
  error?: boolean,
}

/**
 * API call executed server side
 */
export async function action({request}: ActionArgs): Promise<ReturnedDataProps> {
  const body = await request.formData();
  const message = body.get('message') as string;
  const chatHistory = JSON.parse(body.get('chat-history') as string) || [];

  // store your key in .env
  const conf = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const openai = new OpenAIApi(conf);

    const chat = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        ...context,
        ...chatHistory,
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const answer = chat.data.choices[0].message?.content;

    return {
      message: body.get('message') as string,
      answer: answer as string,
      chatHistory,
    };
  } catch (error: any) {
    return {
      message: body.get('message') as string,
      answer: '',
      error: error.message || 'Something went wrong! Please try again.',
      chatHistory,
    };
  }
}

export default function IndexPage() {
  const minTextareaRows = 1;
  const maxTextareaRows = 6;

  const data = useActionData<typeof action>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const submit = useSubmit();
  const [chatHistory, setChatHistory] = useState<ChatHistoryProps[]>([]);

  const isSubmitting = navigation.state === 'submitting';

  /**
   * Handles the change event of a textarea element and adjusts its height based on the content.
   * Note: Using the ref to alter the rows rather than state since it's more performant / faster.
   * @param event - The change event of the textarea element.
   */
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!inputRef.current) {
      return;
    }

    // reset required for when the user pressed backspace (otherwise it would stay at max rows)
    inputRef.current.rows = minTextareaRows;

    const lineHeight = parseInt(window.getComputedStyle(inputRef.current).lineHeight);
    const paddingTop = parseInt(window.getComputedStyle(inputRef.current).paddingTop);
    const paddingBottom = parseInt(window.getComputedStyle(inputRef.current).paddingBottom);
    const scrollHeight = inputRef.current.scrollHeight - paddingTop - paddingBottom;
    const currentRows = Math.floor(scrollHeight / lineHeight);

    if (currentRows >= maxTextareaRows) {
      inputRef.current.rows = maxTextareaRows;
      inputRef.current.scrollTop = event.target.scrollHeight;
    } else {
      inputRef.current.rows = currentRows;
    }
  };

  /**
   * Adds a new message to the chat history
   * @param data The message to add
   */
  const pushChatHistory = useCallback((data: ChatHistoryProps) => {
    setChatHistory(prevState => ([...prevState, data]));
  }, [setChatHistory]);

  /**
   * Saves the user's message to the chat history
   * @param content The user's message
   */
  const saveUserMessage = (content: string) => {
    pushChatHistory({
      content,
      role: 'user',
    })
  };

  /**
   * Ensure the user message is added to the chat on submit (button press)
   * @param event Event from the form
   */
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.target as HTMLFormElement);
    const message = formData.get('message');

    saveUserMessage(message as string);
  };

  /**
   * Submits the form when the user pressed enter but not shift + enter
   * Also saves a mesasge to the the chat history
   *
   * @param event The keydown event
   */
  const submitFormOnEnter = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      const value = (event.target as HTMLTextAreaElement).value
      saveUserMessage(value);
      submit(formRef.current, {replace: true});
    }
  }, [submit, formRef, saveUserMessage]);

  /**
   * Focuses the input element when the page is loaded and clears the
   * input when the form is submitted
   */
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (navigation.state === 'submitting') {
      inputRef.current.value = '';
    } else {
      inputRef.current.focus();
    }
  }, [navigation.state]);

  /**
   * Adds the API's response message to the chat history
   * when the data comes back from the action method
   */
  useEffect(() => {
    if (data?.error) {
      pushChatHistory({
        content: data.error as string,
        role: 'assistant',
        error: true,
      })

      return;
    }

    if (data?.answer) {
      pushChatHistory({
        content: data.answer as string,
        role: 'assistant',
      })
    }
  }, [data, pushChatHistory])

  /**
   * Scrolls to the bottom of the chat container when the chat history changes
   */
  useEffect(() => {
    if (!chatContainerRef.current) {
      return;
    }

    if (chatHistory.length) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <main className="container">
      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.length === 0 && (
          <div className="intro">
            <div className="intro-content">
              <h1>Open AI base</h1>
              <p>Ask anything 😊</p>
            </div>
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="messages">
            {chatHistory.map((chat, index) => (
              <Message
                error={chat.error}
                content={chat.content}
                key={`message-${index}`}
                role={chat.role}
              />
            ))}
            {isSubmitting && (
              <Message content="Thinking..." role="assistant" />
            )}
          </div>
        )}
      </div>
      <div className="form-container">
        <Form
          aria-disabled={isSubmitting}
          method="post"
          ref={formRef}
          onSubmit={handleFormSubmit}
          replace
        >
          <div className="input-wrap">
            <label htmlFor="message">Ask a question</label>
            <textarea
              id="message"
              aria-disabled={isSubmitting}
              ref={inputRef}
              className="auto-growing-input"
              placeholder="Ask a question"
              name="message"
              onChange={handleTextareaChange}
              required
              rows={1}
              onKeyDown={submitFormOnEnter}
              minLength={2}
              disabled={isSubmitting}
            />
            <input
              type="hidden"
              value={JSON.stringify(chatHistory)} name="chat-history"
            />
            <button
              aria-label="Submit"
              aria-disabled={isSubmitting}
              type="submit"
              disabled={isSubmitting}
            >
              <SendIcon />
            </button>
          </div>
        </Form>
        <p className="made-with">Made with ❤️ by <a target="_blank" href="http://joshuasanger.ca">Josh Sanger</a></p>
      </div>
    </main >
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <main className="error-container">
      <h1>Something went wrong!</h1>
      <p className="error">{error.message}</p>
      <p><Link to="/">Back to chat</Link></p>
    </main>
  );
}