import React, { Fragment, useRef } from 'react';
import { Dialog } from '@headlessui/react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const cancelButtonRef = useRef(null);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      initialFocus={cancelButtonRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      transition
    >
      <div className="fixed inset-0 bg-secondary-800 bg-opacity-75 transition-opacity" aria-hidden="true" />
      
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <Dialog.Panel
          className={`inline-block transform rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${maxWidthClasses[maxWidth]} w-full transition ease-out duration-300 data-[closed]:opacity-0 data-[closed]:scale-95`}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-secondary-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-4">{children}</div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;