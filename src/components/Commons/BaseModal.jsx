const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "w-80",
  showFooter = true,
  customHeader = null,
  bodyClassName = "p-4 pb-2",
  scrollable = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className={`${className} bg-white dark:bg-[#2d2e31] rounded-lg shadow-lg flex flex-col text-[#202124] dark:text-[#e8eaed]`}
        onClick={(e) => e.stopPropagation()}
      >

        {customHeader && customHeader}

        <div className={bodyClassName}>
          {title && (
            <h3 className="text-base font-medium mb-4 px-1">{title}</h3>
          )}
          {scrollable ? (
            <div className="custom-scrollbar">{children}</div>
          ) : (
            children
          )}
        </div>

        {showFooter && (
          <div className="flex justify-end p-2 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onClose}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] rounded text-sm font-medium transition-colors"
            >
              Xong
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseModal;
