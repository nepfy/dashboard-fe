"use client";

import CloseIcon from "#/components/icons/CloseIcon";

const notifications = [
  {
    id: 1,
    title: "Um contrato venceu",
    message:
      "O contrato com Kate Morrison está prestes a vencer. Entre em contato com o cliente.",
    date: "2023-10-01",
    type: "contract",
  },
  {
    id: 2,
    title: "Proposta visualizada",
    message:
      "Kate Morrison acabou de visualizar sua proposta para o projeto CRM Admin Pages. Fique atento!",
    date: "2023-10-02",
    type: "proposal",
  },
];

export default function Notifications({
  isNotificationOpen,
  setIsNotificationOpenAction,
}: {
  isNotificationOpen: boolean;
  setIsNotificationOpenAction: (isOpen: boolean) => void;
}) {
  return (
    <div className="bg-filter absolute top-0 left-0 z-40 w-full h-full">
      <div
        className={`${
          isNotificationOpen ? "block" : "hidden"
        } absolute sm:right-7 sm:top-2 sm:mt-2 bg-white sm:shadow-lg sm:rounded-xs z-10 sm:w-[397px] h-full sm:h-auto`}
      >
        <div className="flex items-center justify-between p-4 border-gray-200 ">
          <p className="text-lg font-normal text-gray-900">Notificações</p>
          <div
            className="button-inner h-[44px] w-[44px] p-4 rounded-xs border border-white-neutral-light-300 flex items-center justify-center cursor-pointer hover:bg-white-neutral-light-200"
            onClick={() => setIsNotificationOpenAction(!isNotificationOpen)}
          >
            <CloseIcon width="16" height="16" />
          </div>
        </div>

        <div className="py-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-start p-4 border-t border-gray-200"
            >
              <div className="h-[32px] w-[32px] bg-primary-light-10 rounded-xs flex items-center justify-center cursor-pointer mr-4">
                {/* Add any action icon here */}
              </div>
              <div className="flex flex-col w-[80%]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white-neutral-light-800">
                    {notification.title}
                  </p>
                  <p className="text-xs font-normal text-white-neutral-light-600">
                    {notification.date}
                  </p>
                </div>
                <p className="text-sm font-normal text-white-neutral-light-500">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
