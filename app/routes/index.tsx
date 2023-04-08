import React, {useRef, useEffect, useCallback, useState} from 'react';
import {Configuration, OpenAIApi, ChatCompletionRequestMessage} from 'openai';

import {type ActionArgs} from '@remix-run/node';
import {Form, useActionData, useNavigation, Link, useSubmit, useLocation, useNavigate} from '@remix-run/react';

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
  const maxTextareaRows = 3;

  const data = useActionData<typeof action>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const submit = useSubmit();
  const [chatHistory, setChatHistory] = useState<ChatHistoryProps[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
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
    const value = (event.target as HTMLTextAreaElement).value;

    if (event.key === 'Enter' && !event.shiftKey && value.trim().length > 2) {
      saveUserMessage(value);
      submit(formRef.current, {replace: true});
    }
  }, [submit, formRef, saveUserMessage]);

  /**
   * Scrolls to the bottom of the chat container
   * TODO: Conisder reduced motion
   * @param animationDuration The duration of the animation in milliseconds
   */
  const scrollToBottom = useCallback((animationDuration: number = 300) => {
    const body = document.body;
    const html = document.documentElement;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const targetScrollTop = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
      );
      const progress = (currentTime - startTime) / animationDuration;

      window.scrollTo({ top: targetScrollTop });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  /**
   * Sets the chat history when the page is loaded or the history is traversed (back / forward)
   */
  const setChat = useCallback(() => {
    if (location.state?.chatHistory) {
      setChatHistory(location.state.chatHistory);
      scrollToBottom();
    }
  }, [location, setChatHistory, scrollToBottom]);

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
      inputRef.current.rows = 1;
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
      const newAnswer = {
        content: data.answer as string,
        role: 'assistant',
      };

      pushChatHistory(newAnswer as ChatHistoryProps);

      // push location to history
      navigate('/', {
        state: {
          ...location.state,
          chatHistory: [...chatHistory, newAnswer],
        },
      })
    }
  }, [data, pushChatHistory, navigate]);

  /**
   * Clears the chat history when the page is loaded without any state
   */
  useEffect(() => {
    if (!location.state) {
      setChatHistory([]);
      scrollToBottom();
    }
  }, [location, setChatHistory, scrollToBottom]);

  /**
   * Sets the chat history when the page is loaded or the history is traversed (back / forward)
   */
  useEffect(() => {
    setChat();
  }, [setChat]);

  /**
   * Scrolls to the bottom of the chat container when the chat history changes
   */
  useEffect(() => {
    if (!chatContainerRef.current) {
      return;
    }

    if (chatHistory.length) {
      scrollToBottom();
    }
  }, [chatHistory, scrollToBottom]);

  return (
    <main className="container mx-auto rounded-lg h-full grid grid-rows-layout p-4 pb-0 sm:p-8 sm:pb-0 max-w-full sm:max-w-auto">
      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.length === 0 && (
          <div className="intro grid place-items-center h-full text-center">
            <div className="intro-content">
              <h1 className="text-4xl font-semibold">OpenAI base</h1>
              <p className="mt-4">Ask anything 😊</p>
            </div>
          </div>
        )}
        {chatHistory.length > 0 && (
          <div className="messages max-w-maxWidth mx-auto min-h-full grid place-content-end grid-cols-1 gap-4">
            {chatHistory.map((chat, index) => (
              <React.Fragment key={`message-${index}`}>
                <Message
                  error={chat.error}
                  content={chat.content}
                  role={chat.role}
                />
              </React.Fragment>
            ))}
            {isSubmitting && (
              <Message thinking role="assistant" content="" />
            )}
          </div>
        )}
      </div>
      <div className="form-container p-4 sm:p-8 backdrop-blur-md sticky bottom-0">
        <Form
          aria-disabled={isSubmitting}
          method="post"
          ref={formRef}
          onSubmit={handleFormSubmit}
          replace
          className="max-w-[500px] mx-auto"
        >
          <div className="input-wrap relative flex items-center">
            <label htmlFor="message" className="absolute left[-9999px] w-px h-px overflow-hidden">Ask a question</label>
            <textarea
              id="message"
              aria-disabled={isSubmitting}
              ref={inputRef}
              className="auto-growing-input m-0 appearance-none text-black placeholder:text-black resize-none text-sm md:text-base py-3 pl-5 pr-14 border border-slate-400 outline-none rounded-4xl w-full block leading-6 bg-white"
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
              className="absolute right-0 flex-shrink-0 items-center appearance-none text-black h-[50px] w-[50px] border-none cursor-pointer shadow-none rounded-4xl grid place-items-center group transition-colors disabled:cursor-not-allowed focus:outline-dark-blue"
              type="submit"
              disabled={isSubmitting}
            >
              <SendIcon />
            </button>
          </div>
        </Form>
        <p className="made-with text-xs text-center mt-4">
          Made with ❤️ by <a target="_blank" href="http://joshuasanger.ca">Josh Sanger</a>
        </p>
      </div>
    </main>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <main className="container mx-auto rounded-lg h-full grid grid-rows-layout p-4 pb-0 sm:p-8 sm:pb-0 max-w-full sm:max-w-auto">
      <div className="chat-container">
        <div className="intro grid place-items-center h-full text-center">
          <div className="intro-content inline-block px-4 py-8 border border-error rounded-lg">
            <h1 className="text-3xl font-semibold">Oops, something went wrong!</h1>
            <p className="mt-4 text-error ">{error.message}</p>
            <p className="mt-4"><Link to="/">Back to chat</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}