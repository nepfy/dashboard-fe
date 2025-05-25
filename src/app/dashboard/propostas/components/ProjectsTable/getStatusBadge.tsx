import { ProjectsDataProps } from "./types";

export const getStatusBadge = (status: ProjectsDataProps["projectStatus"]) => {
  switch (status) {
    case "active":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-primary-light-400 bg-primary-light-400"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">Enviada</span>
        </span>
      );
    case "approved":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-green-light-100 bg-green-light-50"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">Aprovada</span>
        </span>
      );
    case "negotiation":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-yellow-light-100 bg-yellow-light-50"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">
            Em negociação
          </span>
        </span>
      );
    case "rejected":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-red-light-50 bg-[#FF2D30]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">
            Rejeitada
          </span>
        </span>
      );
    case "draft":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-white-neutral-light-200 bg-white-neutral-light-300"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">Rascunho</span>
        </span>
      );
    case "expired":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-white-neutral-light-500 bg-white-neutral-light-400"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">Expirada</span>
        </span>
      );
    case "archived":
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-white-neutral-light-800 bg-white-neutral-light-600"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">
            Arquivada
          </span>
        </span>
      );
    default:
      return (
        <span className="flex items-center justify-start gap-2">
          <div
            className="w-[12px] h-[12px] rounded-3xs border border-primary-light-500 bg-primary-light-25"
            style={{
              backgroundImage: `repeating-linear-gradient(
                  45deg,
                  rgba(255,255,255,0.3) 0px,
                  rgba(255,255,255,0.3) 1px,
                  transparent 1px,
                  transparent 3px
                )`,
            }}
          />
          <span className="text-md text-white-neutral-light-900">{status}</span>
        </span>
      );
  }
};
