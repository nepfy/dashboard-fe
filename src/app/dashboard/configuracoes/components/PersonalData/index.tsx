"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";

import UploadIcon from "#/components/icons/UploadIcon";

export default function PersonalData() {
  const { user } = useUser();
  return (
    <div className="max-w-[595px] bg-white-neutral-light-100 border border-white-neutral-light-300 rounded-[12px] p-6">
      <p className="text-white-neutral-light-900 font-medium leading-[18px]">
        Dados Pessoais
      </p>

      <div className="py-6 flex items-center justify-start">
        <div className="h-[88px] w-[88px] rounded-full bg-gray-300 mr-6">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              width={88}
              height={88}
              alt="Foto de perfil usuário"
              className="rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
        <div className="flex items-center justify-center">
          <button className="border border-white-neutral-light-300 button-inner bg-white-neutral-light-100 rounded-xs w-[36px] h-[36px] flex items-center justify-center mr-2">
            <UploadIcon fill="#1C1A22" width="14" height="14" />
          </button>
          <p className="text-white-neutral-light-900 font-medium">
            {" "}
            Upload de Imagem{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
