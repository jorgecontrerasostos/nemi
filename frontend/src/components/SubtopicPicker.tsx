interface Props {
  subtopics: string[];
  onSelect: (topic: string) => void;
}

export default function SubtopicPicker({ subtopics, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {subtopics.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelect(topic)}
          className="px-4 py-2 rounded-full border border-indigo-300 text-indigo-700 text-sm bg-white active:bg-indigo-50 min-h-[44px] transition-colors"
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
