import { ReactNode } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
