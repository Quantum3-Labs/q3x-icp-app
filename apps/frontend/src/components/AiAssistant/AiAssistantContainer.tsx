"use client";
import React from "react";
import ChatBoxContainer from "./ChatBoxContainer";
import ChatHistoryContainer from "./ChatHistoryContainer";

export default function AiAssistantContainer() {
  return (
    <div className="flex flex-row gap-1 h-full bg-app-background">
      <ChatBoxContainer className="flex-3" />
      <ChatHistoryContainer className="flex-1" />
    </div>
  );
}
