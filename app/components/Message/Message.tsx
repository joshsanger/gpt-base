import cn from 'classnames';
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

/**
 * Renders a message
 */
export default function Message({content, error, key, role = 'user'}: MessageProps) {
  return (
    <div
      className={cn(
        'message',
        role,
        error && 'message-error'
      )}
      key={key}
    >
      <div className="message-inner">
        <span className="message-role">
          {<RoleIcon role={role} error={error} />}
        </span>
        <div>
          <ReactMarkdown children={content} />
        </div>
      </div>
    </div>
  )
}