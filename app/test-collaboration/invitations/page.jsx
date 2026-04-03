"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useInvitations } from "@/src/hooks/useInvitations";
import { INVITATION_TEXT } from "@/src/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconMap } from "@/src/utils/Icon";

export default function InvitationsPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.userInfo);
  const { invitations, fetching, respondLoading, respondToInvite } = useInvitations(user?.email);

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [user, router]);

  const handleAccept = async (invite) => {
    await respondToInvite(invite.id, "accepted");
    router.push(`/share/${invite.shareId}`);
  };

  const handleDecline = async (invite) => {
    await respondToInvite(invite.id, "declined");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent p-8 w-full max-w-none pt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-3">
          <FontAwesomeIcon icon={iconMap.userPlus} className="text-blue-500" />
          {INVITATION_TEXT.SIDEBAR_TITLE}
        </h1>

        {fetching ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#202124] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={iconMap.notification} className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {INVITATION_TEXT.EMPTY}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-[#202124] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-1">
                    {invite.senderName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {invite.senderEmail} vừa mời bạn chỉnh sửa:{" "}
                    <span className="font-semibold italic text-blue-600 dark:text-blue-400">
                      {invite.noteTitle || "Ghi chú không tiêu đề"}
                    </span>
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecline(invite)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    {INVITATION_TEXT.DECLINE}
                  </button>
                  <button
                    onClick={() => handleAccept(invite)}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  >
                    {INVITATION_TEXT.ACCEPT}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
