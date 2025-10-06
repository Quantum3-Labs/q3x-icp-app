"use client";

import React, { useState } from "react";

interface Contact {
  name: string;
  address: string;
  company: string;
}

export default function AddressBookContainer({ className }: { className?: string }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [hoveredContact, setHoveredContact] = useState<string | null>(null);

  const contacts: Contact[] = [
    { name: "Tim Cook", address: "0xd...s78", company: "Apple" },
    { name: "Olivia Chen", address: "0xd...s78", company: "Google" },
    { name: "Benjamin Carter", address: "0xd...s78", company: "Lenovo" },
    { name: "Sophia Rodriguez", address: "0xd...s78", company: "Xiaomi" },
    { name: "Liam Goldberg", address: "0xd...s78", company: "Apple" },
    { name: "Isabella Nguyen", address: "0xd...s78", company: "Google" },
    { name: "Noah Kim", address: "0xd...s78", company: "Lenovo" },
    { name: "Mia Williams", address: "0xd...s78", company: "Xiaomi" },
  ];

  const companies = ["All", "Apple", "Google", "Lenovo", "Xiaomi"];

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = selectedFilter === "All" || contact.company === selectedFilter;
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className={`flex flex-col p-3 gap-3 w-full bg-background h-full rounded-lg border border-divider ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <button className="bg-gradient-to-b from-[#9c9c9c] to-[#303030] cursor-pointer flex  items-center justify-center px-2 py-1 rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(131,131,131,0.5),0px_0px_0px_1px_#a1a1a1] w-25">
            <span className="font-medium text-sm text-white">New group</span>
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="w-[29px] h-[3px] bg-[#e0e0e0] rounded-full rotate-90"></div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 items-center overflow-x-auto">
            {companies.map(company => (
              <button
                key={company}
                onClick={() => setSelectedFilter(company)}
                className={`px-4 py-1 rounded-[20px] text-sm font-medium cursor-pointer ${
                  selectedFilter === company ? "bg-primary text-white" : "bg-[#e0e0e0] text-[#676767]"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 items-center">
          {/* Search input */}
          <div className="flex gap-1.5 items-center px-3 w-[150px] bg-white rounded-xl border border-divider py-1">
            <img src="/misc/search-icon.svg" alt="Search" className="w-4 h-4" />
            <input
              type="text"
              placeholder="Enter name"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className=" text-[#adadad] outline-none placeholder:text-[#adadad]"
            />
          </div>

          {/* New contact button */}
          <button className="bg-gradient-to-b from-[#48b3ff] to-[#0059ff] cursor-pointer flex items-center justify-center px-5 h-full rounded-[10px] shadow-[0px_2px_4px_-1px_rgba(12,12,106,0.5),0px_0px_0px_1px_#4470ff] w-[137px] py-1">
            <span className="font-semibold text-base text-white">New contact</span>
          </button>
        </div>
      </div>

      {/* Contact list */}
      <div className="flex flex-col gap-1">
        {filteredContacts.map((contact, index) => (
          <div
            key={contact.name}
            onClick={() => setSelectedContact(contact.name)}
            onMouseEnter={() => setHoveredContact(contact.name)}
            onMouseLeave={() => setHoveredContact(null)}
            className={`flex gap-2 items-start justify-start p-[10px] w-full cursor-pointer transition-all duration-200 ${
              selectedContact === contact.name
                ? "bg-primary"
                : hoveredContact === contact.name
                ? "bg-[#f0f0f0]"
                : "bg-[#f7f7f7]"
            }`}
          >
            <div className="grow">
              <span
                className={`text-base tracking-[-0.32px] ${
                  selectedContact === contact.name ? "text-white" : "text-[#3f3f3f]"
                }`}
              >
                {contact.name}
              </span>
            </div>

            <button
              className={`py-[5px] rounded-full text-xs font-medium px-2 leading-none transition-colors duration-200 ${
                selectedContact === contact.name ? "bg-white text-primary" : "bg-primary text-white"
              }`}
            >
              {contact.address}
            </button>

            {selectedContact === contact.name && (
              <img src="/arrow/thin-arrow-up-right.svg" alt="Active contact" className="w-6 h-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
