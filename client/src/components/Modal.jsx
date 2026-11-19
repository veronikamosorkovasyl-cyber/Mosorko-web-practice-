import { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-title"
            onClose={onClose}
            onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="modal__body">
        <h2 id="modal-title">{title}</h2>
        {children}
        <button className="btn" type="button" onClick={onClose}>Закрити</button>
      </div>
    </dialog>
  );
}
