import { FormEvent, ReactNode } from 'react'
import styles from './Button.module.css'

type Props = {
  children: ReactNode
  onClick?: (e: FormEvent) => void
  type: 'primary' | 'back' | 'position'
}

export default function Button({ children, onClick, type }: Props) {
  return (
    <button onClick={onClick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </button>
  )
}
