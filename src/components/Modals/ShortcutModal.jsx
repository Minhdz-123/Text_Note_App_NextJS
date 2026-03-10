import BaseModal from "../Commons/BaseModal";
import { KEYBOARD_SHORTCUTS } from "@/src/utils/Data";
import IconButton from "../Commons/IconButton";
import { iconMap } from "../../utils/Icon";

const ShortcutModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="w-150 h-[80vh]"
      showFooter={false}
      bodyClassName="p-6 overflow-y-auto custom-scrollbar flex-1"
      scrollable={false}
      customHeader={
        <div className="flex justify-between items-center p-4 pb-2 border-b border-gray-200 dark:border-[#5f6368] shrink-0">
          <h3 className="text-[22px] font-medium px-2 font-['Google_Sans',Roboto,Arial,sans-serif]">
            Phím tắt
          </h3>
          <IconButton
            icon={iconMap.close}
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-100 dark:hover:bg-[#3c3c3c]"
            title="Đóng"
          />
        </div>
      }
    >
      {KEYBOARD_SHORTCUTS.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h4 className="text-[15px] font-medium mb-3">{section.category}</h4>
          <div className="space-y-3">
            {section.shortcuts.map((shortcut, sIdx) => (
              <div
                key={sIdx}
                className="flex justify-between items-start text-[14px] border-b border-gray-100 dark:border-[#3c3c3c] pb-2"
              >
                <span className="text-[#3c4043] dark:text-[#9aa0a6] mr-4">
                  {shortcut.label}
                </span>
                <span className="font-bold font-mono text-right whitespace-nowrap">
                  {shortcut.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </BaseModal>
  );
};

export default ShortcutModal;
