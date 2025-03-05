import { Card, Iconify } from '@/components/common'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, children, header, size = 'md', customDialogClasses = '' }) => {
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  const dialog = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: '240',
        dampness: '0'
      },
     },
    exit: { opacity: 0, y: 50,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
     },
  }

  return (
    <AnimatePresence mode="wait">
      { isOpen && (
        <motion.div 
          initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0  }}
          className="fixed inset-0 bg-dark bg-opacity-50 z-[10000]"
        >
          <div className="inset-0 absolute overflow-y-auto p-4" onClick={handleBackdropClick}>
            <motion.div 
              variants={dialog}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`modal-dialog-${size} mx-auto top-[90px] relative`}
            >
              <Card
                customClasses={customDialogClasses}
                header={<>
                  {header}
                  <Iconify onClick={() => onClose()} className="text-xl p-2 cursor-pointer ml-auto opacity-70 hover:opacity-100" icon="mingcute:close-fill" />
                </>}
              >
                {children}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
