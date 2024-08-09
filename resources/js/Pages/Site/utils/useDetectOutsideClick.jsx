import { useEffect } from 'react';

function useDetectOutsideClick(
  modalRef,
  closeRefs,
  visibilityState,
  setVisibilityState
) {
  useEffect(() => {
    function handleClickOutside(event) {
      const refs = Array.isArray(closeRefs) ? closeRefs : [closeRefs];

      const isOutsideClick = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isOutsideClick
      ) {
        setVisibilityState(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, closeRefs, visibilityState, setVisibilityState]);
}

export default useDetectOutsideClick;
