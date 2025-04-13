import { useState } from "react";
import { ChevronDown } from "lucide-react";

const communities = ["React", "Django", "Next.js", "Node.js", "Python", "JavaScript"];

export default function SearchableDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string|null>(null);

  const filteredCommunities = communities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-56">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white border border-gray-300 font-medium px-3 py-2 rounded-lg gap-x-2 w-full"
      >
        <img src="https://via.placeholder.com/40" alt="" className="w-8 h-8 rounded-full" />
        <span>{selected || "Select a community"}</span>
        <ChevronDown size={17} strokeWidth={2.5} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 outline-none"
          />

          {/* Options */}
          <ul className="max-h-40 overflow-y-auto">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <li
                  key={community}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelected(community);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {community}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
