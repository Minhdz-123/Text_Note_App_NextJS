import { useRef, useState } from "react";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "../../utils/Icon";
import { EDIT_LABELS_TEXT } from "@/src/utils/Constants";

const LabelItem = ({ label, labels, setLabels }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label.name);
  const inputRef = useRef(null);

  const handleUpdate = () => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditValue(label.name);
      setIsEditing(false);
      return;
    }
    if (labels.find((l) => l.name === trimmed && l.id !== label.id)) {
      setEditValue(label.name);
      setIsEditing(false);
      return;
    }
    setLabels(labels.map((l) => (l.id === label.id ? { ...l, name: trimmed } : l)));
    setIsEditing(false);
  };

  const handleDelete = () => {
    setLabels(labels.filter((l) => l.id !== label.id));
  };

  return (
    <div className="flex items-center h-10 group px-1 transition-colors">
      {!isEditing ? (
        <>
          <div className="flex group-hover:hidden">
            <IconButton icon={iconMap.label} size="w-8 h-8" textClass="text-[14px]" />
          </div>
          <div className="hidden group-hover:flex">
            <IconButton
              icon={iconMap.trash}
              onClick={handleDelete}
              size="w-8 h-8"
              textClass="text-[14px]"
              title={EDIT_LABELS_TEXT.TOOLTIP_DELETE}
            />  
          </div>
        </>
      ) : (
        <div className="flex">
          <IconButton
            icon={iconMap.trash}
            onClick={handleDelete}
            size="w-8 h-8"
            textClass="text-[14px]"
            title={EDIT_LABELS_TEXT.TOOLTIP_DELETE}
          />
        </div>
      )}

      <input
        ref={inputRef}
        className={`flex-1 h-8 bg-transparent border-none outline-none px-3 py-1 text-sm border-b focus:border-gray-300 dark:focus:border-[#5f6368] dark:text-[#e8eaed] transition-colors ${isEditing
            ? "border-gray-300 dark:border-[#5f6368]"
            : "border-transparent group-hover:border-gray-300 dark:group-hover:border-[#5f6368]"
          }`}
        value={isEditing ? editValue : label.name}
        onFocus={() => {
          setIsEditing(true);
          setEditValue(label.name);
        }}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
        onBlur={() => setTimeout(() => setIsEditing(false), 200)}
      />

      <IconButton
        icon={isEditing ? iconMap.check : iconMap.pen}
        onClick={() => {
          if (isEditing) {
            handleUpdate();
          } else {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        size="w-8 h-8"
        textClass="text-[14px]"
        title={isEditing ? EDIT_LABELS_TEXT.TOOLTIP_SAVE : EDIT_LABELS_TEXT.TOOLTIP_RENAME}
        className={
          isEditing
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200"
        }
      />
    </div>
  );
};

const EditLabelsModal = ({ isOpen, onClose, labels, setLabels }) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [error, setError] = useState("");

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
          title={newLabelName ? EDIT_LABELS_TEXT.TOOLTIP_CANCEL : EDIT_LABELS_TEXT.TOOLTIP_CREATE}
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
          title={EDIT_LABELS_TEXT.TOOLTIP_ADD}
          className={
            newLabelName ? "opacity-100" : "opacity-0 pointer-events-none"
          }
        />
      </div>

      {error && (
        <p className="text-red-500 text-[11px] ml-11 mb-2 italic">{error}</p>
      )}

      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {labels.map((label) => (
          <LabelItem key={label.id} label={label} labels={labels} setLabels={setLabels} />
        ))}
      </div>
    </BaseModal>
  );
};

export default EditLabelsModal;
