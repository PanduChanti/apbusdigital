import React, { useEffect, useRef } from 'react';

const CustomModal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef(null);
  const bsModal = useRef(null); // To store the Bootstrap Modal instance

  useEffect(() => {
    if (modalRef.current) {
      if (window.bootstrap && window.bootstrap.Modal) {
        bsModal.current = new window.bootstrap.Modal(modalRef.current, {
          backdrop: 'static',
          keyboard: false
        });

        modalRef.current.addEventListener('hidden.bs.modal', onClose);

        return () => {
          if (modalRef.current) {
            modalRef.current.removeEventListener('hidden.bs.modal', onClose);
          }
          if (bsModal.current) {
            bsModal.current.dispose();
            bsModal.current = null;
          }
        };
      } else {
        console.error("Bootstrap's Modal JS not found on window.bootstrap.Modal. Ensure Bootstrap CDN is loaded correctly in public/index.html.");
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (bsModal.current) {
      if (isOpen) {
        bsModal.current.show();
      } else {
        bsModal.current.hide();
      }
    }
  }, [isOpen]);

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex="-1"
      aria-labelledby="customModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title h3 fw-bold text-dark" id="customModalLabel">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;