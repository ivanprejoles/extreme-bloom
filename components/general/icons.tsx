import { Cart } from "@prisma/client"
import { CheckIcon, CircleIcon, CountdownTimerIcon, CrossCircledIcon } from "@radix-ui/react-icons"

export type IconProps = React.HTMLAttributes<SVGElement>
export type StatusProps = 'Done' | 'Waiting' | 'Declined';

export const Icons = {
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
}

export function getStatusIcon(status: StatusProps) {
    const statusIcons = {
        'Done': CheckIcon,
        'Waiting': CountdownTimerIcon,
        'Declined': CrossCircledIcon 
    }
  
    return statusIcons[status] || CircleIcon
  }