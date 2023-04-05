import cn from 'classnames';
import {useEffect, useRef, useState} from 'react';
import ReactMarkdown from 'react-markdown';

import {Assistant as AssistantIcon, User as UserIcon} from '~/components/Icons';

import {Role} from '~/types';

export interface MessageProps {
  content: string;
  key?: string;
  role?: Role;
  error?: boolean;
  thinking?: boolean;
}

/**
 * Renders a message
 */
export default function Message({content, error, role = 'user', thinking = false}: MessageProps) {
  const rendered = useRef<null | boolean>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const messageWrapRef = useRef<HTMLDivElement>(null)
  const [messageHeight, setMessageHeight] = useState(0);

  const handleTransitionEnd = () => {
    const theMessageWrap = messageWrapRef.current;
    if (!theMessageWrap) {
      return;
    }

    theMessageWrap.removeAttribute('style');
  }

  useEffect(() => {
    const theMessage = messageRef.current;

    if (rendered.current !== null || !theMessage) {
      return
    }

    rendered.current = true;

    const contentHeight = theMessage.scrollHeight;
    const containerStyle = window.getComputedStyle(theMessage.parentElement!);
    const paddingTop = parseFloat(containerStyle.paddingTop);
    const paddingBottom = parseFloat(containerStyle.paddingBottom);
    const totalHeight = contentHeight + paddingTop + paddingBottom;

    setMessageHeight(totalHeight);
  }, []);

  useEffect(() => {
    const theMessageWrap = messageWrapRef.current;
    if (!theMessageWrap) {
      return;
    }

    theMessageWrap.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      theMessageWrap.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  return (
    <div
      className={cn(
        `message message-${role} w-full flex small-mobile:max-sm:text-sm transition-height duration-300`,
        role === 'user' ? 'justify-end' : 'justify-start',
        error && 'text-error'
      )}
      ref={messageWrapRef}
      style={{height: `${messageHeight}px`, overflow: 'hidden'}}
    >
      <div className={cn(
        'message-inner space-x-4 max-w-[480px] rounded-3xl p-4 transition-[opacity, transform] duration-300 delay-250 relative text-sm md:text-base',
        role === 'user' ? 'bg-black text-white rounded-br-none' : ' rounded-tl-none bg-slate-100 text-black',
        rendered.current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7',
      )}>
        <div className="response" ref={messageRef}>
          {thinking ? (
            <div className="flex gap-[5px] min-h-[20px] sm:min-h-[24px] items-center">
              <span className="thinking-bubble animate-thinking-1" />
              <span className="thinking-bubble animate-thinking-2" />
              <span className="thinking-bubble animate-thinking-3" />
            </div>
          ) : (
            <ReactMarkdown children={content} />
          )}
        </div>
      </div>
    </div>
  )
}