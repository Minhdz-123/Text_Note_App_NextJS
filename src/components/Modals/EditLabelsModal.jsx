import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "../../utils/Icon";
import { useState } from "react";
import { EDIT_LABELS_TEXT } from "@/src/utils/Constants";

const EditLabelsModal = ({ isOpen, onClose, labels, setLabels }) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  const handleAddLabel = () => {
    const trimmed = newLabelName.trim();
    if (!trimmed) return;

    if (labels.find((l) => l.name === trimmed)) {
      setError(EDIT_LABELS_TEXT.ERROR_ALREADY_EXISTS);
      return;
    }

    setLabels([...labels, { id: Date.now().toString(), name: trimmed }]);
    setNewLabelName("");
  };

  const handleUpdateLabel = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    setLabels(labels.map((l) => (l.id === id ? { ...l, name: trimmed } : l)));
    setEditingId(null);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={EDIT_LABELS_TEXT.TITLE}>
      <div className="flex items-center h-10 mb-2 group px-1">
        <IconButton
          icon={newLabelName ? iconMap.close : iconMap.plus}
          onClick={() => {
            setNewLabelName("");
            setError("");
          }}
          size="w-8 h-8"
          textClass="text-[14px]"
          title={newLabelName ? "Hủy" : "Tạo nhãn mới"}
        />
        <input
          placeholder={EDIT_LABELS_TEXT.PLACEHOLDER_CREATE}
          className="flex-1 h-8 bg-transparent border-none outline-none px-3 py-1 text-sm border-b focus:border-gray-300 dark:focus:border-[#5f6368] border-transparent dark:text-[#e8eaed] transition-colors"
          value={newLabelName}
          onChange={(e) => {
            setNewLabelName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAddLabel()}
        />
        <IconButton
          icon={iconMap.check}
          onClick={handleAddLabel}
          size="w-8 h-8"
          textClass="text-[14px]"
          title="Tạo nhãn"
          className={
            newLabelName ? "opacity-100" : "opacity-0 pointer-events-none"
          }
        />
      </div>

      {error && (
        <p className="text-red-500 text-[11px] ml-11 mb-2 italic">{error}</p>
      )}

      <div className="max-h-75 overflow-y-auto custom-scrollbar">
        {labels.map((label) => (
          <div
            key={label.id}
            className="flex items-center h-10 group px-1"
            onMouseEnter={() => setHoveredId(label.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <IconButton
              icon={
                editingId === label.id
                  ? iconMap.trash
                  : hoveredId === label.id
                    ? iconMap.trash
                    : iconMap.label
              }
              onClick={() => {
                if (editingId === label.id || hoveredId === label.id) {
                  setLabels(labels.filter((l) => l.id !== label.id));
                }
              }}
              size="w-8 h-8"
              textClass="text-[14px]"
              title={
                editingId === label.id || hoveredId === label.id
                  ? EDIT_LABELS_TEXT.TOOLTIP_DELETE
                  : ""
              }
            />
            <input
              className={`flex-1 h-8 bg-transparent border-none outline-none px-3 py-1 text-sm border-b focus:border-gray-300 dark:focus:border-[#5f6368] dark:text-[#e8eaed] transition-colors ${editingId === label.id ? "border-gray-300 dark:border-[#5f6368]" : "border-transparent group-hover:border-gray-300 dark:group-hover:border-[#5f6368]"}`}
              value={editingId === label.id ? editValue : label.name}
              onFocus={() => {
                setEditingId(label.id);
                setEditValue(label.name);
              }}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleUpdateLabel(label.id)
              }
              onBlur={() => setTimeout(() => setEditingId(null), 200)}
            />
            <IconButton
              icon={editingId === label.id ? iconMap.check : iconMap.pen}
              onClick={() =>
                editingId === label.id
                  ? handleUpdateLabel(label.id)
                  : setEditingId(label.id)
              }
              size="w-8 h-8"
              textClass="text-[14px]"
              title={
                editingId === label.id ? "Lưu" : EDIT_LABELS_TEXT.TOOLTIP_RENAME
              }
              className={
                editingId === label.id || hoveredId === label.id
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
              }
            />
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

export default EditLabelsModal;
