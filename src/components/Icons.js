import React from "react";
import c from "classnames";

import { ReactComponent as MoveToInbox } from "../assets/inbox.svg";
import { ReactComponent as Trash } from "../assets/trash.svg";
import { ReactComponent as Chevron } from "../assets/chevron.svg";
import { ReactComponent as Schedule } from "../assets/schedule.svg";
import { ReactComponent as Repeat } from "../assets/repeat.svg";
import { ReactComponent as Close } from "../assets/close.svg";
import { ReactComponent as Sidebar } from "../assets/sidebar.svg";

const buildProps = (className) => ({
  height: "18",
  className: c("text-gray-600 fill-current inline", className || ''),
});

export const MoveToInboxIcon = () => <MoveToInbox {...buildProps()} />;
export const TrashIcon = () => <Trash {...buildProps()} />;
export const ChevronRightIcon = () => (
  <Chevron {...buildProps("transform rotate-90")} />
);
export const ChevronLeftIcon = () => (
  <Chevron {...buildProps("transform -rotate-90")} />
);
export const ScheduleIcon = () => <Schedule {...buildProps()} />;
export const RepeatIcon = () => <Repeat {...buildProps()} />;
export const CloseIcon = () => <Close {...buildProps()} />;
export const SidebarIcon = () => <Sidebar {...buildProps()} />;