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
}

export interface RoleIconProps {
  error?: boolean;
  role: Role;
}

/**
 * Returns the role icon based on the role (user, assistant, system)
 * @param role The role of the message
 * @param error Set to true if the message is an error
 *
 * @returns The role icon
 */
const RoleIcon = ({role, error}: RoleIconProps) => {
  switch (role) {
    case 'system':
    case 'assistant':
      return <AssistantIcon error={error} />;
    case 'user':
      return <UserIcon />;
    default:
      return <AssistantIcon />;;
  };
};

const getRoleClasses = (role: Role) => {
  switch (role) {
    case 'system':
    case 'assistant':
      return 'bg-white';
    case 'user':
      return 'bg-light-shade';
    default:
      return '';
  }
};


/**
 * Renders a message
 */
export default function Message({content, error, role = 'user'}: MessageProps) {
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
        role === 'user' ? 'justify-end text-right' : 'justify-start',
        error && 'text-error'
      )}
      ref={messageWrapRef}
      style={{height: `${messageHeight}px`, overflow: 'hidden'}}
    >
      <div className={cn(
        'message-inner space-x-4 max-w-[480px] rounded-3xl p-4 transition-[opacity, transform] duration-300 delay-250 relative',
        role === 'user' ? 'bg-black text-white rounded-tr-none' : ' rounded-tl-none bg-slate-100 text-black',
        rendered.current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7',
      )}>
        <div className="response" ref={messageRef}>
          <ReactMarkdown children={content} />
        </div>
      </div>
    </div>
  )
}