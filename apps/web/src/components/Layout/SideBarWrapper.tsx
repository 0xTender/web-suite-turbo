/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FCC } from "@app/utils/types";
import Sidebar from "./SideBar";

const SidebarWrapper: FCC = ({ children }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(30);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: { clientX: number }) => {
      if (isResizing && sidebarRef.current) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
            sidebarRef.current.getBoundingClientRect().left
        );
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (typeof window === "undefined") React.useLayoutEffect = useEffect;

  React.useLayoutEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="flex h-full flex-row overflow-scroll">
      <>
        <section
          ref={sidebarRef}
          className={`fixed left-0 top-0 z-50 flex h-full md:relative ${
            sidebarOpen ? "min-w-[300px] max-w-[33vw]" : "min-w-0 max-w-none"
          } shrink-0 grow-0 border-r bg-gray-50`}
          style={{ width: sidebarWidth }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {sidebarOpen ? (
            <>
              <div className="flex-1">
                <Sidebar />
              </div>
              <div
                className="shrink-0 grow-0 basis-2 cursor-col-resize resize-x justify-self-end hover:w-2 hover:bg-gray-400 active:bg-gray-300"
                onMouseDown={startResizing}
              />
              <button
                className="absolute right-0 top-1/2"
                onClick={() => {
                  setSidebarWidth(30);
                  setSidebarOpen(false);
                }}
              >
                <svg
                  className="h-6 w-6 text-gray-400 hover:text-gray-500 active:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </>
          ) : (
            <button
              className="absolute right-0 top-1/2"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <svg
                className="h-6 w-6 text-gray-400 hover:text-gray-500 active:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </section>
        <section className="z-1 ml-8 flex h-full flex-1 flex-col overflow-scroll p-8 pb-0 md:ml-0">
          {children}
        </section>
      </>
    </div>
  );
};

export default SidebarWrapper;
