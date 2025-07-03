// components/CustomLinkPreview.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LinkPreviewMeta } from "@/types/t";

export const LinkPreview: React.FC<{ href?: string }> = ({ href }) => {
  const [meta, setMeta] = useState<LinkPreviewMeta>();

  useEffect(() => {
    if (!href) return;
    axios
      .get(`/api/link-preview?url=${encodeURIComponent(href)}`)
      .then((res) => setMeta(res.data))
      .catch(() => null);
  }, [href]);

  if (!href) return null;

  if (!meta) {
    return (
      <a href={href} className="text-blue-600 hover:underline">
        {href}
      </a>
    );
  }

  return (
    <div className="rounded-md border border-gray-300 p-4 mt-4 ">
      <div className="truncate font-semibold text mb-1">{meta.title}</div>
      <div className="truncate text-gray-600 text-sm mb-2">{meta.description}</div>
      <div className="truncate flex items-center gap-2 h-7">
        <img src={meta.favicon} className="w-4 h-4" alt="favicon" />
        <a href={href} target="_blank" rel="noreferrer" className="text-sm hover:underline">
          {href}
        </a>
      </div>
    </div>
  );
};
