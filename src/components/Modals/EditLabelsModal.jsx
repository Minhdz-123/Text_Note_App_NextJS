import { useRef, useState } from "react";
import BaseModal from "../Commons/BaseModal";
import IconButton from "../Commons/IconButton";
import { iconMap } from "../../utils/Icon";
import { EDIT_LABELS_TEXT } from "@/src/utils/Constants";

const LabelItem = ({ label, labels, setLabels, onMergeRequest }) => {
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
    const existingLabel = labels.find((l) => l.name === trimmed && l.id !== label.id);
    if (existingLabel) {
      onMergeRequest(label, existingLabel);
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

const EditLabelsModal = ({ isOpen, onClose, labels, setLabels, onMergeLabels }) => {
  const [newLabelName, setNewLabelName] = useState("");
  const [error, setError] = useState("");
  const [mergeTarget, setMergeTarget] = useState(null);

  const confirmMerge = () => {
    if (mergeTarget && onMergeLabels) {
      onMergeLabels(mergeTarget.oldLabel.id, mergeTarget.newLabel.id);
    }
    setMergeTarget(null);
  };

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
    <BaseModal isOpen={isOpen} onClose={onClose} title={EDIT_LABELS_TEXT.TITLE} scrollable={false}>
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

      <div className="mt-2">
        {labels.map((label) => (
          <LabelItem key={label.id} label={label} labels={labels} setLabels={setLabels} onMergeRequest={(oldL, newL) => setMergeTarget({ oldLabel: oldL, newLabel: newL })} />
        ))}
      </div>

      {mergeTarget && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50" onClick={() => setMergeTarget(null)}>
          <div className="bg-white dark:bg-[#2d2e31] p-6 rounded-lg shadow-lg w-[32rem] max-w-[90vw] text-[#202124] dark:text-[#e8eaed]" onClick={(e) => e.stopPropagation()}>
            <p className="mb-6 whitespace-pre-wrap text-base font-normal">
              Hợp nhất nhãn "{mergeTarget.oldLabel.name}" với nhãn "{mergeTarget.newLabel.name}"? Tất cả các ghi chú được gắn nhãn "{mergeTarget.oldLabel.name}" sẽ được gắn nhãn "{mergeTarget.newLabel.name}" và nhãn "{mergeTarget.oldLabel.name}" sẽ bị xóa.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setMergeTarget(null)} className="px-6 py-2 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] rounded text-sm font-medium transition-colors">
                Hủy
              </button>
              <button autoFocus onClick={confirmMerge} className="px-6 py-2 text-[#8ab4f8] hover:bg-blue-50 dark:hover:bg-[#3c3c3c] rounded text-sm font-medium transition-colors">
                Hợp nhất
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default EditLabelsModal;
