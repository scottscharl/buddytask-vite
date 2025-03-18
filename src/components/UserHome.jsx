import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePocket } from "../contexts/PocketContext";
import { usePartnerTasks } from "../hooks/usePartnerTasks";
import PageTitle from "./PageTitle";
import TaskList from "./TaskList";
import PartnerTaskList from "./PartnerTaskList";

export default function UserHome() {
  const navigate = useNavigate();
  const { user, pb } = usePocket();
  const { partnership, partnerId } = usePartnerTasks();
  const [activeTab, setActiveTab] = React.useState("my-tasks");
  const [partnerName, setPartnerName] = useState("Partner");

  // Fetch partner's name when partnerId is available
  useEffect(() => {
    async function fetchPartnerInfo() {
      if (partnerId) {
        try {
          const partnerRecord = await pb.collection("users").getOne(partnerId);
          if (partnerRecord) {
            // Use name or username or whatever field you have for user's name
            setPartnerName(
              partnerRecord.name || partnerRecord.username || "Partner"
            );
          }
        } catch (error) {
          console.error("Error fetching partner info:", error);
        }
      }
    }

    fetchPartnerInfo();
  }, [partnerId, pb]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Page Title */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Partnership</h1>
      </div> */}

      {/* Main content container with tab and content styling */}
      <div className="overflow-hidden rounded-md shadow-sm">
        {/* Tab navigation */}
        <div className="flex bg-gray-100">
          <button
            onClick={() => setActiveTab("my-tasks")}
            className={`px-6 py-3 font-medium rounded-t-md relative cursor-pointer ${
              activeTab === "my-tasks"
                ? "text-blue-600 bg-white border-t-3 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors`}
            aria-current={activeTab === "my-tasks" ? "page" : undefined}
          >
            My Tasks
            {/* Create a "lip" at the bottom of the active tab to connect it to the content */}
            {activeTab === "my-tasks" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("partner-tasks")}
            className={`px-6 py-3 font-medium rounded-t-md flex items-center relative cursor-pointer ${
              activeTab === "partner-tasks"
                ? "text-amber-600 bg-white border-t-3 border-amber-500"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors`}
            aria-current={activeTab === "partner-tasks" ? "page" : undefined}
          >
            <span className="inline-flex items-center">
              <span>{partnerName}'s Tasks</span>
            </span>
            {/* Create a "lip" at the bottom of the active tab to connect it to the content */}
            {activeTab === "partner-tasks" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        </div>

        {/* Content area without border */}
        <div className="p-4 bg-white">
          {/* Conditionally render the appropriate task list without Section wrappers */}
          {activeTab === "my-tasks" ? (
            <TaskList />
          ) : (
            <PartnerTaskList colorScheme="amber" />
          )}
        </div>
      </div>
    </div>
  );
}
